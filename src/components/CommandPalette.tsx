import { useEffect, useRef, useState } from 'react';
import { IconSearch } from '@tabler/icons-react';
import { useI18n } from '../i18n/I18nContext';

export interface Command {
  label: string;
  hint?: string;
  run: () => void;
}

interface Props {
  open: boolean;
  commands: Command[];
  onClose: () => void;
}

// ⌘K command palette: fuzzy-filter and run any action. Esc/overlay click closes (handled here +
// globally in App).
export function CommandPalette({ open, commands, onClose }: Props) {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      const id = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(id);
    }
  }, [open]);

  if (!open) return null;
  const filtered = commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));
  const runFirst = () => {
    if (filtered[0]) {
      onClose();
      filtered[0].run();
    }
  };

  return (
    <div className="f-ov open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ width: '100%', maxWidth: '440px', background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-secondary)', borderRadius: 'var(--border-radius-lg)', overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '12px 14px', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
          <IconSearch size={16} style={{ color: 'var(--color-text-tertiary)' }} aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runFirst()}
            placeholder={t('cmd.placeholder')}
            aria-label={t('cmd.open')}
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '14px', color: 'var(--color-text-primary)' }}
          />
          <span className="kbd">Esc</span>
        </div>
        <div style={{ maxHeight: '280px', overflow: 'auto', padding: '6px' }}>
          {filtered.map((c, i) => (
            <button
              key={c.label}
              type="button"
              onClick={() => {
                onClose();
                c.run();
              }}
              style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', padding: '9px 11px', borderRadius: 'var(--border-radius-md)', cursor: 'pointer', fontSize: '13px', color: 'var(--color-text-primary)', border: 'none', textAlign: 'left', background: i === 0 ? 'var(--color-background-info)' : 'transparent' }}
            >
              <span>{c.label}</span>
              {c.hint && <span className="kbd">{c.hint}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
