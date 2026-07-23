import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createCopilotBus } from './eventBus';
import { getCopilotService } from './copilotService';
import { findTourTarget } from './dataTourId';
import { MAIN_TOUR } from './tourConfig';
import type { CopilotContext, CopilotStepView, CopilotView } from './types';

interface Params {
  currentView: CopilotView;
  onRequestView: (view: CopilotView) => void;
  lang: 'en' | 'id';
  topPick?: string;
}

/** Two rAFs → the browser has laid out AND painted the (possibly just-mounted) target. */
const afterPaint = () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));

/**
 * Bottom edge (px from the viewport top) of the app's PINNED chrome — the sticky app bar + the
 * floating 4-step rail. A highlighted target must be scrolled to sit BELOW this, or the spotlight
 * lands behind the sticky header and the target looks "covered" (owner report). Zero when neither
 * is present (e.g. off the Advisor view).
 */
function topChromeBottom(): number {
  const vh = window.visualViewport?.height ?? window.innerHeight;
  let bottom = 0;
  for (const sel of ['.aa-appbar', '.aa-steps']) {
    const el = document.querySelector(sel);
    if (!el) continue;
    const r = el.getBoundingClientRect();
    // Count it only while it's genuinely pinned near the top (not scrolled far down the page).
    if (r.top <= vh * 0.4 && r.bottom > bottom) bottom = r.bottom;
  }
  return bottom;
}

/**
 * Wait until a tour target is mounted, then one paint later — bounded by a timeout so a missing
 * element degrades to a Silent Fallback (resolve null) instead of hanging (Copilot Phase 1.1/1.2).
 */
function waitForTarget(id: Parameters<typeof findTourTarget>[0], timeoutMs = 1600): Promise<HTMLElement | null> {
  const now = findTourTarget(id);
  if (now) return afterPaint().then(() => findTourTarget(id));
  return new Promise((resolve) => {
    const done = (el: HTMLElement | null) => {
      mo.disconnect();
      clearTimeout(timer);
      resolve(el);
    };
    const mo = new MutationObserver(() => {
      const el = findTourTarget(id);
      if (el) afterPaint().then(() => done(findTourTarget(id)));
    });
    mo.observe(document.body, { childList: true, subtree: true });
    const timer = setTimeout(() => done(findTourTarget(id)), timeoutMs);
  });
}

// The Copilot engine (Phase 1.1). Owns run state + step index, is STEP-AWARE (navigates to a step's
// view, or waits for its target to mount), and emits the highlight command over the Event Bus ONLY
// after the target is confirmed painted. A run token guards against rapid next/prev races.
export function useCopilot({ currentView, onRequestView, lang, topPick }: Params) {
  const bus = useMemo(() => createCopilotBus(), []);
  const service = useMemo(() => getCopilotService(), []);
  const steps = MAIN_TOUR.steps;

  const [running, setRunning] = useState(false);
  const [index, setIndex] = useState(0);
  const runToken = useRef(0);

  // Latest view/context via refs so the async step effect never uses stale values.
  const viewRef = useRef(currentView);
  const ctxRef = useRef<CopilotContext>({ lang, topPick });
  useEffect(() => {
    viewRef.current = currentView;
    ctxRef.current = { lang, topPick };
  });

  const step: CopilotStepView | null = useMemo(
    () => (running && steps[index] ? service.describe(steps[index], { lang, topPick }) : null),
    [running, index, steps, service, lang, topPick],
  );

  // Drive a step: switch view if needed, wait for the target to paint, then emit the highlight.
  const runStep = useCallback(
    async (i: number) => {
      const token = ++runToken.current;
      const s = steps[i];
      if (!s) return;
      if (viewRef.current !== s.view) onRequestView(s.view);
      const el = await waitForTarget(s.target);
      if (token !== runToken.current) return; // superseded by a newer step — drop
      // Pre-Flight Check (owner revision): scroll the target's TOP to just BELOW the pinned chrome
      // (app bar + step rail) so the spotlight is never hidden behind the sticky header, yet stays
      // high enough to sit ABOVE the bottom-sheet card. Then wait a paint so the first draw isn't
      // mid-transition; the overlay's live tracking follows it afterwards. Skipped for a FLOATING
      // target (e.g. the Chat Advisor FAB): it's fixed-position, so scrolling the page can never
      // change where it sits on screen — the scroll would just be pointless page motion.
      if (el && !s.floating) {
        const r = el.getBoundingClientRect();
        const vh = window.visualViewport?.height ?? window.innerHeight;
        const desiredTop = Math.max(vh * 0.16, topChromeBottom() + 14);
        window.scrollBy({ top: r.top - desiredTop, behavior: 'smooth' });
        await afterPaint();
        if (token !== runToken.current) return;
      }
      bus.emit(el ? { type: 'highlight', target: s.target, stepIndex: i } : { type: 'dismiss' });
    },
    [steps, onRequestView, bus],
  );

  const start = useCallback(() => {
    setRunning(true);
    setIndex(0);
    void runStep(0);
  }, [runStep]);

  const go = useCallback(
    (next: number) => {
      if (next < 0) return;
      if (next >= steps.length) {
        // finished
        runToken.current++;
        setRunning(false);
        bus.emit({ type: 'stop' });
        return;
      }
      setIndex(next);
      void runStep(next);
    },
    [steps.length, runStep, bus],
  );

  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  const stop = useCallback(() => {
    runToken.current++;
    setRunning(false);
    bus.emit({ type: 'stop' });
  }, [bus]);

  /** Soft-dismiss the overlay without ending the run's "thought" (nav harmony). */
  const dismiss = useCallback(() => {
    bus.emit({ type: 'dismiss' });
  }, [bus]);

  /** Hard reset for "Start Over" (Phase 3.3) — deterministic wipe of all tour state. */
  const reset = useCallback(() => {
    runToken.current++;
    setRunning(false);
    setIndex(0);
    bus.emit({ type: 'stop' });
  }, [bus]);

  return { bus, running, index, total: steps.length, step, start, next, prev, stop, dismiss, reset };
}
