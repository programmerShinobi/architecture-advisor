import { IconChevronRight } from '@tabler/icons-react';
import { useI18n } from '../../i18n/I18nContext';
import type { DictKey } from '../../i18n/dict';

const STEPS: { n: string; g: DictKey; e: DictKey }[] = [
  { n: '1', g: 'step1.g', e: 'step1.e' },
  { n: '2', g: 'step2.g', e: 'step2.e' },
  { n: '3', g: 'step3.g', e: 'step3.e' },
  { n: '4', g: 'step4.g', e: 'step4.e' },
];

// The 4-step progress indicator (guided/expert labels swap via the .guided-only/.expert-only CSS).
export function StepTracker() {
  const { t } = useI18n();
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: 'var(--aa-space-3) var(--aa-panel-pad)',
        borderBottom: '0.5px solid var(--color-border-tertiary)',
        flexWrap: 'wrap',
      }}
    >
      {STEPS.map((s, i) => (
        <span key={s.n} style={{ display: 'contents' }}>
          <div className="f-step act">
            <span className="n">{s.n}</span>
            <span className="guided-only">{t(s.g)}</span>
            <span className="expert-only">{t(s.e)}</span>
          </div>
          {i < STEPS.length - 1 && (
            <IconChevronRight size={13} style={{ color: 'var(--color-text-tertiary)' }} aria-hidden />
          )}
        </span>
      ))}
    </div>
  );
}
