import { useI18n } from '../i18n/I18nContext';
import { DIMENSIONS } from '../config/dimensions';
import { COST_OPS } from '../config/costOps';
import { LevelBadge } from './LevelBadge';

// Qualitative cost & operational-complexity profile per D1 deployment option.
export function CostOpsBadges({ bare = false }: { bare?: boolean }) {
  const { t, tr } = useI18n();

  const body = (
    <>
      <p className={bare ? 'text-sm text-ink-soft' : 'mt-1 text-sm text-ink-soft'}>{t('costops.intro')}</p>

      <ul className="mt-3 space-y-2">
        {DIMENSIONS.D1.options.map((opt) => {
          const co = COST_OPS[opt.id];
          if (!co) return null;
          return (
            <li key={opt.id} className="rounded-lg bg-surface-2 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-medium">{opt.name}</span>
                <span className="flex items-center gap-3 text-[11px] text-ink-soft">
                  <span>
                    {t('costops.overhead')}: <LevelBadge level={co.overhead} />
                  </span>
                  <span>
                    {t('costops.infra')}: <LevelBadge level={co.infraCost} />
                  </span>
                </span>
              </div>
              <p className="mt-1 text-xs text-ink-soft">{tr(co.caveat)}</p>
            </li>
          );
        })}
      </ul>
    </>
  );

  if (bare) return body;
  return (
    <section aria-labelledby="costops-heading" className="rounded-xl border border-line bg-surface p-4">
      <h3 id="costops-heading" className="text-base font-semibold">
        {t('costops.heading')}
      </h3>
      {body}
    </section>
  );
}
