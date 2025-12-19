"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/lib/ui/button";
import { Input } from "@/lib/ui/input";
import { FadeIn, FadeInStagger } from "@/lib/components/Motion/FadeIn";
import { useRouter } from "next/navigation";
import { FileLock2Icon, Loader2, MailIcon } from "lucide-react";
import { MoveLeftIcon } from "lucide-react";
import { API_AUTH } from "@/lib/services/auth_service";
import { URLs } from "@/lib/constants/urls";
import { toast } from "sonner";
import { handleServerError } from "@/lib/api/_axios";
import { ErrorResponse } from "@/lib/types/common";

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

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

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="h-full flex items-center justify-center w-full rounded-lg shadow-sm relative">
        {/* The Image */}
        <div className="w-1/2 h-full bg-muted hidden lg:block">
          <img
            src="/images/login.png"
            alt=""
            // className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div className="absolute bg-white top-[1px] p-1 left-[49vw] rounded-bl-xl text-primary hover:bg-primary/80 hover:text-white!">
          <Button
            variant="ghost"
            className="rounded-full bg-transparent hover:bg-transparent"
          >
            <MoveLeftIcon size="5" onClick={GoBack} />
          </Button>
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
                  Enter your email address and we'll send you a link to reset
                  your password
                </p>
              </div>
            </FadeIn>

            {emailSent ? (
              <FadeIn>
                <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg text-center">
                  <MailIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Email Sent!</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    We've sent a password reset link to{" "}
                    <span className="font-semibold">{email}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    The link will expire in 60 minutes. Please check your spam
                    folder if you don't see it.
                  </p>
                  <Button
                    variant="outline"
                    onClick={GoBack}
                    className="w-full"
                  >
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
