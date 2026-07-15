import { IconSparkles, IconCommand } from '@tabler/icons-react';
import { useI18n } from '../../i18n/I18nContext';

// The "New here?" orientation banner — guided mode only (hidden in expert via .guided-only).
// Modern treatment (Fase 1 polish): a floating glass card with badge pills + a ⌘K key cap,
// replacing the old full-width info strip.
export function GuidedBanner() {
  const { t } = useI18n();
  return (
    <div
      className="guided-only aa-glass"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px 14px',
        alignItems: 'center',
        padding: '12px 16px',
        margin: 'var(--aa-space-3) var(--aa-panel-pad) 0',
        borderRadius: 'var(--border-radius-xl)',
      }}
    >
      <span className="aa-badge aa-badge-accent">
        <IconSparkles size={13} aria-hidden />
        {t('banner.new')}
      </span>
      <span style={{ fontSize: '12.5px', color: 'var(--color-text-secondary)', lineHeight: 1.55, flex: '1 1 260px' }}>
        {t('banner.body')}
      </span>
      <span className="aa-hide-phone" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
        <span style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>{t('banner.power')}</span>
        <span className="aa-kbd">
          <IconCommand size={11} aria-hidden />K
        </span>
        {t('banner.power.body')}
      </span>
    </div>
  );
}
