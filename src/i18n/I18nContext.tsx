import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import type { Bilingual, Lang } from '../types';
import { DICT, type DictKey } from './dict';
import { usePersistedState } from '../hooks/usePersistedState';

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  /** Translate a known UI key. */
  t: (key: DictKey) => string;
  /** Pick the current-language side of any bilingual value (model content). */
  tr: (value: Bilingual) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = usePersistedState<Lang>('aa.lang', 'id');

  const tr = useCallback((value: Bilingual) => value[lang], [lang]);
  const t = useCallback((key: DictKey) => DICT[key][lang], [lang]);
  const toggleLang = useCallback(() => setLang(lang === 'id' ? 'en' : 'id'), [lang, setLang]);

  const value = useMemo<I18nValue>(
    () => ({ lang, setLang, toggleLang, t, tr }),
    [lang, setLang, toggleLang, t, tr],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within an I18nProvider');
  return ctx;
}
