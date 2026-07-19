// A tiny, typed, synchronous pub/sub Event Bus (Copilot Phase 1.1) that decouples the copilot
// engine (which decides WHAT to highlight) from the overlay (which decides HOW/ WHEN to paint it).
// Every subscribe returns an unsubscribe, so callers guarantee zero listener leaks on cleanup.

import type { TourId } from './dataTourId';

/** Structured command emitted by the CopilotService — the "function-calling" payload, local & typed. */
export type CopilotCommand =
  | { type: 'highlight'; target: TourId; stepIndex: number }
  | { type: 'dismiss' } // hide the overlay but keep the tour "thinking" (nav harmony)
  | { type: 'stop' }; // hard stop the tour

type Handler = (cmd: CopilotCommand) => void;

export interface CopilotBus {
  emit(cmd: CopilotCommand): void;
  on(handler: Handler): () => void;
}

export function createCopilotBus(): CopilotBus {
  const handlers = new Set<Handler>();
  return {
    emit(cmd) {
      // Copy before iterating so a handler that unsubscribes mid-emit can't corrupt iteration.
      for (const h of [...handlers]) h(cmd);
    },
    on(handler) {
      handlers.add(handler);
      return () => {
        handlers.delete(handler);
      };
    },
  };
}
