"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  API_SETTINGS,
  AuthImage,
} from "@/lib/services/Settings/settings_service";
import { ImageUploadCard } from "@/lib/components/Pages/Settings/ImageUploadCard";
import { ErrorResponse } from "@/lib/types/common";
import { handleServerError } from "@/lib/api/_axios";
import DotsLoader from "@/lib/components/Loader/DotsLoader";
import PageContainer from "@/lib/components/Container/PageContainer";

export default function AdminSettingsPage() {
  const [authImages, setAuthImages] = useState<
    Record<string, AuthImage | null>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAuthImages();
  }, []);

  const fetchAuthImages = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await API_SETTINGS.getAuthImages();
      setAuthImages(response.data);
    } catch (err: unknown) {
      const errorResponse = err as ErrorResponse;
      const errorMessage = errorResponse.message || "Failed to load images";
      setError(errorMessage);
      handleServerError(err as ErrorResponse, (err_msg) => {
        toast.error(err_msg);
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (
    key: string,
    file: File,
    description?: string
  ) => {
    try {
      const response = await API_SETTINGS.uploadAuthImage(
        key,
        file,
        description
      );

      setAuthImages((prev) => ({
        ...prev,
        [key]: response.data,
      }));

      toast.success("Image uploaded successfully!");
    } catch (err: unknown) {
      handleServerError(err as ErrorResponse, (err_msg) => {
        toast.error(err_msg);
      });
      throw err;
    }
  };

  const handleImageDelete = async (key: string) => {
    try {
      await API_SETTINGS.deleteAuthImage(key);

      setAuthImages((prev) => ({
        ...prev,
        [key]: null,
      }));

      toast.success("Image deleted successfully!");
    } catch (err: unknown) {
      handleServerError(err as ErrorResponse, (err_msg) => {
        toast.error(err_msg);
      });
      throw err;
    }
  };

  if (isLoading) {
    return (
      <div className="h-[70vh] w-full flex items-center justify-center">
        <DotsLoader />
      </div>
    );
  }

  return (
    <PageContainer>
      <div className="container mx-auto py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your application settings and preferences
          </p>
        </div>

        {/* Authentication Page Images Section */}
        <section className="space-y-4">
          <div className="border-b pb-4">
            <h2 className="text-2xl font-semibold">
              Authentication Page Images
            </h2>
            <p className="text-muted-foreground mt-1">
              Upload and manage images for authentication pages. These images
              will be displayed on login, logout, forgot password, and other
              authentication pages.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ImageUploadCard
              title="Login Page Image"
              settingKey="auth.login_page_image"
              currentImage={authImages["auth.login_page_image"]}
              onUpload={handleImageUpload}
              onDelete={handleImageDelete}
            />

            <ImageUploadCard
              title="Logout Page Image"
              settingKey="auth.logout_page_image"
              currentImage={authImages["auth.logout_page_image"]}
              onUpload={handleImageUpload}
              onDelete={handleImageDelete}
            />

            <ImageUploadCard
              title="Forgot Password Page Image"
              settingKey="auth.forgot_password_page_image"
              currentImage={authImages["auth.forgot_password_page_image"]}
              onUpload={handleImageUpload}
              onDelete={handleImageDelete}
            />

            <ImageUploadCard
              title="Reset Password Page Image"
              settingKey="auth.reset_password_page_image"
              currentImage={authImages["auth.reset_password_page_image"]}
              onUpload={handleImageUpload}
              onDelete={handleImageDelete}
            />

            <ImageUploadCard
              title="Signup Page Image"
              settingKey="auth.signup_page_image"
              currentImage={authImages["auth.signup_page_image"]}
              onUpload={handleImageUpload}
              onDelete={handleImageDelete}
            />

            <ImageUploadCard
              title="Logo Image"
              settingKey="auth.logo_image"
              currentImage={authImages["auth.logo_image"]}
              onUpload={handleImageUpload}
              onDelete={handleImageDelete}
            />
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
