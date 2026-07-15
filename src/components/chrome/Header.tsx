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
    <div
      className="aa-glass"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--aa-space-4) var(--aa-panel-pad)',
        borderRadius: 'var(--border-radius-xl)',
        flexWrap: 'wrap',
        gap: '10px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: '0 1 auto' }}>
        {/* BrandMark is self-contained (own dark tile + neon glyph) — no chip behind it. */}
        <div style={{ borderRadius: '9px', boxShadow: '0 0 16px -4px rgba(56, 225, 255, 0.5)', flex: 'none' }}>
          <BrandMark size={36} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.25, whiteSpace: 'nowrap' }}>{t('app.title')}</div>
          {/* The tagline shrinks with ellipsis instead of pushing the controls to wrap. */}
          <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t('app.tagline')}</div>
        </div>
      </div>

      {/* Controls cluster: ONE horizontal row, right-aligned — never stacks. Compact pieces
          (icon-only save status, segmented toggles) keep it narrow enough for laptops; on
          mid widths the whole row drops under the title as a single tidy line. */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'nowrap', flex: '0 0 auto', marginLeft: 'auto' }}>
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
      </div>
    </div>
  );
}
