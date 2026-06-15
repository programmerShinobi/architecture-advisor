import { IconGitBranch } from '@tabler/icons-react';
import { useI18n } from '../i18n/I18nContext';
import { MIGRATION_PATHS, type MigrationKey } from '../config/migrationPaths';

interface Props {
  value: MigrationKey;
  onChange: (key: MigrationKey) => void;
}

const KEYS: { k: MigrationKey; label: 'mig.fresh' | 'mig.big' | 'mig.mix' }[] = [
  { k: 'fresh', label: 'mig.fresh' },
  { k: 'big', label: 'mig.big' },
  { k: 'mix', label: 'mig.mix' },
];

// "Already have a system?" — an incremental, Strangler-Fig migration path.
export function MigrationCard({ value, onChange }: Props) {
  const { t, tr } = useI18n();
  const steps = MIGRATION_PATHS[value];

  return (
    <div style={{ border: '0.5px solid var(--color-border-tertiary)', borderRadius: 'var(--border-radius-lg)', padding: '14px 15px' }}>
      <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>
        <IconGitBranch size={16} style={{ verticalAlign: '-3px', marginRight: '6px', color: 'var(--color-text-info)' }} aria-hidden />
        {t('mig.title')}
      </div>
      <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', marginBottom: '11px' }}>{t('mig.intro')}</div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
        {KEYS.map(({ k, label }) => (
          <button key={k} type="button" className={'f-mig' + (k === value ? ' on' : '')} aria-pressed={k === value} onClick={() => onChange(k)}>
            {t(label)}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: '9px', alignItems: 'flex-start' }}>
            <span
              className="num"
              style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--color-background-info)', color: 'var(--color-text-info)', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', marginTop: '1px' }}
            >
              {i + 1}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{tr(s)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
