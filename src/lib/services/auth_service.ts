/* eslint-disable @typescript-eslint/no-explicit-any */
import { Authentication, Login, Register } from "@/lib/types/auth";
import { handleErrors, _axios } from "../api/_axios";
import { AUTH_ENDPOINTS } from "../constants/endpoints";
import { ResendResponse, SuccessResponse } from "../types/common";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace API_AUTH {
  export async function register(data: Register) {
    try {
      const response = await _axios.post(AUTH_ENDPOINTS.REGISTER, data);

      return response.data as Authentication;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function platform_invite(data: Register) {
    try {
      const response = await _axios.post(AUTH_ENDPOINTS.PLATFORM_INVITE, data);

      return response.data as SuccessResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function login(data: Login) {
    try {
      const response = await _axios.post(AUTH_ENDPOINTS.LOGIN, data);

      return response.data as Authentication;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function validate() {
    try {
      const response = await _axios.get(AUTH_ENDPOINTS.VALIDATE);

      return response.data as Authentication;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function validateRecoveryToken(data: any) {
    try {
      const response = await _axios.post(AUTH_ENDPOINTS.VALIDATE_RECOVERY_TOKEN, data);

      return response.data as Authentication;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function verifyEmail(data: any) {
    try {
      const response = await _axios.post(AUTH_ENDPOINTS.VERIFY_EMAIL, data);

      return response.data as SuccessResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function resendEmail(email: string) {
    try {
      const response = await _axios.post(AUTH_ENDPOINTS.RESEND_EMAIL, {
        email,
      });

      return response.data as ResendResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function forgotPassword(email: string) {
    try {
      const temp = { email };
      const response = await _axios.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, temp);

      return response.data as SuccessResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function resetPassword(password: string, token: string) {
    try {
      const temp = { password, token };
      const response = await _axios.post(AUTH_ENDPOINTS.RESET_PASSWORD, temp);

      return response.data as SuccessResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  export async function sendMagicLink(email: string) {
    try {
      const temp = { email };
      const response = await _axios.post(AUTH_ENDPOINTS.MAGIC_LINK, temp);

      return response.data as SuccessResponse;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }
}
