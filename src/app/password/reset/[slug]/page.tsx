"use client";

import { FormEvent, useState, useEffect } from "react";
import { Button } from "@/lib/ui/button";
import { Input } from "@/lib/ui/input";
import { FadeIn, FadeInStagger } from "@/lib/components/Motion/FadeIn";
import { useRouter, useParams } from "next/navigation";
import { FileLock2Icon } from "lucide-react";
import { MoveLeftIcon } from "lucide-react";
import { API_AUTH } from "@/lib/services/auth_service";
import { URLs } from "@/lib/constants/urls";
import { handleServerError } from "@/lib/api/_axios";
import { ErrorResponse } from "@/lib/types/common";
import { EyeIcon, EyeClosedIcon } from "lucide-react";
const page = () => {
    // This page is used to reset the password
  const router = useRouter();
  const params = useParams();
  const pass_slug = params.slug as string;

  const [inputValues, setInputValues] = useState({
    "password": "",
    "confirm_password": "",
  });
  const [passwordVisibility, setPasswordVisibility] = useState<{ [key: string]: boolean }>({
    "password": false,
    "confirm_password": false,
  });
  const [error, setError] = useState("");
  const changePasswordVisibility = (key: string) => {
    setPasswordVisibility({
      ...passwordVisibility,
      [key]: !passwordVisibility[key],
    });
  }
  const handlePasswordReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
    //   await API_AUTH.forgotPassword(inputValues);
      router.push(URLs.auth.login);
    } catch (e) {
      console.log(e);
      handleServerError(e as ErrorResponse, (err_msg) => {
        setError(err_msg as string);
      });
    }
  };
  const validateToken = async() => {
    try{
      const res = await API_AUTH.validate();
      console.log(res)
    }catch(e){
      handleServerError(e as ErrorResponse, (err_msg) => {
        setError(err_msg as string);
      });
    }
    
  };
  const GoBack = () => router.back();

  useEffect(() => {
    //Check if the token is valid
    validateToken();
  }, []);
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
                Reset Password
              </h1>
            </FadeIn>

            <FadeIn>
              <form
                className="mt-8"
                onSubmit={(e) => handlePasswordReset(e)}
              >
                <div className="space-y-3 relative sm:mt-2.5">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    size="sm"
                    label="Password"
                    variant="default"
                    placeholder=""
                    className="w-full"
                    postFixIcon={<button onClick={() => changePasswordVisibility("password")}>{passwordVisibility.password ? <EyeIcon /> : <EyeClosedIcon  />}</button>}
                    value={inputValues.password}
                    onChange={(e) => setInputValues({ ...inputValues, password: e.target.value })}
                  />
                  <Input
                    id="confirm_password"
                    name="confirm_password"
                    type="password"
                    required
                    size="sm"
                    label="Confirm password"
                    variant="default"
                    placeholder=""
                    className="w-full"
                    postFixIcon={<button onClick={() => changePasswordVisibility("confirm_password")}>{passwordVisibility.confirm_password ? <EyeIcon /> : <EyeClosedIcon  />}</button>}
                    value={inputValues.confirm_password}
                    onChange={(e) => setInputValues({ ...inputValues, confirm_password: e.target.value })}
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
