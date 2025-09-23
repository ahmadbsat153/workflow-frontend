"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useState, useEffect } from "react";
import { _axios } from "../api/_axios";
import { getUrl, URLs } from "../constants/urls";
import { AUTH_ENDPOINTS } from "../constants/endpoints";
import { Authentication } from "../types/auth";

type AuthContextType = {
  user: Authentication | null;
  loading: boolean;
  logged: boolean;
  validating: boolean;
  isAdmin: boolean;
  logout: () => void;
  checkSession: () => void;
  setLogged: (val: boolean) => void;
  setUser: (user: Authentication | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { ReactNode } from "react";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Authentication | null>(null);
  const [logged, setLogged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const TOKEN_KEY = "AFW_token";

  const router = useRouter();

  useEffect(() => {
    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user) {
      setLogged(true);
      setIsAdmin(user.user.is_super_admin);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setLogged(false);
    setIsAdmin(false);
    // router.push(getUrl(URLs.auth.login));
  };

  const checkSession = async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setLoading(false);
      setValidating(false);
      return;
    }

    try {
      setLoading(true);
      setValidating(true);

      const parsedToken = JSON.parse(token);
      const response = await _axios.get(AUTH_ENDPOINTS.VALIDATE, {
        headers: {
          Authorization: `Bearer ${parsedToken}`,
        },
      });

      setLogged(true);
      setUser(response.data);

      localStorage.setItem(TOKEN_KEY, JSON.stringify(response.data.token));
    } catch (error) {
      console.error("Session verification failed:", error);
    } finally {
      setLoading(false);
      setValidating(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        logged,
        isAdmin,
        setLogged,
        setUser,
        logout,
        checkSession,
        loading,
        validating,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
