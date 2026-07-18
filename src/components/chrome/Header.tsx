import { useEffect, useRef, useState } from 'react';
import { IconBook2, IconCircleCheck, IconCommand, IconMoon, IconSearch, IconSun } from '@tabler/icons-react';
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
        {/* Command palette — a compact modern "search" pill (icon + key cap). */}
        <button type="button" className="f-btn aa-hide-phone aa-ctl" onClick={onCmdK} aria-label={t('cmd.open')} title={t('cmd.open')}>
          <IconSearch size={13} aria-hidden />
          <span className="aa-kbd" style={{ padding: '1px 5px', fontSize: '10px' }}>
            <IconCommand size={10} aria-hidden />K
          </span>
        </button>
        <button type="button" className="f-btn aa-hide-phone aa-ctl" onClick={onHelp} title={t('shortcuts.title')} aria-label={t('shortcuts.title')}>
          ?
        </button>

        {/* Theme / language / mode live in the mobile settings sheet on phones (MobileChrome).
            One consistent segmented-glass language (Fase 2f). */}
        <div className="aa-desktop-controls">
        <div className="aa-seg">
          <button type="button" className={'f-mode' + (mode === 'guided' ? ' on' : '')} onClick={() => onToggleMode('guided')}>
            {t('mode.guided')}
          </button>
          <button type="button" className={'f-mode' + (mode === 'expert' ? ' on' : '')} onClick={() => onToggleMode('expert')}>
            {t('mode.expert')}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <div className="aa-seg">
            <button type="button" className={'f-mode' + (lang === 'en' ? ' on' : '')} onClick={() => setLang('en')}>
              EN
            </button>
            <button type="button" className={'f-mode' + (lang === 'id' ? ' on' : '')} onClick={() => setLang('id')}>
              ID
            </button>
          </div>
          <button type="button" className="aa-ctl-icon" onClick={toggleTheme} aria-label={t('action.theme')} title={t('action.theme')}>
            {theme === 'light' ? (
              <IconSun size={16} style={{ color: 'var(--color-text-secondary)' }} aria-hidden />
            ) : (
              <IconMoon size={16} style={{ color: 'var(--color-text-secondary)' }} aria-hidden />
            )}
          </button>
        </div>
        </div>

    </div>
  );
}
