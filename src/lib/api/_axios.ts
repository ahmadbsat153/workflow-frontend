/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const BACKEND_HOST = process.env.NEXT_PUBLIC_BACKEND_HOST;

export const _axios = axios.create({
  baseURL: BACKEND_HOST,
  withCredentials: true,
  timeout: 60000,
});

_axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("AFW_token");
    const preference = localStorage.getItem("preferences-storage");
    const preferredCurrency = getCookie("preferredCurrency");

    if (token) {
      const parsedToken = JSON.parse(token);
      config.headers["Authorization"] = `Bearer ${parsedToken}`;
    }

    if (preference) {
      const preference_parsed = JSON.parse(preference);
      config.headers["X-Session-ID"] = preference_parsed?.state?.session_id || null;
    }

    if (preferredCurrency) {
      config.headers["X-Currency-Id"] = preferredCurrency;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

export function handleErrors(error: unknown): Error {
  if (error instanceof Error) {
    if (axios.isAxiosError(error)) {
      // Access to config, request, and response
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorBody = error.response.data;
        const message =
          errorBody?.message ||
          "Error was thrown but 'message' property not in response body";

        return new Error(message, { cause: error });
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        reportError(error);
        return error;
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
        return error;
      }
    } else {
      // Just a stock error
      reportError(error);
    }
    console.error("Error occured: ", error);
    return error;
  }
  return new Error("Error thrown is not of type error!");
}

export const handleServerError = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any,
  handleMessage: (message: null | string | Array<string>, json?: any) => void
) => {
  const detailedError = error;
  if (detailedError.cause) {
    const axiosErr = detailedError.cause;
    if (axiosErr?.response?.data) {
      // const errorMessages: Array<string> = [
      //   detailedError.cause.message,
      //   (axiosErr.response.data as { message: string }).message,
      // ];

      const errorMessages: string = (
        axiosErr.response.data as { message: string }
      ).message;

      handleMessage(errorMessages, axiosErr.response.data);
    }
  } else {
    handleMessage([detailedError.message ?? "An unknown error occurred"]);
  }
};

export function getCookie(name: string, default_val?: string): string {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts && parts.length === 2) {
    const cookieValue = parts.pop()?.split(";").shift();
    if (cookieValue) {
      return cookieValue;
    }
  }

  if (default_val) {
    return default_val;
  }

  return "";
}
