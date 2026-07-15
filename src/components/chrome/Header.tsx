import { useEffect, useRef, useState } from 'react';
import { IconBook2, IconCircleCheck, IconCommand, IconMoon, IconSitemap, IconSun } from '@tabler/icons-react';
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
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--aa-space-4) var(--aa-panel-pad)',
        borderBottom: '0.5px solid var(--color-border-tertiary)',
        flexWrap: 'wrap',
        gap: '10px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--border-radius-md)',
            background: 'var(--aa-grad-accent)',
            boxShadow: '0 0 16px -4px rgba(56, 225, 255, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconSitemap size={21} style={{ color: 'var(--color-background-primary)' }} aria-hidden />
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.25 }}>{t('app.title')}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>{t('app.tagline')}</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {/* Layout via .aa-wrap (class), NOT an inline display — an inline `display:flex` would
            defeat .aa-hide-phone's display:none on the phone tier (no !important allowed). */}
        <span className="aa-hide-phone aa-wrap" style={{ fontSize: 'var(--aa-fs-2xs)', color: 'var(--color-text-tertiary)' }}>
          {saving ? (
            <>
              <span className="spin" />
              {t('save.saving')}
            </>
          ) : (
            <>
              <IconCircleCheck size={13} style={{ color: 'var(--color-text-success)' }} aria-hidden />
              {t('save.saved')}
            </>
          )}
        </span>

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

        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <button type="button" className={'f-chip' + (lang === 'en' ? ' on' : '')} style={{ padding: '4px 11px' }} onClick={() => setLang('en')}>
            EN
          </button>
          <button type="button" className={'f-chip' + (lang === 'id' ? ' on' : '')} style={{ padding: '4px 11px' }} onClick={() => setLang('id')}>
            ID
          </button>
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
      </div>
    </div>
  );
}
