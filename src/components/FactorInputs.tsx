import { useState } from 'react';
import { IconChevronDown } from '@tabler/icons-react';
import { useI18n } from '../i18n/I18nContext';
import { FACTOR_ORDER, FACTORS } from '../config/factors';
import { FactorField } from './FactorField';
import type { Levels } from '../types';

interface Props {
  levels: Levels;
  onChange: (next: Levels) => void;
}

// The factor inputs: the 3 primary factors are always shown; the rest sit behind a
// "Show the other N factors" toggle — matching the prototype.
export function FactorInputs({ levels, onChange }: Props) {
  const { t } = useI18n();
  const [showAll, setShowAll] = useState(false);

  const primary = FACTOR_ORDER.filter((id) => FACTORS[id].primary);
  const others = FACTOR_ORDER.filter((id) => !FACTORS[id].primary);
  const visible = showAll ? FACTOR_ORDER : primary;

  return (
    <div>
      {visible.map((id) => (
        <FactorField
          key={id}
          factor={FACTORS[id]}
          level={levels[id] ?? 0}
          onChange={(level) => onChange({ ...levels, [id]: level })}
        />
      ))}

      <button
        type="button"
        onClick={() => setShowAll((v) => !v)}
        aria-expanded={showAll}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          width: '100%',
          fontSize: '12px',
          color: 'var(--color-text-info)',
          marginTop: '16px',
          cursor: 'pointer',
          background: 'none',
          border: 'none',
        }}
      >
        <IconChevronDown
          size={14}
          aria-hidden
          style={{ transform: showAll ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}
        />
        {showAll ? t('factors.hideOther') : t('factors.showOther').replace('{n}', String(others.length))}
      </button>
    </div>
  );
}
