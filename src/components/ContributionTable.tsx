import { useI18n } from '../i18n/I18nContext';
import { QUALITY_ATTRIBUTES } from '../config/qualityAttributes';
import { composite, contributions } from '../lib/scoring';
import type { ArchOption, Weights } from '../types';

interface Props {
  weights: Weights;
  option: ArchOption;
}

// Per-QA breakdown for one option: weight%, fit, weighted points — reconciling to the composite.
export function ContributionTable({ weights, option }: Props) {
  const { t, tr } = useI18n();
  const rows = contributions(weights, option.qaFit).filter((r) => r.weight > 0.05);
  const total = composite(weights, option.qaFit);

  return (
    <section aria-labelledby="contribution-heading" className="rounded-xl border border-line bg-surface p-4">
      <h3 id="contribution-heading" className="text-base font-semibold">
        {t('contribution.heading')}
      </h3>
      <p className="mt-1 text-sm text-ink-soft">
        {t('contribution.intro')} <span className="font-medium text-ink">{option.name}</span>.
      </p>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-soft">
              <th className="py-1.5 pr-2 font-medium">{t('contribution.qa')}</th>
              <th className="py-1.5 px-2 text-right font-medium">{t('contribution.weight')}</th>
              <th className="py-1.5 px-2 text-right font-medium">{t('contribution.fit')}</th>
              <th className="py-1.5 pl-2 text-right font-medium">{t('contribution.points')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.qa} className="border-b border-line/60">
                <td className="py-1.5 pr-2">{tr(QUALITY_ATTRIBUTES[r.qa].name)}</td>
                <td className="py-1.5 px-2 text-right tabular-nums text-ink-soft">
                  {Math.round(r.weight)}%
                </td>
                <td className="py-1.5 px-2 text-right tabular-nums">{r.fit}</td>
                <td className="py-1.5 pl-2 text-right tabular-nums">{r.points.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-semibold">
              <td className="py-2 pr-2" colSpan={3}>
                {t('contribution.total')}
              </td>
              <td className="py-2 pl-2 text-right tabular-nums">{total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
