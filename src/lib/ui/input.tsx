import * as React from "react";
import { Label } from "./label";
import { cn } from "@/lib/utils";

type CustomInputProps = {
  label?: string | React.ReactNode;
  labelPlacement?: "outside" | "inside";
  onError?: () => void;
  errorMessage?: string;
  variant?: "default" | "destructive" | "outline" | "secondary";
  size?: "default" | "sm" | "md" | "lg";
  onPostFixIconClick?: () => void;
  postFixIcon?: React.ReactNode;
  onPreFixIconClick?: () => void;
  preFixIcon?: React.ReactNode;
  required?: boolean;
};

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> &
  CustomInputProps;

const inputVariants = {
  variant: {
    default: "text-black",
    destructive:
      "border-2 border-red-400 text-destructive hover:border-destructive focus:border-0 focus:outline-none placeholder:text-destructive focus-visible:ring-destructive/40 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
    outline:
      "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  },
  size: {
    default: "h-9 px-4 py-2 has-[>svg]:px-3",
    sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
    md: "h-9 rounded-md px-4 has-[>svg]:px-3",
    lg: "h-12 rounded-md px-4 has-[>svg]:px-4",
  },
};

function Input({
  className,
  type,
  variant = "default",
  labelPlacement = "outside",
  label = "",
  errorMessage = "",
  onPostFixIconClick,
  postFixIcon = null,
  onPreFixIconClick,
  preFixIcon = null,
  size = "default",
  required = false,
  ...props
}: InputProps) {
  return (
    <div className="relative">
      {labelPlacement === "outside" && label != "" && (
        <div className="mb-2">
          <Label
            htmlFor={props.id}
            className={`${errorMessage && "text-destructive"}`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        </div>
      )}
      <input
        type={type}
        data-slot="input"
        required={required}
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          `${
            labelPlacement === "inside" &&
            label != "" &&
            "pt-[1.7rem] pb-[1rem] h-14"
          }`,
          `${
            errorMessage != ""
              ? inputVariants.variant["destructive"]
              : inputVariants.variant[variant]
          }`,
          `${preFixIcon && "!pl-9 !relative"} ${
            postFixIcon && "!pr-9 !relative"
          }`,
          `${
            labelPlacement === "inside"
              ? size === "lg"
                ? "!h-[60px]"
                : size === "md"
                ? "!h-[50px]"
                : size === "sm"
                ? "!h-10"
                : ""
              : ""
          }`,
          inputVariants.size[size],
          className
        )}
        {...props}
      />
      {preFixIcon && (
        <button
          type="button"
          onClick={onPreFixIconClick}
          className={`${
            labelPlacement == "inside"
              ? errorMessage
                ? "top-[20%]"
                : "top-[28%]"
              : "top-1/2"
          } ${
            onPreFixIconClick ? "cursor-pointer" : ""
          } absolute left-2 text-2xl text-gray-400 focus:outline-none`}
        >
          {preFixIcon}
        </button>
      )}
      {postFixIcon && (
        <button
          type="button"
          onClick={onPostFixIconClick}
          className={`${
            labelPlacement == "inside"
              ? errorMessage
                ? "top-[20%]"
                : "top-[28%]"
              : errorMessage
              ? "top-[37%]"
              : "top-1/2"
          } ${
            onPostFixIconClick ? "cursor-pointer" : ""
          } absolute right-2 text-2xl text-gray-400 focus:outline-none`}
        >
          {postFixIcon}
        </button>
      )}
      {errorMessage && (
        <p className="text-destructive text-xs mt-[0.1rem]">{errorMessage}</p>
      )}
      {labelPlacement === "inside" && label != "" && (
        <div className="absolute left-3 top-1 pointer-events-none">
          <Label
            htmlFor={props.id}
            className={`${errorMessage && "text-destructive"} text-[12px]`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        </div>
      )}
    </div>
  );
}

export { Input };
