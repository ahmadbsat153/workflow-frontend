"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Search, Check } from "lucide-react";

export type SelectOption = {
  label: string;
  value: string;
  description?: string;
};

export type SelectOptionGroup = {
  label: string;
  options: SelectOption[];
};

type Props = {
  options: SelectOption[] | SelectOptionGroup[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  emptyMessage?: string;
};

// Type guard to check if options are grouped
function isGroupedOptions(
  options: SelectOption[] | SelectOptionGroup[]
): options is SelectOptionGroup[] {
  return options.length > 0 && "options" in options[0];
}

export const SearchableSelect = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  disabled = false,
  emptyMessage = "No items found",
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Flatten options for searching and finding selected
  const flatOptions: SelectOption[] = isGroupedOptions(options)
    ? options.flatMap((group) => group.options)
    : options;

  // Filter options based on search query
  const filterOptions = (opts: SelectOption[]) =>
    opts.filter(
      (option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Get filtered grouped or flat options
  const getFilteredOptions = (): SelectOption[] | SelectOptionGroup[] => {
    if (isGroupedOptions(options)) {
      const filtered = options
        .map((group) => ({
          ...group,
          options: filterOptions(group.options),
        }))
        .filter((group) => group.options.length > 0);
      return filtered;
    }
    return filterOptions(options);
  };

  const filteredOptions = getFilteredOptions();
  const selectedOption = flatOptions.find((opt) => opt.value === value);

  // Check if filtered options have any items
  const hasFilteredItems = isGroupedOptions(filteredOptions)
    ? filteredOptions.some((group) => group.options.length > 0)
    : filteredOptions.length > 0;

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  const handleSelect = useCallback(
    (optionValue: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onChange(optionValue);
      setIsOpen(false);
      setSearchQuery("");
    },
    [onChange]
  );

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const renderOption = (option: SelectOption) => (
    <div
      key={option.value}
      role="option"
      aria-selected={value === option.value}
      className={`px-3 py-2 cursor-pointer hover:bg-accent flex items-center justify-between ${
        value === option.value ? "bg-accent" : ""
      }`}
      onClick={(e) => handleSelect(option.value, e)}
    >
      <div className="flex flex-col">
        <span className="text-sm font-medium">{option.label}</span>
        {option.description && (
          <span className="text-xs text-muted-foreground">
            {option.description}
          </span>
        )}
      </div>
      {value === option.value && (
        <Check className="h-4 w-4 text-primary" />
      )}
    </div>
  );

  const renderOptions = () => {
    if (!hasFilteredItems) {
      return (
        <div className="px-3 py-4 text-sm text-muted-foreground text-center">
          {emptyMessage}
        </div>
      );
    }

    if (isGroupedOptions(filteredOptions)) {
      return filteredOptions.map((group) => (
        <div key={group.label}>
          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground bg-muted sticky top-0 z-10">
            {group.label}
          </div>
          {group.options.map(renderOption)}
        </div>
      ));
    }

    return (filteredOptions as SelectOption[]).map(renderOption);
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger */}
      <div
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`flex items-center justify-between p-2 border border-input rounded-md bg-background min-h-10 ${
          disabled
            ? "bg-muted cursor-not-allowed opacity-50"
            : "cursor-pointer hover:bg-accent/50"
        }`}
        onClick={handleTriggerClick}
      >
        <span
          className={
            selectedOption ? "text-sm truncate" : "text-sm text-muted-foreground"
          }
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full mt-1 bg-popover border border-input rounded-md shadow-lg z-[9999] overflow-hidden"
          style={{ maxHeight: "300px" }}
        >
          {/* Search input */}
          <div className="p-2 border-b sticky top-0 bg-popover z-20">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 border border-input rounded text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Options list */}
          <div className="max-h-52 overflow-y-auto">{renderOptions()}</div>
        </div>
      )}
    </div>
  );
};
