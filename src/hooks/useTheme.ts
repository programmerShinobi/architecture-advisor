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
    const isLight = theme === 'light';
    document.documentElement.classList.toggle('light', isLight);
    // Keep the browser / installed-PWA chrome colour in sync with the theme (was dark-only).
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isLight ? '#ffffff' : '#05060f');
  }, [theme]);

  const toggle = useCallback(() => setTheme(theme === 'light' ? 'dark' : 'light'), [theme, setTheme]);
  return [theme, toggle];
}
