import { useCallback, useEffect, useRef } from "react";

export default function useDebounce(effect: () => void, dependencies: any[], delay: number) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const callback = useCallback(effect, dependencies);
  const mounted = useRef(false); // Ref to track component mount status

  useEffect(() => {
    if (mounted.current) {
      const timeout = setTimeout(callback, delay);
      return () => clearTimeout(timeout);
    } else {
      mounted.current = true;
      return () => {}; // Update the mount status after initial render
    }
  }, [callback, delay]);
}
