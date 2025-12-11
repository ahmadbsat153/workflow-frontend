"use client";

import Link from "next/link";
import { redirect } from "@/utils/common";
import { ErrorResponse } from "@/lib/types/common";
import { URLs, getUrl } from "@/lib/constants/urls";
import { useAuth } from "@/lib/context/AuthContext";
import { handleServerError } from "@/lib/api/_axios";
import { FormEvent, useState, useEffect } from "react";
import { API_AUTH } from "@/lib/services/auth_service";
import DotsLoader from "@/lib/components/Loader/DotsLoader";
import { useRouter, useSearchParams } from "next/navigation";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FadeIn, FadeInStagger } from "@/lib/components/Motion/FadeIn";
import { Button } from "@/lib/ui/button";
import { Input } from "@/lib/ui/input";
import { Label } from "@/lib/ui/label";
import { toast } from "sonner";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [loadingAzure, setLoadingAzure] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const router = useRouter();
  const searchparams = useSearchParams();
  const callback = searchparams.get("callback");

  const { user, setUser, validating, isAdmin } = useAuth();

  useEffect(() => {
    if (user?.user) {
      router.push(
        //TODO: Make it dynamic based on permissions
        getUrl(
          user.user.is_super_admin || isAdmin
            ? URLs.admin.users
            : URLs.app.forms.index
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleChange = (field: keyof typeof credentials, value: string) => {
    const temp = { ...credentials };
    temp[field] = value;

    setCredentials(temp);
  };

  //TODO: Check how we're going to handle azure login
  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await API_AUTH.login(credentials);

      if (response) {
        setUser(response);
        setSuccess(true);

        localStorage.setItem("AFW_token", JSON.stringify(response.token));

        //TODO: Make it dynamic based on permissions
        router.push(
          getUrl(
            response.user.is_super_admin || isAdmin
              ? URLs.admin.users
              : URLs.app.forms.index
          )
        );
      }
    } catch (e) {
      handleServerError(e as ErrorResponse, (err_msg) => {
        toast.error(err_msg);
      });
    } finally {
      setLoading(false);
    }
  };

  if (validating || user) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <DotsLoader />
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex items-center justify center">
      <div className="h-full flex items-center justify-center w-full rounded-lg shadow-sm">
        <div className="w-1/2 h-full bg-muted relative hidden lg:block">
          <img
            src="/images/login.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div className="w-1/2 h-full flex items-center">
          <FadeInStagger className="w-full sm:max-w-md xl:mx-auto ">
            <FadeIn>
              <h1 className="font-bold leading-tight text-2xl text-center">
                Log In
              </h1>
            </FadeIn>

            <FadeIn>
              <form className="mt-8" onSubmit={(e) => handleSignIn(e)}>
                <div className="">
                  <div className="space-y-2 relative sm:mt-2.5">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      size="sm"
                      label="Email"
                      variant="default"
                      placeholder="example@example.com"
                      className="w-full"
                      value={credentials.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2 relative sm:mt-2.5">
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={isVisible ? "text" : "password"}
                        required
                        placeholder="Password"
                        label="Password"
                        size="sm"
                        errorMessage=""
                        className="w-full pr-10" // Add padding to the right for the icon
                        value={credentials.password}
                        onChange={(e) =>
                          handleChange("password", e.target.value)
                        }
                        postFixIcon={
                          isVisible ? (
                            <AiFillEyeInvisible className="pointer-events-none" />
                          ) : (
                            <AiFillEye className="pointer-events-none" />
                          )
                        }
                        onPostFixIconClick={toggleVisibility}
                      />
                    </div>

                    <div className="sm:mt-2 sm:mb-6 text-sm font-medium flex justify-end">
                      <Link
                        href={
                          callback
                            ? redirect(URLs.auth.forgotPassword, callback)
                            : getUrl(URLs.auth.forgotPassword)
                        }
                        className="font-medium ml-1 text-pumpkin transition-all duration-200 hover:text-text-pumpkin hover:underline  text-sm"
                      >
                        Forgot password!
                      </Link>
                    </div>

                    <div>
                      <Button
                        size="sm"
                        color={success ? "success" : "primary"}
                        type="submit"
                        isLoading={loading}
                        isDisabled={success || loading || loadingAzure}
                        className="w-full"
                      >
                        {success ? "Success" : "Log In"}
                      </Button>

                      {/* TODO: Implement Azure Login */}
                      <div className="hidden">
                        <div className="my-[3vh] w-full flex justify-center items-center h-[1px] bg-gray-400 relative">
                          <span className="text-gray-400 text-sm bg-white px-4">
                            OR CONTINUE WITH
                          </span>
                        </div>
                        <Button
                          size="sm"
                          isLoading={loadingAzure}
                          isDisabled={loading || loadingAzure}
                          className="w-full text-base "
                        >
                          Microsoft
                        </Button>
                        {/* <span className="text-destructive text-lg">{error}</span> */}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </FadeIn>
          </FadeInStagger>
        </div>
      </div>
    </div>
  );
}
