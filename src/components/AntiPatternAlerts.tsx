import { useI18n } from '../i18n/I18nContext';
import type { AntiPatternRule, Severity } from '../config/antiPatterns';

interface Props {
  rules: AntiPatternRule[];
}

const STYLES: Record<Severity, string> = {
  danger:
    'border-red-300/60 bg-red-50 text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200',
  warning:
    'border-amber-300/60 bg-amber-50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200',
  info: 'border-sky-300/60 bg-sky-50 text-sky-900 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-200',
};

const ICON: Record<Severity, string> = { danger: '⛔', warning: '⚠', info: 'ℹ' };

// Rule-based warnings on the chosen combination, sorted danger → warning → info.
export function AntiPatternAlerts({ rules }: Props) {
  const { t, tr } = useI18n();
  const order: Severity[] = ['danger', 'warning', 'info'];
  const sorted = [...rules].sort((a, b) => order.indexOf(a.severity) - order.indexOf(b.severity));

  return (
    <section aria-labelledby="antipatterns-heading" className="rounded-xl border border-line bg-surface p-4">
      <h2 id="antipatterns-heading" className="text-base font-semibold">
        {t('antipatterns.heading')}
      </h2>

      {sorted.length === 0 ? (
        <p className="mt-2 flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400">
          <span aria-hidden>✓</span>
          {t('antipatterns.none')}
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {sorted.map((r) => (
            <li
              key={r.id}
              role="alert"
              className={'rounded-lg border px-3 py-2 text-xs leading-relaxed ' + STYLES[r.severity]}
            >
              <span className="font-semibold">
                <span aria-hidden className="mr-1">
                  {ICON[r.severity]}
                </span>
                {t(`severity.${r.severity}` as 'severity.danger')} ·{' '}
                <span className="font-mono text-[11px] font-normal opacity-80">{r.id}</span>
              </span>
              <p className="mt-1">{tr(r.message)}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
