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
import { Tabs, TabsList, TabsTrigger } from "@/lib/ui/tabs";
import { ChevronDownIcon, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
  displayMode?: "dropdown" | "tabs";
}

export function LayoutSelector<T extends string = string>({
  options,
  defaultValue,
  onLayoutChange,
  triggerSize = "sm",
  triggerVariant = "outline",
  showLabelOnMobile = false,
  displayMode = "dropdown",
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

  // Tabs mode
  if (displayMode === "tabs") {
    return (
      <Tabs value={currentLayout} onValueChange={(value) => handleLayoutChange(value as T)}>
        <TabsList>
          {options.map((option) => {
            const Icon = option.icon;
            return (
              <TabsTrigger key={option.value} value={option.value}>
                <Icon className="h-4 w-4" />
                <span className={cn(
                  "ml-2",
                  showLabelOnMobile ? "inline" : "hidden lg:inline"
                )}>
                  {option.label}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    );
  }

  // Dropdown mode (default)
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