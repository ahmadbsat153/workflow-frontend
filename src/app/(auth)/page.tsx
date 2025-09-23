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

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const router = useRouter();
  const searchparams = useSearchParams();
  const callback = searchparams.get("callback");

  const { user, setUser, validating, isAdmin } = useAuth();

  useEffect(() => {
    if (user?.user) {
      router.push(
        getUrl(
          user.user.is_super_admin || isAdmin ? URLs.admin.dashboard : URLs.home
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

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await API_AUTH.login(credentials);

      if (response) {
        setUser(response);
        setSuccess(true);

        localStorage.setItem("AFW_token", JSON.stringify(response.token));

        router.push(
          getUrl(
            response.user.is_super_admin || isAdmin ? URLs.home : URLs.home
          )
        );
      }
    } catch (e) {
      handleServerError(e as ErrorResponse, (err_msg) => {
        setError(err_msg as string);
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
    <>
      <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8 sm:py-16 lg:py-24 w-full h-full">
        <FadeInStagger className="w-full sm:max-w-md xl:mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
              Log In
            </h2>

            <p className="mt-2 text-base font-medium">
              <Link
                href={
                  callback
                    ? redirect(URLs.auth.register, callback)
                    : getUrl(URLs.auth.register)
                }
                className="font-medium mx-1.5 text-blue-600 transition-all duration-200 hover:text-blue-700 hover:underline focus:text-blue-700 text-sm"
              >
                Create an account
              </Link>
            </p>
          </FadeIn>

          <FadeIn>
            <form className="mt-8" onSubmit={(e) => handleSignIn(e)}>
              <div className="space-y-3 sm:space-y-5">
                {/* {error && (
                  <Chip
                    size="lg"
                    radius="md"
                    variant="flat"
                    color="danger"
                    className="py-6 px-2 w-full"
                    classNames={{
                      base: "max-w-full w-full",
                      content: "font-semibold text-sm",
                    }}
                  >
                    {error}
                  </Chip>
                )} */}

                <div className="space-y-2 relative sm:mt-2.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="example@example.com"
                    className="w-full"
                    value={credentials.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>

                <div className="space-y-2 relative sm:mt-2.5">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={isVisible ? "text" : "password"}
                      required
                      placeholder="Password"
                      className="w-full pr-10" // Add padding to the right for the icon
                      value={credentials.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={toggleVisibility}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-2xl text-gray-400 focus:outline-none"
                    >
                      {isVisible ? (
                        <AiFillEyeInvisible className="pointer-events-none" />
                      ) : (
                        <AiFillEye className="pointer-events-none" />
                      )}
                    </button>
                  </div>

                  <div className="sm:mt-2 text-sm font-medium flex justify-end">
                    <Link
                      href={
                        callback
                          ? redirect(URLs.auth.forgotPassword, callback)
                          : getUrl(URLs.auth.forgotPassword)
                      }
                      className="font-medium ml-1 text-blue-600 transition-all duration-200 hover:text-blue-700 hover:underline focus:text-blue-700 text-sm"
                    >
                      Forgot password
                    </Link>
                  </div>

                  <div>
                    <Button
                      size="lg"
                      color={success ? "success" : "primary"}
                      type="submit"
                      disabled={success || loading}
                      className="w-full px-4 py-4 text-base font-semibold"
                    >
                      {success ? "Success" : "Log In"}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </FadeIn>
        </FadeInStagger>
      </div>
    </>
  );
}
