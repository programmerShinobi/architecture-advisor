import { useI18n } from '../i18n/I18nContext';
import { PRESETS } from '../config/presets';
import type { Levels } from '../types';

interface Props {
  onApply: (levels: Levels) => void;
}

// Scenario presets — one click fills all 14 factors with a calibrated, machine-verified scenario.
export function PresetBar({ onApply }: Props) {
  const { t, tr } = useI18n();

  return (
    <section aria-labelledby="presets-heading" className="rounded-xl border border-line bg-surface p-4">
      <h2 id="presets-heading" className="text-base font-semibold">
        {t('presets.heading')}
      </h2>
      <p className="mt-1 text-sm text-ink-soft">{t('presets.intro')}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onApply(preset.levels)}
            title={tr(preset.description)}
            className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium hover:border-brand hover:bg-brand/5"
          >
            {tr(preset.label)}
          </button>
        ))}
      </div>
    </section>
  );
}
