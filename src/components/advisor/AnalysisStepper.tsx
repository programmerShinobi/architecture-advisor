import { useEffect, useRef, useState } from 'react';
import { IconCheck, IconTerminal2 } from '@tabler/icons-react';
import { useI18n } from '../../i18n/I18nContext';
import type { DictKey } from '../../i18n/dict';

// The honest Step-3 "System Analysis Stepper" (Master Blueprint Phase 2.2). The engine computes in
// <1ms, so this NEVER fakes latency: it briefly surfaces the REAL pipeline stages the engine just
// ran (weights → scoring → anti-patterns → ranking) as a developer-centric terminal readout, then
// reveals the result. It only plays on an explicit "analyze" action (preset/wizard apply); live
// factor edits stay instant. Under prefers-reduced-motion it renders nothing (instant, honest).

const STAGES: DictKey[] = [
  'analysis.run.weights',
  'analysis.run.score',
  'analysis.run.antipatterns',
  'analysis.run.rank',
];
const STEP_MS = 180;

export function AnalysisStepper({ runKey }: Readonly<{ runKey: number }>) {
  const { t } = useI18n();
  const [active, setActive] = useState(-1); // -1 hidden · 0..n-1 running stage · n done
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (runKey <= 0) return;
    const reduce = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return; // honest instant — no theater under reduced motion
    timers.current.forEach(clearTimeout);
    timers.current = [];
    // All state changes run from timers (0..n) so none fires synchronously inside the effect.
    for (let i = 0; i <= STAGES.length; i++) {
      timers.current.push(window.setTimeout(() => setActive(i), i * STEP_MS));
    }
    timers.current.push(window.setTimeout(() => setActive(-1), STAGES.length * STEP_MS + 550));
    return () => timers.current.forEach(clearTimeout);
  }, [runKey]);

  if (active < 0) return null;
  const done = active >= STAGES.length;

  return (
    <div className="aa-stepper" role="status" aria-live="polite">
      <div className="aa-stepper-head">
        <IconTerminal2 size={14} aria-hidden />
        <span>{t(done ? 'analysis.run.done' : 'analysis.run.title')}</span>
        {!done && (
          <button type="button" className="aa-stepper-skip" onClick={() => setActive(-1)}>
            {t('analysis.run.skip')}
          </button>
        )}
      </div>
      <ul className="aa-stepper-list">
        {STAGES.map((s, i) => {
          const state = done || i < active ? 'done' : i === active ? 'active' : 'pending';
          return (
            <li key={s} className={`aa-stepper-line ${state}`}>
              <span className="aa-stepper-mark" aria-hidden>
                {state === 'done' ? <IconCheck size={12} /> : state === 'active' ? '›' : '·'}
              </span>
              {t(s)}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
