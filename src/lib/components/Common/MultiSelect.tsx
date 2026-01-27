"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import { Button } from "@/lib/ui/button";
import { Badge } from "@/lib/ui/badge";

export type MultiSelectOption = {
  label: string;
  value: string;
  description?: string;
};

type Props = {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  emptyMessage?: string;
};

export const MultiSelect = ({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  searchPlaceholder = "Search...",
  disabled = false,
  emptyMessage = "No items found",
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openUpward, setOpenUpward] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(
    (option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.description?.toLowerCase().includes(searchQuery.toLowerCase())
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

  // Check if dropdown should open upward based on available space
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const dropdownHeight = 280; // Approximate height of dropdown (max-h-48 + search + buttons)
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      // Open upward if not enough space below but enough space above
      setOpenUpward(spaceBelow < dropdownHeight && spaceAbove > dropdownHeight);
    }
  }, [isOpen]);

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
      .map((value) => {
        const option = options.find((opt) => opt.value === value);
        return option ? { label: option.label, value: option.value } : null;
      })
      .filter(Boolean) as { label: string; value: string }[];
  };

  const safeSelected = Array.isArray(selected) ? selected : [];

  return (
    <div className="relative" ref={containerRef}>
      <div
        className={`flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md bg-white min-h-10 ${
          disabled ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {safeSelected.length > 0 ? (
          <>
            {getSelectedLabels().map((item) => (
              <Badge
                key={item.value}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {item.label}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveTag(item.value);
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
          <span className="text-gray-500 text-sm">{placeholder}</span>
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
        <div
          className={`absolute left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-50 ${
            openUpward ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              placeholder={searchPlaceholder}
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
                    {option.description && (
                      <span className="text-xs text-gray-500">
                        {option.description}
                      </span>
                    )}
                  </div>
                </label>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                {emptyMessage}
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
