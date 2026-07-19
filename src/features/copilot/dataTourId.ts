// Universal `data-tour-id` schema (Copilot Phase 1.2). A CLOSED whitelist: every tour target and
// every emitted highlight command is validated against this set, so a command can never point at an
// arbitrary/injected selector (security) and typos fail fast (correctness). IDs are applied
// NON-INVASIVELY to existing elements via the `tourId()` spread — no wrapper markup, no logic change.

export const TOUR_IDS = [
  'scenario-gallery', // Step 1 — the Scenario Card Gallery + Custom Wizard entry
  'project-factors', // Step 1 — the 14 project factors
  'quality-priorities', // Step 2 — derived ISO/IEC 25010 weights
  'recommendation', // Step 3 — the engine output (professional analysis)
  'strategic-output', // Step 4 — export / share
  'ai-advisor', // the chat launcher
] as const;

export type TourId = (typeof TOUR_IDS)[number];

const SET = new Set<string>(TOUR_IDS);

/** Runtime whitelist guard — the only selectors the overlay is ever allowed to target. */
export function isTourId(v: unknown): v is TourId {
  return typeof v === 'string' && SET.has(v);
}

/**
 * Spread onto any element to make it a tour target, non-invasively:
 *   <section {...tourId('recommendation')}>…</section>
 * Returns a typed `data-tour-id` attribute — nothing else.
 */
export function tourId(id: TourId): { 'data-tour-id': TourId } {
  return { 'data-tour-id': id };
}

/** Resolve a live target element for a tour id (or null if not currently mounted). */
export function findTourTarget(id: TourId): HTMLElement | null {
  if (!isTourId(id)) return null;
  return document.querySelector<HTMLElement>(`[data-tour-id="${id}"]`);
}
