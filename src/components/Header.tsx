import { useI18n } from '../i18n/I18nContext';
import { useTheme } from '../hooks/useTheme';

export function Header() {
  const { t, lang, toggleLang } = useI18n();
  const [theme, toggleTheme] = useTheme();

  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">{t('app.title')}</h1>
          <p className="text-sm text-ink-soft">{t('app.tagline')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleLang}
            className="rounded-md border border-line px-3 py-1.5 text-sm font-medium hover:bg-surface-2"
            aria-label={lang === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
          >
            {lang === 'id' ? 'EN' : 'ID'}
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-md border border-line px-3 py-1.5 text-sm hover:bg-surface-2"
            aria-label={t('action.theme')}
            aria-pressed={theme === 'dark'}
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>
        </div>
      </div>
    </header>
  );
}
