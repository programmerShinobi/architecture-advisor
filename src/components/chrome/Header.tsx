import { useEffect, useRef, useState } from 'react';
import { IconBook2, IconCircleCheck, IconCommand, IconMoon, IconSun } from '@tabler/icons-react';
import { BrandMark } from './BrandMark';
import { useI18n } from '../../i18n/I18nContext';

export type Mode = 'guided' | 'expert';

interface Props {
  mode: Mode;
  onToggleMode: (mode: Mode) => void;
  onCmdK: () => void;
  onHelp: () => void;
  onManual: () => void;
  /** Theme is lifted to App and shared (Header + mobile chrome) so they never desync. */
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  /** Changes whenever persisted state changes, to flash the save indicator. */
  saveSig: string;
}

export function Header({ mode, onToggleMode, onCmdK, onHelp, onManual, theme, onToggleTheme, saveSig }: Props) {
  const { t, lang, setLang } = useI18n();
  const toggleTheme = onToggleTheme;
  const [saving, setSaving] = useState(false);
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    setSaving(true);
    const id = setTimeout(() => setSaving(false), 700);
    return () => clearTimeout(id);
  }, [saveSig]);

  return (
    // The RIGHT side of the app bar (Fase 2): one horizontal row of compact controls with the
    // brand mark docked at the far right. The app title lives on the Home hero + document title.
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'nowrap', marginLeft: 'auto', minWidth: 0 }}>
        {/* Save status: compact icon-only badge — the full text lives in title/aria-label. */}
        <output
          className="aa-hide-phone aa-badge aa-badge-soft"
          aria-label={saving ? t('save.saving') : t('save.saved')}
          title={saving ? t('save.saving') : t('save.saved')}
          style={{ padding: '6px', borderRadius: '50%' }}
        >
          {saving ? <span className="spin" /> : <IconCircleCheck size={15} style={{ color: 'var(--color-text-success)' }} aria-hidden />}
        </output>

        <button type="button" className="f-btn" onClick={onManual}>
          <IconBook2 size={13} aria-hidden />
          {t('manual.open')}
        </button>
        <button type="button" className="f-btn aa-hide-phone" onClick={onCmdK} aria-label={t('cmd.open')}>
          <IconCommand size={13} aria-hidden />
          <span className="kbd">⌘K</span>
        </button>
        <button type="button" className="f-btn aa-hide-phone" onClick={onHelp} title={t('shortcuts.title')}>
          ?
        </button>

        {/* Theme / language / mode live in the mobile settings sheet on phones (MobileChrome). */}
        <div className="aa-desktop-controls">
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', background: 'var(--color-background-secondary)', borderRadius: '99px', padding: '2px' }}>
          <button type="button" className={'f-mode' + (mode === 'guided' ? ' on' : '')} onClick={() => onToggleMode('guided')}>
            {t('mode.guided')}
          </button>
          <button type="button" className={'f-mode' + (mode === 'expert' ? ' on' : '')} onClick={() => onToggleMode('expert')}>
            {t('mode.expert')}
          </button>
        </div>

        {/* Language: the same segmented pill as the mode toggle (one visual system). */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', background: 'var(--color-background-secondary)', borderRadius: '99px', padding: '2px' }}>
            <button type="button" className={'f-mode' + (lang === 'en' ? ' on' : '')} onClick={() => setLang('en')}>
              EN
            </button>
            <button type="button" className={'f-mode' + (lang === 'id' ? ' on' : '')} onClick={() => setLang('id')}>
              ID
            </button>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={t('action.theme')}
            style={{
              width: '28px',
              height: '28px',
              border: '0.5px solid var(--color-border-secondary)',
              borderRadius: 'var(--border-radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              background: 'transparent',
            }}
          >
            {theme === 'light' ? (
              <IconSun size={16} style={{ color: 'var(--color-text-secondary)' }} aria-hidden />
            ) : (
              <IconMoon size={16} style={{ color: 'var(--color-text-secondary)' }} aria-hidden />
            )}
          </button>
        </div>
        </div>

      {/* Brand — far right on DESKTOP: monochrome compass (transparent, theme-aware) + wordmark.
          Hidden on phones (the app bar shows the phone brand on the LEFT instead). Layout via
          .aa-wrap (class, NOT an inline display) so .aa-hide-phone can win on the phone tier. */}
      <span className="aa-wrap aa-hide-phone" style={{ flex: 'none', color: 'var(--color-text-primary)' }}>
        <BrandMark size={30} />
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
          {t('app.title')}
        </span>
      </span>
    </div>
  );
}
