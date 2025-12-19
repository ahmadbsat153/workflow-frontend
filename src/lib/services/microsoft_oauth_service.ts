import { _axios } from "../api/_axios";

export type MicrosoftOAuthConfig = {
  clientId: string;
  authority: string;
  redirectUri: string;
  scopes: string[];
};

export type MicrosoftAuthSuccessMessage = {
  type: "MICROSOFT_AUTH_SUCCESS";
  token: string;
  user: any;
  permissions: string[];
};

export type MicrosoftAuthErrorMessage = {
  type: "MICROSOFT_AUTH_ERROR";
  error: string;
  errorDescription: string;
};

export type MicrosoftAuthMessage =
  | MicrosoftAuthSuccessMessage
  | MicrosoftAuthErrorMessage;

class MicrosoftOAuthService {
  private popup: Window | null = null;
  private messageListener: ((event: MessageEvent) => void) | null = null;
  private popupCheckInterval: NodeJS.Timeout | null = null;

  /**
   * Get Microsoft OAuth configuration from backend
   */
  async getConfig(): Promise<MicrosoftOAuthConfig> {
    const response = await _axios.get("/api/v1/auth/microsoft");
    return response.data;
  }

  /**
   * Build OAuth authorization URL
   */
  private buildAuthUrl(config: MicrosoftOAuthConfig): string {
    const params = new URLSearchParams({
      client_id: config.clientId,
      response_type: "code",
      redirect_uri: config.redirectUri,
      response_mode: "query",
      scope: config.scopes.join(" "),
    });

    return `${config.authority}/oauth2/v2.0/authorize?${params.toString()}`;
  }

  /**
   * Open Microsoft login popup
   */
  async openLoginPopup(): Promise<MicrosoftAuthSuccessMessage> {
    return new Promise(async (resolve, reject) => {
      try {
        // Get OAuth config from backend
        const config = await this.getConfig();

        // Build authorization URL
        const authUrl = this.buildAuthUrl(config);

        // Open popup window
        const width = 500;
        const height = 600;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        this.popup = window.open(
          authUrl,
          "Microsoft Login",
          `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
        );

        if (!this.popup) {
          reject(
            new Error(
              "Failed to open popup. Please allow popups for this site."
            )
          );
          return;
        }

        // Listen for messages from popup (backend sends postMessage from callback)
        this.messageListener = (event: MessageEvent) => {
          console.log("Received postMessage:", event);
          console.log("Message origin:", event.origin);
          console.log("Window origin:", window.location.origin);
          console.log("Message data:", event.data);

          // Security: Accept messages from backend (localhost:8080) or same origin
          const allowedOrigins = [
            window.location.origin, // Frontend origin
            "http://localhost:8080", // Backend origin
            process.env.NEXT_PUBLIC_API_URL, // Production API URL if set
          ].filter(Boolean);

          if (!allowedOrigins.includes(event.origin)) {
            console.warn(
              "Rejected message from unauthorized origin:",
              event.origin,
              "Allowed origins:",
              allowedOrigins
            );
            return;
          }

          const data = event.data as MicrosoftAuthMessage;

          if (data.type === "MICROSOFT_AUTH_SUCCESS") {
            console.log("Authentication successful:", data);
            this.cleanup();
            resolve(data);
          } else if (data.type === "MICROSOFT_AUTH_ERROR") {
            console.error("Authentication error:", data);
            this.cleanup();
            reject(new Error(data.errorDescription || data.error));
          }
        };

        window.addEventListener("message", this.messageListener);

        // Check if popup was closed manually (but give time for message to arrive)
        this.popupCheckInterval = setInterval(() => {
          if (this.popup && this.popup.closed) {
            clearInterval(this.popupCheckInterval!);
            // Wait a bit before rejecting to allow message to arrive
            setTimeout(() => {
              // Only reject if we haven't cleaned up yet (cleanup happens on success/error)
              if (this.messageListener !== null) {
                this.cleanup();
                reject(new Error("Login cancelled"));
              }
            }, 200);
          }
        }, 500);
      } catch (error) {
        this.cleanup();
        reject(error);
      }
    });
  }

  /**
   * Clean up popup and event listeners
   */
  private cleanup() {
    if (this.popupCheckInterval) {
      clearInterval(this.popupCheckInterval);
      this.popupCheckInterval = null;
    }

    if (this.popup && !this.popup.closed) {
      this.popup.close();
    }
    this.popup = null;

    if (this.messageListener) {
      window.removeEventListener("message", this.messageListener);
      this.messageListener = null;
    }
  }
}

export const microsoftOAuthService = new MicrosoftOAuthService();
