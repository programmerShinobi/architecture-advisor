import { useCallback, useEffect } from 'react';
import { usePersistedState } from './usePersistedState';

type Theme = 'light' | 'dark';

// Dark by default (matches the design reference); light is opt-in via the `html.light` class.
// The initial class is set pre-paint in index.html; this hook keeps it in sync.
export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = usePersistedState<Theme>(
    'aa.theme',
    typeof document !== 'undefined' && document.documentElement.classList.contains('light')
      ? 'light'
      : 'dark',
  );

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  const toggle = useCallback(() => setTheme(theme === 'light' ? 'dark' : 'light'), [theme, setTheme]);
  return [theme, toggle];
}
