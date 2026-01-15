"use client";

import { toast } from "sonner";
import { Input } from "@/lib/ui/input";
import { Button } from "@/lib/ui/button";
import { useRouter } from "next/navigation";
import { URLs } from "@/lib/constants/urls";
import { ErrorResponse } from "@/lib/types/common";
import { handleServerError } from "@/lib/api/_axios";
import { FormEvent, useEffect, useState } from "react";
import { API_AUTH } from "@/lib/services/auth_service";
import { authImages } from "@/lib/constants/authImages";
import { FileLock2Icon, Loader2, MailIcon } from "lucide-react";
import { FadeIn, FadeInStagger } from "@/lib/components/Motion/FadeIn";
import { API_SETTINGS } from "@/lib/services/Settings/settings_service";
import Image from "next/image";

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const image_url = authImages.forgotPassword;
  const handleMagicLinkSending = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await API_AUTH.sendMagicLink(email);
      setEmailSent(true);
    } catch (e) {
      handleServerError(e as ErrorResponse, (err_msg) => {
        setError(err_msg as string);
        toast.error(err_msg);
      });
    } finally {
      setLoading(false);
    }
  };

  const GoBack = () => router.push(URLs.auth.login);
  // Initialize with default image if image_url is not a valid path
  const initialImage =
    image_url.startsWith("/") || image_url.startsWith("http")
      ? image_url
      : "/images/404.png";
  const [imageUrl, setImageUrl] = useState(initialImage);

  useEffect(() => {
    // Only fetch if image_url is a key (not a valid path)
    const isImageKey =
      !image_url.startsWith("/") && !image_url.startsWith("http");

    if (isImageKey) {
      const fetchImages = async () => {
        try {
          const backendHost =
            process.env.NEXT_PUBLIC_BACKEND_HOST || "http://localhost:8080";
          const response = await API_SETTINGS.getPublicAuthImages();
          const fetchedUrl =
            backendHost + response.data[image_url]?.value || "/images/404.png";
          setImageUrl(fetchedUrl);
          console.log("Image URL:", fetchedUrl);
        } catch (err) {
          console.error("Failed to load auth images:", err);
          // Fail silently - use default images if API fails
          setImageUrl("/images/404.png");
        }
      };

      fetchImages();
    }
  }, [image_url]);

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="h-full flex items-center justify-center w-full rounded-lg shadow-sm relative">
        {/* The Image */}
        <div className="w-1/2 h-full bg-muted relative hidden lg:block">
          <Image
            src={imageUrl || "/images/login.png"}
            alt="Login background"
            fill
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        {/* The Form */}
        <div className="w-1/2 h-full flex items-center">
          <FadeInStagger className="w-full sm:max-w-md xl:mx-auto ">
            <FadeIn>
              <div className="text-center mb-2">
                <h1 className="font-bold leading-tight text-2xl">
                  Forgot Password
                </h1>
                <p className="text-sm text-muted-foreground mt-2">
                  {` Enter your email address and we'll send you a link to reset
                  your password`}
                </p>
              </div>
            </FadeIn>

            {emailSent ? (
              <FadeIn>
                <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg text-center">
                  <MailIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Email Sent!</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {`  We've sent a password reset link to`}{" "}
                    <span className="font-semibold">{email}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    {`The link will expire in 60 minutes. Please check your spam
                    folder if you don't see it.`}
                  </p>
                  <Button variant="outline" onClick={GoBack} className="w-full">
                    Back to Login
                  </Button>
                </div>
              </FadeIn>
            ) : (
              <FadeIn>
                <form
                  className="mt-8"
                  onSubmit={(e) => handleMagicLinkSending(e)}
                >
                  <div className="space-y-3 relative sm:mt-2.5">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      size="sm"
                      label="Email Address"
                      variant="default"
                      placeholder="example@example.com"
                      className="w-full"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                    />
                    <Button
                      className="w-full disabled:cursor-not-allowed disabled:opacity-50"
                      type="submit"
                      isDisabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <FileLock2Icon size="5" />
                      )}
                      {loading ? "Sending Reset Link..." : "Send Reset Link"}
                    </Button>
                    {error && (
                      <p className="text-destructive text-sm text-center">
                        {error}
                      </p>
                    )}
                    <div className="text-center mt-4">
                      <button
                        type="button"
                        onClick={GoBack}
                        className="text-sm text-primary hover:underline"
                      >
                        Back to Login
                      </button>
                    </div>
                  </div>
                </form>
              </FadeIn>
            )}
          </FadeInStagger>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
