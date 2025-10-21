import * as React from "react";
import { Label } from "./label";
import { cn } from "@/lib/utils";

type CustomTextareaProps = {
  label?: string;
  labelPlacement?: "outside" | "inside";
  onError?: () => void;
  errorMessage?: string;
  variant?: "default" | "destructive" | "outline" | "secondary";
  size?: "default" | "sm" | "md" | "lg";
  onPostFixIconClick?: () => void;
  postFixIcon?: React.ReactNode;
  onPreFixIconClick?: () => void;
  preFixIcon?: React.ReactNode;
  resize?: "none" | "vertical" | "horizontal" | "both";
}

type TextareaProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> & CustomTextareaProps;

const textareaVariants = {
  variant: {
    default: "text-black",
    destructive:
      "border-2 border-red-400 text-destructive hover:border-destructive focus:border-0 focus:outline-none placeholder:text-destructive focus-visible:ring-destructive/40 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
    outline:
      "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  },
  size: {
    default: "min-h-16 px-4 py-2 has-[>svg]:px-3",
    sm: "min-h-12 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
    md: "min-h-16 rounded-md px-4 has-[>svg]:px-3",
    lg: "min-h-20 rounded-md px-4 has-[>svg]:px-4",
    xl: "min-h-24 rounded-md px-4 has-[>svg]:px-4",
  },
  resize: {
    none: "resize-none",
    vertical: "resize-y",
    horizontal: "resize-x",
    both: "resize",
  },
};


//TODO: Add Support For width
function Textarea({
  className,
  variant = "default",
  labelPlacement = "outside",
  label = "",
  errorMessage = "",
  onError,
  onPostFixIconClick,
  postFixIcon = null,
  onPreFixIconClick,
  preFixIcon = null,
  size = "default",
  resize = "vertical",
  ...props
}: TextareaProps) {
  return (
    <div className="relative">
      {labelPlacement === "outside" && label != "" && (
        <div className="mb-2">
          <Label
            htmlFor={props.id}
            className={`${errorMessage && "text-destructive"}`}
          >
            {label}
          </Label>
        </div>
      )}
      <textarea
        data-slot="textarea"
        className={cn(
          "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          `${
            labelPlacement === "inside" &&
            label != "" &&
            "pt-[1.7rem] pb-[1rem]"
          }`,
          `${
            errorMessage != ""
              ? textareaVariants.variant["destructive"]
              : textareaVariants.variant[variant]
          }`,
          `${preFixIcon && "!pl-9 !relative"} ${postFixIcon && "!pr-9 !relative"}`,
          textareaVariants.size[size],
          textareaVariants.resize[resize],
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
              : "top-8"
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
              ? "top-8"
              : "top-8"
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
          </Label>
        </div>
      )}
    </div>
  );
}

export { Textarea };