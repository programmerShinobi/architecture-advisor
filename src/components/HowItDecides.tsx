import { IconArrowRight, IconChevronDown, IconMathFunction } from '@tabler/icons-react';
import { useI18n } from '../i18n/I18nContext';

const pill = (bg: string, color: string): React.CSSProperties => ({
  background: bg,
  color,
  borderRadius: '99px',
  padding: '4px 10px',
});

// "How does it decide?" — the transparent scoring pipeline + explanation (guided/expert).
export function HowItDecides() {
  const { t } = useI18n();
  const sep = <IconArrowRight size={13} style={{ color: 'var(--color-text-tertiary)' }} aria-hidden />;

  return (
    <details style={{ marginTop: '14px' }}>
      <summary>
        <IconMathFunction size={16} style={{ color: 'var(--color-text-info)' }} aria-hidden />
        <span className="guided-only">{t('how.title.g')}</span>
        <span className="expert-only">{t('how.title.e')}</span>
        <IconChevronDown size={14} style={{ color: 'var(--color-text-tertiary)', marginLeft: 'auto' }} aria-hidden />
      </summary>
      <div style={{ padding: '0 14px 14px', fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.65 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '10px', color: 'var(--color-text-primary)', fontWeight: 500 }}>
          <span style={pill('var(--color-background-secondary)', 'var(--color-text-primary)')}>{t('how.pipe1')}</span>
          {sep}
          <span style={pill('var(--color-background-secondary)', 'var(--color-text-primary)')}>{t('how.pipe2')}</span>
          {sep}
          <span style={pill('var(--color-background-secondary)', 'var(--color-text-primary)')}>{t('how.pipe3')}</span>
          {sep}
          <span style={pill('var(--color-background-info)', 'var(--color-text-info)')}>{t('how.pipe4')}</span>
        </div>
        {t('how.body')}{' '}
        <span className="expert-only">{t('how.body.e')}</span>
        <span className="guided-only">{t('how.body.g')}</span>
      </div>
    </details>
  );
}
