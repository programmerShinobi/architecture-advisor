import { useI18n } from '../i18n/I18nContext';
import { QUALITY_ATTRIBUTES } from '../config/qualityAttributes';
import { FITNESS_TEMPLATES } from '../config/fitnessFunctions';
import { roundWeights } from '../lib/scoring';
import type { QaId, Weights } from '../types';

interface Props {
  weights: Weights;
  /** How many top-weighted QAs to surface (Build Spec Section 11: ~4). */
  topN?: number;
  bare?: boolean;
}

// Suggested measurable fitness functions for the top-weighted quality attributes.
export function FitnessFunctions({ weights, topN = 4, bare = false }: Props) {
  const { t, tr } = useI18n();
  const rounded = roundWeights(weights);
  const top = (Object.keys(rounded) as QaId[])
    .filter((q) => rounded[q] > 0)
    .sort((a, b) => rounded[b] - rounded[a])
    .slice(0, topN);

  const body = (
    <>
      <p className={bare ? 'text-sm text-ink-soft' : 'mt-1 text-sm text-ink-soft'}>{t('fitness.intro')}</p>

      <ul className="mt-3 space-y-2">
        {top.map((q) => (
          <li key={q} className="rounded-lg bg-surface-2 p-3">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-sm font-medium">{tr(QUALITY_ATTRIBUTES[q].name)}</span>
              <span className="text-xs tabular-nums text-ink-soft">{rounded[q]}%</span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-ink-soft">{tr(FITNESS_TEMPLATES[q])}</p>
          </li>
        ))}
      </ul>
    </>
  );

  if (bare) return body;
  return (
    <section aria-labelledby="fitness-heading" className="rounded-xl border border-line bg-surface p-4">
      <h3 id="fitness-heading" className="text-base font-semibold">
        {t('fitness.heading')}
      </h3>
      {body}
    </section>
  );
}
