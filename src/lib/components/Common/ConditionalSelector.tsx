"use client";

import { useState, ReactNode } from "react";

type ConditionalRendererProps<T extends string = string> = {
  defaultValue: T;
  children: (currentValue: T, setValue: (value: T) => void) => ReactNode;
};

export function ConditionalRenderer<T extends string = string>({
  defaultValue,
  children,
}: ConditionalRendererProps<T>) {
  const [currentValue, setCurrentValue] = useState<T>(defaultValue);

  return <>{children(currentValue, setCurrentValue)}</>;
}

export function useLayoutState<T extends string = string>(defaultValue: T) {
  const [currentValue, setCurrentValue] = useState<T>(defaultValue);
  return [currentValue, setCurrentValue] as const;
}
