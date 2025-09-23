"use client";

import DotsLoader from "@/lib/components/Loader/DotsLoader";
// import NotFound from "@/lib/components/Pages/NotFound";
import { URLs, getUrl } from "@/lib/constants/urls";
import { useAuth } from "@/lib/context/AuthContext";
import NotFound from "./lib/components/Pages/NotFound";

import React from "react";

interface AuthGuardProviderProps {
  children: React.ReactNode;
  is_admin?: boolean;
}

const AuthGuardProvider = ({
  children,
  is_admin = false,
}: AuthGuardProviderProps) => {
  const { validating, logged, isAdmin } = useAuth();

  if (validating) {
    return (
      <div className="h-screen flex items-center justify-center">
        <DotsLoader />
      </div>
    );
  }

  if (!validating && !logged) {
    return (
      <NotFound
        error="Not Authenticated!"
        description="Please login or register to be able to access this page."
        title="Login"
        url={getUrl(URLs.auth.login)}
      />
    );
  }

  if (!validating && isAdmin !== is_admin) {
    return (
      <NotFound
        error="Not Authorized!"
        description="You do not have access to view this page."
        title="Login"
        url={getUrl(URLs.auth.login)}
      />
    );
  }

  return children;
};

export default AuthGuardProvider;
