import { IconInfoCircle } from '@tabler/icons-react';
import { useI18n } from '../../i18n/I18nContext';

// The "New here?" orientation banner — guided mode only (hidden in expert via .guided-only).
export function GuidedBanner() {
  const { t } = useI18n();
  return (
    <div
      className="guided-only"
      style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
        padding: '13px 20px',
        background: 'var(--color-background-info)',
        borderBottom: '0.5px solid var(--color-border-tertiary)',
      }}
    >
      <IconInfoCircle size={19} style={{ color: 'var(--color-text-info)', marginTop: '1px', flex: 'none' }} aria-hidden />
      <div style={{ fontSize: '12px', color: 'var(--color-text-info)', lineHeight: 1.6 }}>
        <span style={{ fontWeight: 500 }}>{t('banner.new')}</span> {t('banner.body')}
      </div>
    </div>
  );
}
