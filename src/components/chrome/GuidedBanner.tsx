import { IconSparkles, IconCommand } from '@tabler/icons-react';
import { useI18n } from '../../i18n/I18nContext';

// The "New here?" orientation hint — guided mode only (hidden in expert via .guided-only).
// Fase 2 (owner feedback): a SLIM, calm inline strip — no card, no glass, muted colors; the
// power-user hint sits quietly on the right with a small ⌘K key cap.
export function GuidedBanner() {
  const { t } = useI18n();
  return (
    <div
      className="guided-only"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px 14px',
        alignItems: 'baseline',
        padding: 'var(--aa-space-2) var(--aa-panel-pad)',
        fontSize: '12.5px',
        lineHeight: 1.55,
        color: 'var(--color-text-tertiary)',
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: 600, color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
        <IconSparkles size={13} aria-hidden style={{ opacity: 0.7 }} />
        {t('banner.new')}
      </span>
      <span style={{ flex: '1 1 300px', minWidth: 0 }}>{t('banner.body')}</span>
      {/* Layout via .aa-wrap (class, NOT inline display) so .aa-hide-phone can win on phones. */}
      <span className="aa-hide-phone aa-wrap" style={{ whiteSpace: 'nowrap' }}>
        <span style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>{t('banner.power')}</span>
        <span className="aa-kbd">
          <IconCommand size={11} aria-hidden />K
        </span>
        {t('banner.power.body')}
      </span>
    </div>
  );
}
