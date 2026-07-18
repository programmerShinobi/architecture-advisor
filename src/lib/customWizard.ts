import { FACTOR_ORDER } from '../config/factors';
import { WIZARD_QUESTIONS, type WizardGroup } from '../config/customWizard';
import type { FactorId, Levels } from '../types';

// Pure bridge from the Custom Wizard answers to the frozen engine's 14 factor levels (Master
// Blueprint Phase 1.2 + 3.1). No React, no IO — fully unit-tested. There is ONE scoring model:
// the wizard only DERIVES factor levels; the frozen `rank()` does the actual scoring.

export type WizardSelections = Record<string, string | string[] | undefined>;

/**
 * Override priority (Phase 3.1, deterministic): Goal sets the broad shape, Domain refines it,
 * prioritized NFRs fine-tune, and the user's HARD constraints (budget/team/timeline) win last —
 * an explicit constraint must never be silently overridden by a softer signal.
 */
const GROUP_PRIORITY: Record<WizardGroup, number> = { goal: 0, domain: 1, nfr: 2, constraints: 3 };

/**
 * Intelligent baseline (Phase 3.2 resilience): every unspecified factor defaults to MODERATE (1),
 * so even an empty or vague wizard yields a sensible, balanced recommendation — the engine can
 * never receive an undefined level and never crashes.
 */
const baseline = (): Levels => Object.fromEntries(FACTOR_ORDER.map((f) => [f, 1])) as Levels;

/** Map the four universal wizard variables onto the frozen model's 14 factor levels. */
export function wizardToLevels(selections: WizardSelections): Levels {
  const levels = baseline();
  const ordered = [...WIZARD_QUESTIONS].sort((a, b) => GROUP_PRIORITY[a.group] - GROUP_PRIORITY[b.group]);
  for (const q of ordered) {
    const picked = selections[q.id];
    const ids = Array.isArray(picked) ? picked : picked ? [picked] : [];
    for (const optId of ids) {
      const opt = q.options.find((o) => o.id === optId);
      if (!opt) continue;
      for (const [f, v] of Object.entries(opt.levels)) {
        levels[f as FactorId] = v;
      }
    }
  }
  return levels;
}

/**
 * Whether the user has answered enough for a meaningful custom scenario (at least the primary
 * goal). Below this the mapping still returns a valid baseline — this only gates the submit CTA
 * so newcomers are gently nudged to pick a goal (Phase 3.2 clarification prompt).
 */
export function wizardHasSignal(selections: WizardSelections): boolean {
  return Boolean(selections.goal);
}
