import { useI18n } from '../../i18n/I18nContext';
import type { Factor } from '../../types';

interface Props {
  factor: Factor;
  level: number;
  onChange: (level: number) => void;
}

// One factor: friendly question (guided) / technical label (expert), a gloss (guided only),
// and a 3-way segmented control — matching the prototype's factor row.
export function FactorField({ factor, level, onChange }: Props) {
  const { tr } = useI18n();
  return (
    <div style={{ marginBottom: '15px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '3px' }}>
        <span>
          <span className="guided-only">{tr(factor.question)}</span>
          <span className="expert-only">{tr(factor.label)}</span>
        </span>
      </div>
      <div className="f-gloss" style={{ marginBottom: '7px' }}>
        {tr(factor.gloss)}
      </div>
      <div
        className="f-seg"
        role="radiogroup"
        aria-label={tr(factor.label)}
        style={{ display: 'flex', border: '0.5px solid var(--color-border-secondary)', borderRadius: 'var(--border-radius-md)', overflow: 'hidden' }}
      >
        {factor.levels.map((lvl, i) => (
          <span
            key={i}
            role="radio"
            aria-checked={i === level}
            tabIndex={0}
            className={i === level ? 'on' : ''}
            onClick={() => onChange(i)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onChange(i);
              }
            }}
          >
            {tr(lvl)}
          </span>
        ))}
      </div>
    </div>
  );
}
