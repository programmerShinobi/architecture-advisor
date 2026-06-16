import { useI18n } from '../i18n/I18nContext';
import { DIMENSION_ORDER, DIMENSIONS } from '../config/dimensions';
import { RISKS } from '../config/risks';
import { LevelBadge } from './LevelBadge';
import type { DimensionId } from '../types';

interface Props {
  selections: Record<DimensionId, string>;
  bare?: boolean;
}

// Risks of the options in the current combination, with likelihood/impact and mitigation.
export function RiskRegister({ selections, bare = false }: Props) {
  const { t, tr } = useI18n();

  const entries = DIMENSION_ORDER.flatMap((dim) => {
    const optId = selections[dim];
    const opt = DIMENSIONS[dim].options.find((o) => o.id === optId);
    const risks = RISKS[`${dim}:${optId}`] ?? [];
    return risks.map((risk, i) => ({ key: `${dim}-${i}`, optionName: opt?.name ?? optId, risk }));
  });

  const body = (
    <>
      <p className={bare ? 'text-sm text-ink-soft' : 'mt-1 text-sm text-ink-soft'}>{t('risk.intro')}</p>

      {entries.length === 0 ? (
        <p className="mt-2 text-sm text-ink-soft">{t('risk.none')}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {entries.map(({ key, optionName, risk }) => (
            <li key={key} className="rounded-lg border border-line bg-surface-2 p-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded bg-surface px-1.5 py-0.5 text-[11px] font-medium text-ink-soft">
                  {optionName}
                </span>
                <span className="text-[11px] text-ink-soft">
                  {t('risk.likelihood')}: <LevelBadge level={risk.likelihood} />
                </span>
                <span className="text-[11px] text-ink-soft">
                  {t('risk.impact')}: <LevelBadge level={risk.impact} />
                </span>
              </div>
              <p className="mt-1.5 text-sm">{tr(risk.description)}</p>
              <p className="mt-0.5 text-xs text-ink-soft">
                <span className="font-medium">{t('risk.mitigation')}:</span> {tr(risk.mitigation)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </>
  );

  if (bare) return body;
  return (
    <section aria-labelledby="risk-heading" className="rounded-xl border border-line bg-surface p-4">
      <h3 id="risk-heading" className="text-base font-semibold">
        {t('risk.heading')}
      </h3>
      {body}
    </section>
  );
}
