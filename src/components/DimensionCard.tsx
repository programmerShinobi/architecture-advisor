import { useI18n } from '../i18n/I18nContext';
import { displayScore, isCloseCall } from '../lib/scoring';
import type { Dimension, RankedOption } from '../types';

interface Props {
  dimension: Dimension;
  ranked: RankedOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}

// One architecture dimension: ranked options with 0–100 bars, each selectable to build the
// combination. The #1 option is tagged "recommended"; a close call is flagged.
export function DimensionCard({ dimension, ranked, selectedId, onSelect }: Props) {
  const { t, tr } = useI18n();
  const closeCall = isCloseCall(ranked);

  return (
    <section className="rounded-xl border border-line bg-surface p-4">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold">{tr(dimension.name)}</h3>
        <span className="text-xs text-ink-soft">{tr(dimension.guidedLabel)}</span>
      </div>

      {closeCall && (
        <p
          role="alert"
          className="mt-2 rounded-md border border-amber-300/50 bg-amber-50 px-2 py-1.5 text-[11px] text-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
        >
          {t('results.closeCall')}
        </p>
      )}

      <ul role="radiogroup" aria-label={tr(dimension.name)} className="mt-3 space-y-1.5">
        {ranked.map((o, i) => {
          const d = displayScore(o.score);
          const selected = o.id === selectedId;
          return (
            <li key={o.id}>
              <button
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onSelect(o.id)}
                className={
                  'w-full rounded-lg border px-3 py-2 text-left transition-colors ' +
                  (selected
                    ? 'border-brand bg-brand/5'
                    : 'border-transparent hover:border-line hover:bg-surface-2')
                }
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="flex min-w-0 items-center gap-1.5">
                    <span
                      aria-hidden
                      className={
                        'inline-block h-3 w-3 shrink-0 rounded-full border ' +
                        (selected ? 'border-brand bg-brand' : 'border-line')
                      }
                    />
                    <span className={'truncate text-sm ' + (i === 0 ? 'font-semibold' : '')}>
                      {o.name}
                    </span>
                    {i === 0 && (
                      <span className="shrink-0 rounded bg-surface-2 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-ink-soft">
                        {t('dim.recommended')}
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 text-xs tabular-nums text-ink-soft">{d}</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                  <div
                    className={'h-full rounded-full ' + (i === 0 ? 'bg-brand' : 'bg-ink-soft/40')}
                    style={{ width: `${d}%` }}
                  />
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
