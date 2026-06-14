import { useI18n } from '../i18n/I18nContext';
import type { Factor } from '../types';

interface Props {
  factor: Factor;
  level: number;
  onChange: (level: number) => void;
}

// A single factor input: a 3-way segmented control (levels 0/1/2) with help text.
export function FactorControl({ factor, level, onChange }: Props) {
  const { tr } = useI18n();
  const groupName = `factor-${factor.id}`;

  return (
    <div className="py-3">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium">{tr(factor.label)}</span>
        {factor.inverted && (
          <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-ink-soft">
            inverted
          </span>
        )}
      </div>
      <p className="mt-0.5 text-xs leading-snug text-ink-soft">{tr(factor.help)}</p>
      <div
        role="radiogroup"
        aria-label={tr(factor.label)}
        className="mt-2 grid grid-cols-3 gap-1 rounded-lg border border-line p-1"
      >
        {factor.levels.map((lvl, i) => {
          const selected = i === level;
          return (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={selected}
              name={groupName}
              onClick={() => onChange(i)}
              className={
                'rounded-md px-2 py-1.5 text-xs font-medium transition-colors ' +
                (selected
                  ? 'bg-brand text-white'
                  : 'text-ink-soft hover:bg-surface-2 hover:text-ink')
              }
            >
              {tr(lvl)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
