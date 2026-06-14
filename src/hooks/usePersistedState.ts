import { useCallback, useEffect, useState } from 'react';

// State that mirrors itself into localStorage, so factor inputs, language, and theme survive a
// reload (Build Spec Phase 1). Safe against unavailable/throwing storage (private mode, SSR).
export function usePersistedState<T>(key: string, initial: T): [T, (next: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? initial : (JSON.parse(raw) as T);
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore write failures (storage full / disabled) */
    }
  }, [key, value]);

  const set = useCallback((next: T) => setValue(next), []);
  return [value, set];
}
