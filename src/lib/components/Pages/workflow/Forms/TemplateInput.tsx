"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/lib/ui/input";
import { Textarea } from "@/lib/ui/textarea";
import { FieldTemplate } from "@/lib/types/form/form";
import { ScrollArea } from "@/lib/ui/scroll-area";

interface TemplateInputProps {
  value: string | number | undefined;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: "text" | "email" | "textarea";
  name?: string;
  templates?: FieldTemplate[];
  rows?: number;
}

export const TemplateInput = ({
  value,
  onChange,
  onBlur,
  placeholder,
  type = "text",
  name,
  templates = [],
  rows = 4,
}: TemplateInputProps) => {
  const [showTemplates, setShowTemplates] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const stringValue = String(value ?? "");

  // Detect {{ pattern and show template dropdown
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart || 0;

    onChange(newValue);
    setCursorPosition(cursorPos);

    // Check if user typed {{
    const textBeforeCursor = newValue.substring(0, cursorPos);
    const lastOpenBraces = textBeforeCursor.lastIndexOf("{{");

    if (lastOpenBraces !== -1) {
      const textAfterBraces = textBeforeCursor.substring(lastOpenBraces + 2);

      // Check if there's no closing }} after the last {{
      const hasClosingBraces = textAfterBraces.includes("}}");

      if (!hasClosingBraces && templates.length > 0) {
        setSearchQuery(textAfterBraces.trim());
        setShowTemplates(true);
        setSelectedIndex(0);
      } else {
        setShowTemplates(false);
      }
    } else {
      setShowTemplates(false);
    }
  };

  const handleTemplateSelect = (template: FieldTemplate) => {
    const textBeforeCursor = stringValue.substring(0, cursorPosition);
    const textAfterCursor = stringValue.substring(cursorPosition);

    // Find the last {{ before cursor
    const lastOpenBraces = textBeforeCursor.lastIndexOf("{{");

    if (lastOpenBraces !== -1) {
      // Replace from {{ to cursor position with the template
      const beforeTemplate = stringValue.substring(0, lastOpenBraces);
      const templateString = `{{ ${template.name} }}`;
      const newValue = beforeTemplate + templateString + textAfterCursor;

      onChange(newValue);
      setShowTemplates(false);

      // Set focus back to input and position cursor after the inserted template
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          const newCursorPos = beforeTemplate.length + templateString.length;
          inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
    }
  };

  // Filter templates based on search query
  const filteredTemplates = templates.filter((template) => {
    const query = searchQuery.toLowerCase();
    return (
      template.label.toLowerCase().includes(query) ||
      template.name.toLowerCase().includes(query) ||
      (template.description && template.description.toLowerCase().includes(query))
    );
  });

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!showTemplates || filteredTemplates.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredTemplates.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredTemplates.length) % filteredTemplates.length);
    } else if (e.key === "Enter" && showTemplates) {
      e.preventDefault();
      handleTemplateSelect(filteredTemplates[selectedIndex]);
    } else if (e.key === "Escape") {
      setShowTemplates(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowTemplates(false);
      }
    };

    if (showTemplates) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTemplates]);

  const commonProps = {
    ref: inputRef as any,
    value: stringValue,
    onChange: handleInputChange,
    onKeyDown: handleKeyDown,
    onBlur,
    placeholder,
    name,
  };

  return (
    <div className="relative">
      {type === "textarea" ? (
        <Textarea {...commonProps} rows={rows} />
      ) : (
        <Input {...commonProps} type={type} />
      )}

      {showTemplates && filteredTemplates.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 rounded-md border bg-popover text-popover-foreground shadow-md max-h-[200px] overflow-hidden"
        >
          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground border-b">
            Available Fields
          </div>
          <ScrollArea className="h-[160px]">
            <div className="p-1">
              {filteredTemplates.map((template, index) => (
                <div
                  key={template.name}
                  onClick={() => handleTemplateSelect(template)}
                  className={`px-3 py-2 cursor-pointer rounded-sm transition-colors ${
                    index === selectedIndex
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <div className="font-medium text-sm">{template.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {template.name}
                    {template.description && ` • ${template.description}`}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};
