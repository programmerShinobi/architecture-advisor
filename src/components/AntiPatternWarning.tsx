import { IconAlertTriangle, IconCircleCheck } from '@tabler/icons-react';
import { useI18n } from '../i18n/I18nContext';
import type { AntiPatternRule } from '../config/antiPatterns';

interface Props {
  rules: AntiPatternRule[];
  mode: 'guided' | 'expert';
}

// Rule-based combination warnings, in the prototype's warning-box style (or an all-clear note).
export function AntiPatternWarning({ rules, mode }: Props) {
  const { t, tr } = useI18n();

  if (rules.length === 0) {
    return (
      <div style={{ display: 'flex', gap: '11px', alignItems: 'center', marginTop: '14px', fontSize: '12px', color: 'var(--color-text-success)' }}>
        <IconCircleCheck size={16} aria-hidden />
        {t('ap.clear')}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px' }}>
      {rules.map((r) => (
        <div
          key={r.id}
          role="alert"
          style={{ display: 'flex', gap: '11px', alignItems: 'flex-start', border: '0.5px solid var(--color-border-warning)', background: 'var(--color-background-warning)', borderRadius: 'var(--border-radius-md)', padding: '12px 15px' }}
        >
          <IconAlertTriangle size={19} style={{ color: 'var(--color-text-warning)', marginTop: '1px', flex: 'none' }} aria-hidden />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-warning)', marginBottom: '3px' }}>
              {mode === 'expert' ? t('ap.titleExpert').replace('{id}', r.id) : t('ap.title.g')}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-warning)', lineHeight: 1.55 }}>{tr(r.message)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
