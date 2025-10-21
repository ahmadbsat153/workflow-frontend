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
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { toast } from "sonner";

const page = () => {
    // This page is used to reset the password
  const router = useRouter();
  const params = useParams();
  const pass_slug = params.slug as string;

  const [inputValues, setInputValues] = useState({
    "password": "",
    "confirm_password": "",
  });
  const [isDisabled, setIsDisabled] = useState(true);
  const [passwordVisibility, setPasswordVisibility] = useState<{ [key: string]: boolean }>({
    "password": false,
    "confirm_password": false,
  });
  const [error, setError] = useState("");
  const changePasswordVisibility = (key: string) => {
    setError("");
    setPasswordVisibility({
      ...passwordVisibility,
      [key]: !passwordVisibility[key],
    });
  }
  const handlePasswordReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await API_AUTH.resetPassword(inputValues.password, pass_slug);
      router.push(URLs.auth.login);
    } catch (e) {
      handleServerError(e as ErrorResponse, (err_msg) => {
        setError(err_msg as string);
        toast.error(err_msg);
      });
    }
  };

  const validateToken = async() => {
    try{
      const data = {
        "recovery_token": pass_slug
      }
      const res = await API_AUTH.validateRecoveryToken(data);
      return res.status == 200
    }catch(e){
      handleServerError(e as ErrorResponse, (err_msg) => {
        setError(err_msg as string);
        return false
      });
    }
    
  };
  const GoBack = () => router.back();

  useEffect(() => {
    if(inputValues.password.trim() !== "" && inputValues.confirm_password.trim() !== ""){
      if(inputValues.password == inputValues.confirm_password){
        setIsDisabled(false);
      }else{
        setIsDisabled(true);
      }
    }
  },[inputValues])
  useEffect(() => {
    //Check if the token is valid
    if(!validateToken()){
      //TODO: Handle the case where the token is invalid ex: redirect to 404
      router.push(URLs.auth.login);
    }
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
                    type={passwordVisibility.password ? "text" : "password"}
                    required
                    size="sm"
                    label="Password"
                    variant="default"
                    placeholder=""
                    className="w-full"
                    onPostFixIconClick={() => changePasswordVisibility("password")}
                    postFixIcon={passwordVisibility.password ? <EyeIcon size={22} /> : <EyeOffIcon size={22} />}
                    value={inputValues.password}
                    onChange={(e) => setInputValues({ ...inputValues, password: e.target.value })}
                  />
                  <Input
                    id="confirm_password"
                    name="confirm_password"
                    type={passwordVisibility.confirm_password ? "text" : "password"}
                    required
                    size="sm"
                    label="Confirm password"
                    variant="default"
                    placeholder=""
                    className="w-full"
                    onPostFixIconClick={() => changePasswordVisibility("confirm_password")}
                    postFixIcon={passwordVisibility.confirm_password ? <EyeIcon size={22} /> : <EyeOffIcon size={22} />}
                    value={inputValues.confirm_password}
                    onChange={(e) => setInputValues({ ...inputValues, confirm_password: e.target.value })}
                  />
                  <Button
                    className="w-full disabled:cursor-not-allowed disabled:opacity-50"
                    type="submit"
                    isDisabled={isDisabled}
                  >
                    <FileLock2Icon size="5" />
                    Reset
                  </Button>
                  {error && <p className="text-destructive">{error}</p>}
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
