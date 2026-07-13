import { useEffect, useRef, useState } from 'react';
import { IconHome, IconCompass, IconBooks, IconAdjustmentsHorizontal, IconX } from '@tabler/icons-react';
import { useI18n } from '../i18n/I18nContext';
import type { Mode } from './Header';

type MainView = 'home' | 'advisor' | 'learn';

interface Props {
  mainView: MainView;
  onNavigate: (v: MainView) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  mode: Mode;
  onSetMode: (m: Mode) => void;
}

/**
 * Phone-only app chrome (mobile-experience-plan.md): a fixed bottom **tab bar** (Home · Advisor ·
 * Insights · More) — the thumb-zone navigation convention — plus a **settings sheet** (opened from
 * "More") holding the three product toggles (theme, language, Guided/Expert) as large controls.
 * Hidden ≥641px via CSS (`.aa-tabbar`); it drives the same `mainView` / `theme` / `lang` / `mode`
 * state as the desktop header, so nothing desyncs.
 */
export function MobileChrome({ mainView, onNavigate, theme, onToggleTheme, mode, onSetMode }: Readonly<Props>) {
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    panelRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const tabs: { id: MainView; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: t('nav.home'), icon: <IconHome size={22} aria-hidden /> },
    { id: 'advisor', label: t('nav.advisor'), icon: <IconCompass size={22} aria-hidden /> },
    { id: 'learn', label: t('nav.learn'), icon: <IconBooks size={22} aria-hidden /> },
  ];

  const seg = (active: boolean, onClick: () => void, label: string) => (
    <button type="button" className={'aa-seg2-btn' + (active ? ' on' : '')} aria-pressed={active} onClick={onClick}>
      {label}
    </button>
  );

  return (
    <>
      <nav className="aa-tabbar screen-only" aria-label={t('m.primaryNav')}>
        {tabs.map((tb) => (
          <button
            key={tb.id}
            type="button"
            className={'aa-tab' + (mainView === tb.id ? ' on' : '')}
            aria-current={mainView === tb.id ? 'page' : undefined}
            onClick={() => onNavigate(tb.id)}
          >
            {tb.icon}
            <span>{tb.label}</span>
          </button>
        ))}
        <button type="button" className="aa-tab" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>
          <IconAdjustmentsHorizontal size={22} aria-hidden />
          <span>{t('nav.more')}</span>
        </button>
      </nav>

      {open && (
        <div className="aa-sheet-backdrop screen-only" onClick={() => setOpen(false)}>
          <div
            className="aa-sheet"
            role="dialog"
            aria-modal="true"
            aria-label={t('m.settings')}
            ref={panelRef}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aa-sheet-grip" aria-hidden />
            <div className="aa-sheet-head">
              <span>{t('m.settings')}</span>
              <button type="button" className="icon-btn" aria-label={t('m.close')} onClick={() => setOpen(false)}>
                <IconX size={18} aria-hidden />
              </button>
            </div>

            <div className="aa-set-row">
              <span>{t('m.theme')}</span>
              <div className="aa-seg2">
                {seg(theme === 'dark', () => theme !== 'dark' && onToggleTheme(), t('m.theme.dark'))}
                {seg(theme === 'light', () => theme !== 'light' && onToggleTheme(), t('m.theme.light'))}
              </div>
            </div>

            <div className="aa-set-row">
              <span>{t('m.language')}</span>
              <div className="aa-seg2">
                {seg(lang === 'en', () => setLang('en'), 'EN')}
                {seg(lang === 'id', () => setLang('id'), 'ID')}
              </div>
            </div>

            <div className="aa-set-row">
              <span>{t('m.mode')}</span>
              <div className="aa-seg2">
                {seg(mode === 'guided', () => onSetMode('guided'), t('m.guided'))}
                {seg(mode === 'expert', () => onSetMode('expert'), t('m.expert'))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
