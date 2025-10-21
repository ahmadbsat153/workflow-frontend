"use client";

import { useState } from "react";
import { Button } from "@/lib/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/lib/ui/dropdown-menu";
import { ChevronDownIcon, LucideIcon } from "lucide-react";

export type LayoutOption<T = string> = {
  value: T;
  label: string;
  icon: LucideIcon;
}

type LayoutSelectorProps<T = string> = {
  options: LayoutOption<T>[];
  defaultValue?: T;
  onLayoutChange: (value: T) => void;
  triggerSize?: "sm" | "default" | "lg";
  triggerVariant?: "default" | "outline" | "secondary" | "ghost";
  showLabelOnMobile?: boolean;
}

export function LayoutSelector<T extends string = string>({
  options,
  defaultValue,
  onLayoutChange,
  triggerSize = "sm",
  triggerVariant = "outline",
  showLabelOnMobile = false,
}: LayoutSelectorProps<T>) {
  const [currentLayout, setCurrentLayout] = useState<T>(
    defaultValue || options[0]?.value
  );

  const handleLayoutChange = (value: T) => {
    setCurrentLayout(value);
    onLayoutChange(value);
  };

  const currentOption = options.find((option) => option.value === currentLayout);
  const CurrentIcon = currentOption?.icon;

  if (!CurrentIcon) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={triggerVariant} size={triggerSize}>
          <CurrentIcon className="h-4 w-4" />
          <span className={showLabelOnMobile ? "inline" : "hidden lg:inline"}>
            {currentOption?.label}
          </span>
          <ChevronDownIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          {options.map((option) => {
            const Icon = option.icon;
            return (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleLayoutChange(option.value)}
                className={currentLayout === option.value ? "bg-accent" : ""}
              >
                <Icon className="h-4 w-4 mr-2" />
                {option.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}