import { useI18n } from '../i18n/I18nContext';
import { FACTOR_ORDER, FACTORS } from '../config/factors';
import type { Levels } from '../types';
import { FactorControl } from './FactorControl';

interface Props {
  levels: Levels;
  onChange: (next: Levels) => void;
}

// Factor inputs, grouped by their `group` (Team & delivery / Scale & performance / Domain, data & risk).
export function FactorPanel({ levels, onChange }: Props) {
  const { t, tr } = useI18n();

  // Preserve canonical order while grouping.
  const groups: { label: string; ids: typeof FACTOR_ORDER }[] = [];
  for (const id of FACTOR_ORDER) {
    const label = tr(FACTORS[id].group);
    let g = groups.find((x) => x.label === label);
    if (!g) {
      g = { label, ids: [] };
      groups.push(g);
    }
    g.ids.push(id);
  }

  return (
    <section aria-labelledby="factors-heading" className="rounded-xl border border-line bg-surface p-4">
      <h2 id="factors-heading" className="text-base font-semibold">
        {t('factors.heading')}
      </h2>
      <p className="mt-1 text-sm text-ink-soft">{t('factors.intro')}</p>

      {groups.map((g) => (
        <details key={g.label} open className="group mt-3 border-t border-line pt-2">
          <summary className="cursor-pointer list-none text-xs font-semibold uppercase tracking-wide text-ink-soft">
            <span className="inline-block transition-transform group-open:rotate-90">▸</span> {g.label}
          </summary>
          <div className="divide-y divide-line">
            {g.ids.map((id) => (
              <FactorControl
                key={id}
                factor={FACTORS[id]}
                level={levels[id] ?? 0}
                onChange={(level) => onChange({ ...levels, [id]: level })}
              />
            ))}
          </div>
        </details>
      ))}
    </section>
  );
}
