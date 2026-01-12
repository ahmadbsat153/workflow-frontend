/* eslint-disable @typescript-eslint/no-explicit-any */
import { handleErrors, _axios } from "@/lib/api/_axios";

export interface AuthImage {
  _id: string;
  key: string;
  value: string; // Image URL
  type: "image";
  category: "authentication";
  description?: string;
  updatedBy?: {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface GetAuthImagesResponse {
  success: boolean;
  data: Record<string, AuthImage | null>;
}

export interface UploadImageResponse {
  success: boolean;
  message: string;
  data: AuthImage;
}

export interface DeleteSettingResponse {
  success: boolean;
  message: string;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace API_SETTINGS {
  /**
   * Get all authentication images (Admin only)
   */
  export async function getAuthImages(): Promise<GetAuthImagesResponse> {
    try {
      const response = await _axios.get("/api/v1/admin/settings/auth-images");
      return response.data;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  /**
   * Upload authentication page image (Admin only)
   */
  export async function uploadAuthImage(
    key: string,
    file: File,
    description?: string
  ): Promise<UploadImageResponse> {
    try {
      const formData = new FormData();
      formData.append("key", key);
      formData.append("file", file);
      if (description) {
        formData.append("description", description);
      }

      const response = await _axios.post(
        "/api/v1/admin/settings/upload-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  /**
   * Delete authentication image (Admin only)
   */
  export async function deleteAuthImage(
    key: string
  ): Promise<DeleteSettingResponse> {
    try {
      const response = await _axios.delete(`/api/v1/admin/settings/${key}`);
      return response.data;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }

  /**
   * Get public authentication images (No auth required - for login/signup pages)
   */
  export async function getPublicAuthImages(): Promise<GetAuthImagesResponse> {
    try {
      const response = await _axios.get("/api/v1/settings/auth-images");
      return response.data;
    } catch (error: unknown) {
      throw handleErrors(error);
    }
  }
}
