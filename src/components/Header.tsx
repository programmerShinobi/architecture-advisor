import { useI18n } from '../i18n/I18nContext';
import { useTheme } from '../hooks/useTheme';

export type Mode = 'guided' | 'expert';

interface Props {
  mode: Mode;
  onToggleMode: () => void;
}

export function Header({ mode, onToggleMode }: Props) {
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
          <div role="group" aria-label="Mode" className="flex rounded-md border border-line p-0.5 text-sm">
            <button
              type="button"
              onClick={() => mode !== 'guided' && onToggleMode()}
              aria-pressed={mode === 'guided'}
              className={
                'rounded px-2.5 py-1 font-medium ' +
                (mode === 'guided' ? 'bg-brand text-white' : 'text-ink-soft hover:bg-surface-2')
              }
            >
              {t('mode.guided')}
            </button>
            <button
              type="button"
              onClick={() => mode !== 'expert' && onToggleMode()}
              aria-pressed={mode === 'expert'}
              className={
                'rounded px-2.5 py-1 font-medium ' +
                (mode === 'expert' ? 'bg-brand text-white' : 'text-ink-soft hover:bg-surface-2')
              }
            >
              {t('mode.expert')}
            </button>
          </div>
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
