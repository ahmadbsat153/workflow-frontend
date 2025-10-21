"use client";

import { FormEvent, useState, useEffect } from "react";
import { Button } from "@/lib/ui/button";
import { Input } from "@/lib/ui/input";
import { FadeIn, FadeInStagger } from "@/lib/components/Motion/FadeIn";
import { useRouter } from "next/navigation";
import { FileLock2Icon } from "lucide-react";
import { MoveLeftIcon } from "lucide-react";
import { API_AUTH } from "@/lib/services/auth_service";
import { URLs } from "@/lib/constants/urls";
import { toast } from "sonner";
import { handleServerError } from "@/lib/api/_axios";
import { ErrorResponse } from "@/lib/types/common";

const page = () => {
  // This page is used to send a magic link, to reset the password
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const handleMagicLinkSending = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await API_AUTH.sendMagicLink(email);
      // router.push(URLs.auth.resetPassword);
      toast.success("An email has been sent to you");
    } catch (e) {
      console.log(e);
      handleServerError(e as ErrorResponse, (err_msg) => {
        setError(err_msg as string);
      });
    }

  };
  const GoBack = () => router.back();
  return (
    <div className="h-screen w-full flex items-center justify center">
      <div className="h-full flex items-center justify-center w-full rounded-lg shadow-sm relative">
        {/* The Image */}
        <div className="w-1/2 h-full bg-muted hidden lg:block">
          <img
            src="/images/login.png"
            alt=""
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
              <h1 className="font-bold leading-tight text-2xl text-center">
                Forgot Password
              </h1>
            </FadeIn>

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
                    label="Email"
                    variant="default"
                    placeholder="example@example.com"
                    className="w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button
                    className="w-full disabled:cursor-not-allowed disabled:opacity-50"
                    type="submit"
                  >
                    <FileLock2Icon size="5" />
                    Reset
                  </Button>
                </div>
              </form>
            </FadeIn>
          </FadeInStagger>
        </div>
      </div>
    </div>
  );
};
export default page;
