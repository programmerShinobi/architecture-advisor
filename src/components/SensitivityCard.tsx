import { useI18n } from '../i18n/I18nContext';
import { FACTORS } from '../config/factors';
import { sensitivity } from '../lib/scoring';
import type { FactorId, Levels } from '../types';

interface Props {
  levels: Levels;
}

// Robustness analysis for D1: which single factor change (±1 level) would flip the winner.
export function SensitivityCard({ levels }: Props) {
  const { t, tr } = useI18n();
  const flips = sensitivity(levels, 'D1');

  return (
    <section aria-labelledby="sensitivity-heading" className="rounded-xl border border-line bg-surface p-4">
      <h3 id="sensitivity-heading" className="text-base font-semibold">
        {t('sensitivity.heading')}
      </h3>

      {flips.length === 0 ? (
        <p className="mt-2 flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400">
          <span aria-hidden>✓</span>
          {t('sensitivity.robust')}
        </p>
      ) : (
        <>
          <p className="mt-2 text-sm text-ink-soft">{t('sensitivity.lead')}</p>
          <ul className="mt-2 space-y-1.5 text-sm">
            {flips.map((f) => {
              const factor = FACTORS[f.factor as FactorId];
              const current = levels[f.factor as FactorId] ?? 0;
              const dir = f.to > current ? t('sensitivity.raise') : t('sensitivity.lower');
              return (
                <li key={`${f.factor}-${f.to}`} className="flex flex-wrap items-baseline gap-x-1">
                  <span className="font-medium">{tr(factor.label)}</span>
                  <span className="text-ink-soft">
                    — {dir} “{tr(factor.levels[f.to])}” →
                  </span>
                  <span className="font-medium">{f.newWinner}</span>
                  <span className="text-ink-soft">{t('sensitivity.wins')}</span>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}
