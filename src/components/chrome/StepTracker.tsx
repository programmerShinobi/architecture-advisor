import { useI18n } from '../../i18n/I18nContext';
import type { DictKey } from '../../i18n/dict';

const STEPS: { n: string; g: DictKey; e: DictKey }[] = [
  { n: '1', g: 'step1.g', e: 'step1.e' },
  { n: '2', g: 'step2.g', e: 'step2.e' },
  { n: '3', g: 'step3.g', e: 'step3.e' },
  { n: '4', g: 'step4.g', e: 'step4.e' },
];

// The 4-step journey rail (guided/expert labels swap via .guided-only/.expert-only).
// Fase 2c redesign: numbered coins on a soft connector rail — modern, calm, and obvious
// for newcomers ("this is the path you are walking").
export function StepTracker() {
  const { t } = useI18n();
  return (
    <div className="aa-steps">
      {STEPS.map((s, i) => (
        <span key={s.n} style={{ display: 'contents' }}>
          <div className="aa-step">
            <span className="f-num">{s.n}</span>
            <span className="aa-step-label">
              <span className="guided-only">{t(s.g)}</span>
              <span className="expert-only">{t(s.e)}</span>
            </span>
          </div>
          {i < STEPS.length - 1 && <span className="aa-step-line" aria-hidden />}
        </span>
      ))}
    </div>
  );
}
