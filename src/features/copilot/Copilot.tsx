import { useEffect, useRef } from 'react';
import { useCopilot } from './useCopilot';
import { CopilotLauncher } from './components/CopilotLauncher';
import { CopilotOverlay } from './components/CopilotOverlay';
import type { CopilotView } from './types';

// The pluggable Copilot entry (Phase 1.2). The whole feature is this one component + its module;
// App mounts <Copilot/> and passes the few things the engine needs (current view + a navigate
// callback + language + a live fact + a reset registration). Zero copilot logic leaks into App.
interface Props {
  currentView: CopilotView;
  onRequestView: (view: CopilotView) => void;
  lang: 'en' | 'id';
  topPick?: string;
  /** App registers reset() so "Start Over" hard-resets the tour (anti-contamination). */
  registerReset: (reset: (() => void) | null) => void;
  /** True while ANY other floating/overlay UI is open — the Chat Advisor panel, the Manual/Guide
   *  book, the command palette, shortcuts, or Compare (owner report: one open thing must never be
   *  covered by or fight with another). Stops an active tour and hides the launcher. */
  suspended?: boolean;
  /** Fires the moment the tour starts, so App can close every other overlay/panel in response. */
  onTourStart?: () => void;
}

export function Copilot({ currentView, onRequestView, lang, topPick, registerReset, suspended, onTourStart }: Readonly<Props>) {
  const cop = useCopilot({ currentView, onRequestView, lang, topPick });

  // Register the hard reset for App's "Start Over".
  useEffect(() => {
    registerReset(cop.reset);
    return () => registerReset(null);
  }, [cop.reset, registerReset]);

  // Global harmony (Phase 3.1): if the user navigates AWAY from the tour's view (e.g. taps a primary
  // tab), dismiss the overlay — the engine module stops cleanly, never crashes or contaminates.
  useEffect(() => {
    if (cop.running && cop.step && currentView !== cop.step.view) cop.stop();
  }, [currentView, cop]);

  // Mutual exclusion, direction 1 (owner report): opening ANY other overlay stops an active tour.
  useEffect(() => {
    if (suspended && cop.running) cop.stop();
  }, [suspended, cop]);

  // Mutual exclusion, direction 2: tell App the moment the tour starts, so it can close everything
  // else (chat panel, Manual/Guide, palette, shortcuts, Compare).
  const startedRef = useRef(cop.running);
  useEffect(() => {
    if (cop.running && !startedRef.current) onTourStart?.();
    startedRef.current = cop.running;
  }, [cop.running, onTourStart]);

  // While the tour runs, hide the app's own sticky step-rail: the Copilot IS the guide, and on
  // small screens that pinned rail otherwise eats the vertical band a spotlight needs (owner: the
  // highlight looked "covered" behind the header). CSS reads this class; cleaned up on stop/unmount.
  useEffect(() => {
    document.body.classList.toggle('aa-cop-running', cop.running);
    return () => document.body.classList.remove('aa-cop-running');
  }, [cop.running]);

  return (
    <>
      {currentView === 'advisor' && !cop.running && !suspended && (
        <div className="aa-cop-launch-root screen-only">
          <CopilotLauncher onStart={cop.start} />
        </div>
      )}
      <CopilotOverlay
        running={cop.running}
        step={cop.step}
        index={cop.index}
        total={cop.total}
        bus={cop.bus}
        onNext={cop.next}
        onPrev={cop.prev}
        onStop={cop.stop}
      />
    </>
  );
}

export default Copilot;
