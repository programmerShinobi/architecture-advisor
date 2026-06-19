import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { I18nProvider } from '../i18n/I18nContext';

// Render a component (or the whole App) inside the i18n provider, with the language pinned.
// The language is written to localStorage *before* render so the provider reads it on init
// (it persists via usePersistedState under 'aa.lang'). Tests should localStorage.clear() first.
export function renderWithI18n(ui: ReactElement, lang: 'en' | 'id' = 'en') {
  localStorage.setItem('aa.lang', JSON.stringify(lang));
  return render(<I18nProvider>{ui}</I18nProvider>);
}
