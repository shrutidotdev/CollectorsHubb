import { useEffect, useRef, useState } from "react";

export function usePersistentState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const hydrated = useRef(false);

  useEffect(() => {
    let timeout: number | undefined;
    try {
      const saved = window.localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved) as T;
        timeout = window.setTimeout(() => setValue(parsed), 0);
      }
    } catch {
      // Invalid or unavailable storage falls back to the safe default.
    } finally {
      hydrated.current = true;
    }
    return () => {
      if (timeout) window.clearTimeout(timeout);
    };
  }, [key]);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // The interface remains fully usable when storage is unavailable.
    }
  }, [key, value]);

  return [value, setValue] as const;
}
