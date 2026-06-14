import { useI18n } from '../i18n/I18nContext';

// Permanent honesty disclaimer (design principle 1: intellectual honesty). Always visible.
export function Disclaimer() {
  const { t } = useI18n();
  return (
    <div
      role="note"
      className="border-b border-amber-300/40 bg-amber-50 px-4 py-2 text-center text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
    >
      {t('disclaimer')}
    </div>
  );
}
