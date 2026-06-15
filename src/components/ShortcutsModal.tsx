import { useI18n } from '../i18n/I18nContext';
import type { DictKey } from '../i18n/dict';

interface Props {
  open: boolean;
  onClose: () => void;
}

const ROWS: { label: DictKey; key: string }[] = [
  { label: 'sc.palette', key: '⌘K' },
  { label: 'sc.save', key: '⌘S' },
  { label: 'sc.close', key: 'Esc' },
  { label: 'sc.confirm', key: 'Enter' },
];

export function ShortcutsModal({ open, onClose }: Props) {
  const { t } = useI18n();
  if (!open) return null;
  return (
    <div className="f-ov open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ width: '100%', maxWidth: '360px', background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-secondary)', borderRadius: 'var(--border-radius-lg)', overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
          <span style={{ fontSize: '14px', fontWeight: 500 }}>{t('shortcuts.title')}</span>
          <span className="kbd">Esc</span>
        </div>
        <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {ROWS.map((r) => (
            <div key={r.key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
              <span>{t(r.label)}</span>
              <span className="kbd">{r.key}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
