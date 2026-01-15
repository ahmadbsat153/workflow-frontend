"use client";

import { FormEvent, useState, useEffect } from "react";
import { Button } from "@/lib/ui/button";
import { Input } from "@/lib/ui/input";
import { FadeIn, FadeInStagger } from "@/lib/components/Motion/FadeIn";
import { useRouter, useParams } from "next/navigation";
import { UserCheck2Icon, Loader2 } from "lucide-react";
import { MoveLeftIcon } from "lucide-react";
import { API_AUTH } from "@/lib/services/auth_service";
import { URLs } from "@/lib/constants/urls";
import { handleServerError } from "@/lib/api/_axios";
import { ErrorResponse } from "@/lib/types/common";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

const AcceptInvitationPage = () => {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [passwordVisibility, setPasswordVisibility] = useState<{
    [key: string]: boolean;
  }>({
    password: false,
    confirm_password: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [userInfo, setUserInfo] = useState<{
    email: string;
    firstname: string;
    lastname: string;
  } | null>(null);

  const changePasswordVisibility = (key: string) => {
    setError("");
    setPasswordVisibility({
      ...passwordVisibility,
      [key]: !passwordVisibility[key],
    });
  };

  const handleAcceptInvitation = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      setLoading(true);
      await API_AUTH.acceptInvitation({
        token,
        password,
      });
      toast.success(
        "Invitation accepted! You can now log in with your password."
      );
      router.push(URLs.auth.login);
    } catch (e) {
      handleServerError(e as ErrorResponse, (err_msg) => {
        setError(err_msg as string);
        toast.error(err_msg);
      });
    } finally {
      setLoading(false);
    }
  };

  const validateToken = async () => {
    try {
      setValidating(true);
      const res = await API_AUTH.validateInvitation({ token });

      if (res.valid && res.data) {
        setUserInfo(res.data);
        return true;
      }
      return false;
    } catch (e) {
      handleServerError(e as ErrorResponse, (err_msg) => {
        toast.error(err_msg);
        return false;
      });
      return false;
    } finally {
      setValidating(false);
    }
  };

  const GoBack = () => router.push(URLs.auth.login);

  useEffect(() => {
    if (password.trim() !== "" && confirmPassword.trim() !== "") {
      if (password === confirmPassword && password.length >= 8) {
        setIsDisabled(false);
      } else {
        setIsDisabled(true);
      }
    } else {
      setIsDisabled(true);
    }
  }, [password, confirmPassword]);

  useEffect(() => {
    // Check if the token is valid
    const checkToken = async () => {
      const isValid = await validateToken();
      if (!isValid) {
        toast.error("Invalid or expired invitation link");
        router.push(URLs.auth.login);
      }
    };
    checkToken();
  }, [router, validateToken]);

  if (validating) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Validating invitation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="h-full flex items-center justify-center w-full rounded-lg shadow-sm relative">
        {/* The Image */}
        <div className="w-1/2 h-full bg-muted hidden lg:block">
          <Image
            src="/images/login.png"
            alt=""
            fill
            className="absolute inset-0 h-full w-full object-cover"
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
                  Accept Invitation
                </h1>
                {userInfo && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-muted-foreground">
                      Welcome,{" "}
                      <span className="font-semibold text-default">
                        {userInfo.firstname} {userInfo.lastname}
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {userInfo.email}
                    </p>
                  </div>
                )}
              </div>
            </FadeIn>

            <FadeIn>
              <form
                className="mt-8"
                onSubmit={(e) => handleAcceptInvitation(e)}
              >
                <div className="space-y-3 relative sm:mt-2.5">
                  <Input
                    id="password"
                    name="password"
                    type={passwordVisibility.password ? "text" : "password"}
                    required
                    size="sm"
                    label="Password"
                    variant="default"
                    placeholder="Enter your password"
                    className="w-full"
                    onPostFixIconClick={() =>
                      changePasswordVisibility("password")
                    }
                    postFixIcon={
                      passwordVisibility.password ? (
                        <EyeIcon size={22} />
                      ) : (
                        <EyeOffIcon size={22} />
                      )
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Input
                    id="confirm_password"
                    name="confirm_password"
                    type={
                      passwordVisibility.confirm_password ? "text" : "password"
                    }
                    required
                    size="sm"
                    label="Confirm password"
                    variant="default"
                    placeholder="Confirm your password"
                    className="w-full"
                    onPostFixIconClick={() =>
                      changePasswordVisibility("confirm_password")
                    }
                    postFixIcon={
                      passwordVisibility.confirm_password ? (
                        <EyeIcon size={22} />
                      ) : (
                        <EyeOffIcon size={22} />
                      )
                    }
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Password must be at least 8 characters
                  </div>
                  <Button
                    className="w-full disabled:cursor-not-allowed disabled:opacity-50"
                    type="submit"
                    isDisabled={isDisabled || loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <UserCheck2Icon size="5" />
                    )}
                    {loading ? "Processing..." : "Accept Invitation"}
                  </Button>
                  {error && <p className="text-destructive text-sm">{error}</p>}
                </div>
              </form>
            </FadeIn>
          </FadeInStagger>
        </div>
      </div>
    </div>
  );
};

export default AcceptInvitationPage;
