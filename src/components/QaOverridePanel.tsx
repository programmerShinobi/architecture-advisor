import { useI18n } from '../i18n/I18nContext';
import { QUALITY_ATTRIBUTES, QA_ORDER } from '../config/qualityAttributes';
import { roundWeights, type Overrides } from '../lib/scoring';
import type { QaId, Weights } from '../types';

interface Props {
  weights: Weights;
  overrides: Overrides;
  onChange: (next: Overrides) => void;
}

// Expert mode: override any QA weight directly (which locks it); unlocked weights share the
// remainder, proportional to the factor-derived values (ATAM-style stakeholder prioritization).
export function QaOverridePanel({ weights, overrides, onChange }: Props) {
  const { t, tr } = useI18n();
  const rounded = roundWeights(weights);

  const setOverride = (q: QaId, raw: string) => {
    const v = Math.max(0, Math.min(100, Math.round(Number(raw) || 0)));
    onChange({ ...overrides, [q]: v });
  };
  const unlock = (q: QaId) => {
    const next = { ...overrides };
    delete next[q];
    onChange(next);
  };

  const hasLocks = Object.keys(overrides).length > 0;

  return (
    <section aria-labelledby="override-heading" className="rounded-xl border border-line bg-surface p-4">
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="override-heading" className="text-base font-semibold">
          {t('override.heading')}
        </h2>
        {hasLocks && (
          <button
            type="button"
            onClick={() => onChange({})}
            className="text-xs font-medium text-brand hover:underline"
          >
            {t('override.clear')}
          </button>
        )}
      </div>
      <p className="mt-1 text-sm text-ink-soft">{t('override.intro')}</p>

      <ul className="mt-3 divide-y divide-line">
        {QA_ORDER.map((q) => {
          const locked = overrides[q] !== undefined;
          const value = locked ? (overrides[q] as number) : rounded[q];
          return (
            <li key={q} className="flex items-center gap-3 py-2">
              <span className="min-w-0 flex-1 truncate text-sm">{tr(QUALITY_ATTRIBUTES[q].name)}</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={value}
                  aria-label={tr(QUALITY_ATTRIBUTES[q].name)}
                  onChange={(e) => setOverride(q, e.target.value)}
                  className="no-spin w-14 rounded-md border px-2 py-1 text-right text-sm tabular-nums outline-none"
                  style={{
                    borderColor: locked ? 'var(--color-text-info)' : 'var(--color-border-secondary)',
                    background: locked ? 'var(--color-background-info)' : 'var(--color-background-primary)',
                    color: locked ? 'var(--color-text-info)' : 'var(--color-text-primary)',
                    fontWeight: locked ? 600 : 400,
                  }}
                />
                <span className="text-xs text-ink-faint">%</span>
              </div>
              <div className="w-16 text-right">
                {locked ? (
                  <button
                    type="button"
                    onClick={() => unlock(q)}
                    className="rounded-md border border-line px-2 py-1 text-[11px] hover:bg-surface-2"
                  >
                    {t('override.unlock')}
                  </button>
                ) : (
                  <span className="text-[11px] text-ink-faint">{t('override.auto')}</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
