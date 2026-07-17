import { useEffect, useState } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import type { DictKey } from '../../i18n/dict';

const STEPS: { n: string; g: DictKey; e: DictKey }[] = [
  { n: '1', g: 'step1.g', e: 'step1.e' },
  { n: '2', g: 'step2.g', e: 'step2.e' },
  { n: '3', g: 'step3.g', e: 'step3.e' },
  { n: '4', g: 'step4.g', e: 'step4.e' },
];

// The 4-step journey rail (guided/expert labels swap via .guided-only/.expert-only).
// Fase 2d (owner request): the rail FLOATS (sticky under the app bar), each step is a BUTTON
// that scrolls to its section, and a scroll-spy highlights WHERE YOU ARE right now.
export function StepTracker() {
  const { t } = useI18n();
  const [active, setActive] = useState(1);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        let cur = 1;
        for (let i = 1; i <= STEPS.length; i++) {
          const el = document.getElementById(`aa-sec-${i}`);
          if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) cur = i;
        }
        setActive(cur);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const go = (i: number) => document.getElementById(`aa-sec-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <nav className="aa-steps aa-glass" aria-label={t('steps.aria')}>
      {STEPS.map((s, i) => {
        const on = active === i + 1;
        return (
          <span key={s.n} style={{ display: 'contents' }}>
            <button type="button" className={'aa-step' + (on ? ' on' : '')} aria-current={on ? 'step' : undefined} onClick={() => go(i + 1)}>
              <span className="f-num">{s.n}</span>
              <span className="aa-step-label">
                <span className="guided-only">{t(s.g)}</span>
                <span className="expert-only">{t(s.e)}</span>
              </span>
            </button>
            {i < STEPS.length - 1 && <span className="aa-step-line" aria-hidden />}
          </span>
        );
      })}
    </nav>
  );
}
