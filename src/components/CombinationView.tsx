import { useI18n } from '../i18n/I18nContext';
import { DIMENSION_ORDER, DIMENSIONS } from '../config/dimensions';
import type { DimensionId } from '../types';

interface Props {
  selections: Record<DimensionId, string>;
}

// A compact summary of the coherent recommendation: the selected option in each dimension.
export function CombinationView({ selections }: Props) {
  const { t, tr } = useI18n();

  return (
    <section aria-labelledby="combination-heading" className="rounded-xl border border-line bg-surface p-4">
      <h2 id="combination-heading" className="text-base font-semibold">
        {t('combination.heading')}
      </h2>
      <p className="mt-1 text-sm text-ink-soft">{t('combination.intro')}</p>

      <dl className="mt-3 grid gap-2 sm:grid-cols-2">
        {DIMENSION_ORDER.map((dim) => {
          const dimension = DIMENSIONS[dim];
          const opt = dimension.options.find((o) => o.id === selections[dim]);
          return (
            <div key={dim} className="rounded-lg bg-surface-2 px-3 py-2">
              <dt className="text-[11px] uppercase tracking-wide text-ink-soft">{tr(dimension.name)}</dt>
              <dd className="text-sm font-medium">{opt?.name ?? '—'}</dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
