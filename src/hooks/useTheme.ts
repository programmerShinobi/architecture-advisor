import { useCallback, useEffect } from 'react';
import { usePersistedState } from './usePersistedState';

type Theme = 'light' | 'dark';

// Dark mode via the `class` strategy (Tailwind). The initial class is set pre-paint in index.html;
// this hook keeps the <html> class in sync with the persisted choice.
export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = usePersistedState<Theme>(
    'aa.theme',
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light',
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggle = useCallback(() => setTheme(theme === 'dark' ? 'light' : 'dark'), [theme, setTheme]);
  return [theme, toggle];
}
