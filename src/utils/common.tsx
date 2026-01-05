/* eslint-disable @typescript-eslint/no-explicit-any */
import { getUrl } from "@/lib/constants/urls";
import { parseISO, format } from "date-fns";

export const hexToRgb = (hex: any) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const getInitials = (userName?: string) => {
  if (userName) {
    const words = userName.split(" ");
    const initials = words.map((word) => word.charAt(0).toUpperCase());
    const initialsString = initials.join("");

    return initialsString;
  }

  return "";
};

export const isLinkActive = (url: string, pathname: string) => {
  let link = url;

  if (link && typeof link === "string" && link.endsWith("/")) {
    link = link.slice(0, -1);
  }

  return `${pathname}/`.includes(url);
};

export const formatDates = (date: string) => {
  const parsedDate = parseISO(date);
  const formattedDate = format(parsedDate, "MMMM d, h:mm a");

  return formattedDate;
};

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_FRONTEND_HOST}/${path}`;
}

export const addValidationError = (
  condition: boolean | string | undefined | number,
  message: string,
  messages: string[]
) => {
  if (condition) {
    messages.push(message);
  }
};

export const build_path = (
  endpoint: string,
  params?: Record<string, string>
) => {
  const missing_params: string[] = [];

  const result = endpoint.replace(/:([a-zA-Z0-9_-]+)/g, (_, key) => {
    if (params && params[key] !== undefined) {
      return params[key];
    }

    missing_params.push(key);

    return `:${key}`;
  });

  if (missing_params.length > 0) {
    throw new Error(`Missing parameter(s): ${missing_params.join(", ")}`);
  }

  return result;
};

export const to24HourFormat = (isoString: string) => {
  const date = new Date(isoString);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

export const to12HourFormat = (isoString: string) => {
  const date = new Date(isoString);
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${hours}:${minutes} ${ampm}`;
};

export const redirect = (url: string, callback: string) => {
  return `${getUrl(url)}?callback=${callback}`;
};

export const format_pricing = (price: number) => {
  return price
    .toFixed(0)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const formatDatesWithYear = (date: string) => {
  const parsedDate = parseISO(date);
  const formattedDate = format(parsedDate, "MMMM d, yyyy h:mm a");

  return formattedDate;
};

export const formatDatesWithYearWithoutTime = (date: string) => {
  const parsedDate = parseISO(date);
  const formattedDate = format(parsedDate, "MMMM d, yyyy");

  return formattedDate;
};
