import { useI18n } from '../../i18n/I18nContext';

type Level = 'low' | 'med' | 'high';

const STYLES: Record<Level, string> = {
  low: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300',
  med: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
  high: 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300',
};

// Qualitative Low/Med/High pill, reused by the risk register and cost/ops indicators.
export function LevelBadge({ level }: { level: Level }) {
  const { t } = useI18n();
  return (
    <span className={'inline-block rounded px-1.5 py-0.5 text-[11px] font-medium ' + STYLES[level]}>
      {t(`level.${level}` as 'level.low')}
    </span>
  );
}
