"use client";

import React, { useState, KeyboardEvent } from "react";
import { Input } from "@/lib/ui/input";
import { Badge } from "@/lib/ui/badge";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type MultiEmailInputProps = {
  value: string[];
  onChange: (emails: string[]) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
};

export const MultiEmailInput = ({
  value = [],
  onChange,
  onBlur,
  placeholder = "Enter email and press Enter",
  className,
}: MultiEmailInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const addEmail = (email: string) => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    if (value.includes(trimmedEmail)) {
      setError("This email has already been added");
      return;
    }

    onChange([...value, trimmedEmail]);
    setInputValue("");
    setError(null);
  };

  const removeEmail = (emailToRemove: string) => {
    onChange(value.filter((email) => email !== emailToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addEmail(inputValue);
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      // Remove last email when backspace is pressed on empty input
      removeEmail(value[value.length - 1]);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");

    // Split by common delimiters: comma, semicolon, space, or newline
    const emails = pastedText
      .split(/[,;\s\n]+/)
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    const validEmails: string[] = [];
    const invalidEmails: string[] = [];

    emails.forEach((email) => {
      if (validateEmail(email) && !value.includes(email)) {
        validEmails.push(email);
      } else if (!validateEmail(email)) {
        invalidEmails.push(email);
      }
    });

    if (validEmails.length > 0) {
      onChange([...value, ...validEmails]);
      setError(null);
    }

    if (invalidEmails.length > 0) {
      setError(`Invalid email(s): ${invalidEmails.join(", ")}`);
    }
  };

  const handleBlur = () => {
    // Add email on blur if there's text in input
    if (inputValue.trim()) {
      addEmail(inputValue);
    }
    onBlur?.();
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-background min-h-[42px] focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        {value.map((email) => (
          <Badge
            key={email}
            variant="secondary"
            className="gap-1 pr-1 text-sm font-normal"
          >
            <span>{email}</span>
            <button
              type="button"
              onClick={() => removeEmail(email)}
              className="rounded-full hover:bg-muted-foreground/20 p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <Input
          type="email"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onBlur={handleBlur}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[200px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none px-1"
        />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <p className="text-xs text-muted-foreground">
        Press Enter to add an email, or paste multiple emails separated by commas
      </p>
    </div>
  );
};
