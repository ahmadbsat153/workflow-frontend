"use client";

import { useState, ReactNode } from "react";

interface ConditionalRendererProps<T extends string = string> {
  defaultValue: T;
  children: (currentValue: T, setValue: (value: T) => void) => ReactNode;
}

export function ConditionalRenderer<T extends string = string>({
  defaultValue,
  children,
}: ConditionalRendererProps<T>) {
  const [currentValue, setCurrentValue] = useState<T>(defaultValue);

  // Render the children function and return the result
  return <>{children(currentValue, setCurrentValue)}</>;
}

// Alternative approach: Create a custom hook instead
export function useLayoutState<T extends string = string>(defaultValue: T) {
  const [currentValue, setCurrentValue] = useState<T>(defaultValue);
  return [currentValue, setCurrentValue] as const;
}