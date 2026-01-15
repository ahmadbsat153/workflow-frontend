import { useCallback, useEffect, useRef } from "react";

export default function useDebounce(
  effect: () => void,
  dependencies: React.DependencyList,
  delay: number
) {
  const callback = useCallback(effect, dependencies);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // If it's the first time, just flip the switch and skip
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timeout = setTimeout(() => {
      callback();
    }, delay);

    return () => clearTimeout(timeout);
  }, [callback, delay]);
}
