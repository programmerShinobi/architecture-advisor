import { useI18n } from '../i18n/I18nContext';
import { displayScore, isCloseCall } from '../lib/scoring';
import type { RankedOption } from '../types';

interface Props {
  ranked: RankedOption[];
}

// Ranked options for a dimension, with a 0–100 display bar each and a close-call note.
export function DimensionResults({ ranked }: Props) {
  const { t } = useI18n();
  const closeCall = isCloseCall(ranked);
  const topDisplay = displayScore(ranked[0].score);

  return (
    <section aria-labelledby="results-heading" className="rounded-xl border border-line bg-surface p-4">
      <h2 id="results-heading" className="text-base font-semibold">
        {t('results.heading')}
      </h2>

      <div className="mt-3 rounded-lg bg-surface-2 p-3">
        <div className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
          {t('results.top')}
        </div>
        <div className="mt-0.5 flex items-baseline justify-between gap-2">
          <span className="text-lg font-semibold">{ranked[0].name}</span>
          <span className="text-sm tabular-nums text-ink-soft">
            {topDisplay} {t('results.scoreUnit')}
          </span>
        </div>
      </div>

      {closeCall && (
        <p
          role="alert"
          className="mt-3 rounded-md border border-amber-300/50 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
        >
          {t('results.closeCall')}
        </p>
      )}

      <ol className="mt-3 space-y-2">
        {ranked.map((o, i) => {
          const d = displayScore(o.score);
          return (
            <li key={o.id} className="flex items-center gap-3">
              <span className="w-4 text-right text-xs tabular-nums text-ink-soft">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className={'truncate text-sm ' + (i === 0 ? 'font-semibold' : '')}>
                    {o.name}
                  </span>
                  <span className="shrink-0 text-xs tabular-nums text-ink-soft">{d}</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                  <div
                    className={'h-full rounded-full ' + (i === 0 ? 'bg-brand' : 'bg-ink-soft/50')}
                    style={{ width: `${d}%` }}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
