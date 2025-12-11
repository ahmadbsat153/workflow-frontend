"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import { Button } from "@/lib/ui/button";
import { VALIDATION_FIELD_CONFIGS } from "@/utils/Form/ValidationFeildsConfig";
import { Badge } from "@/lib/ui/badge";

type FileTypeOption = {
  label: string;
  value: string;
};

type Props = {
  selected: string[];
  onChange: (values: string[]) => void;
  disabled?: boolean;
};

export const FileTypeMultiSelect = ({
  selected,
  onChange,
  disabled = false,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const fileTypeConfig = VALIDATION_FIELD_CONFIGS.allowedFileTypes;
  const options: FileTypeOption[] = Array.isArray(fileTypeConfig.options)
    ? (fileTypeConfig.options as FileTypeOption[])
    : [];

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    option.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleRemoveTag = (value: string) => {
    onChange(selected.filter((v) => v !== value));
  };

  const getSelectedLabels = () => {
    return selected
      .map((value) => options.find((opt) => opt.value === value)?.label)
      .filter(Boolean);
  };

  // Ensure selected is an array (handle case where it might be undefined or not an array)
  const safeSelected = Array.isArray(selected) ? selected : [];

  return (
    <div className="relative" ref={containerRef}>
      <div
        className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md bg-white min-h-10 cursor-pointer"
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {safeSelected.length > 0 ? (
          <>
            {getSelectedLabels().map((label) => (
              <Badge
                key={label}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {label}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveTag(
                      options.find((opt) => opt.label === label)?.value || ""
                    );
                  }}
                  className="ml-1 hover:text-red-600"
                  disabled={disabled}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </>
        ) : (
          <span className="text-gray-500 text-sm">Select file types...</span>
        )}
        <div className="ml-auto flex items-center">
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50">
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search file types..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={safeSelected.includes(option.value)}
                    onChange={() => handleToggle(option.value)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{option.label}</span>
                    <span className="text-xs text-gray-500">
                      {option.value}
                    </span>
                  </div>
                </label>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                No file types found
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 p-2 flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onChange(options.map((opt) => opt.value))}
            >
              Select All
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onChange([])}
            >
              Clear All
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};