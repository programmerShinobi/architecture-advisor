import type { Bilingual, Lang } from '../../types';
import type { TourId } from './dataTourId';

// Copilot domain types (Phase 1). The tour is DATA (see tourConfig); the engine/overlay are generic
// renderers of it — so new steps are added as config, never as component edits (pluggable).

export type CopilotView = 'home' | 'advisor' | 'learn';
export type Placement = 'top' | 'bottom' | 'left' | 'right';

export interface CopilotStep {
  id: string;
  /** Which primary view this step lives on — the copilot navigates there / skips if unmounted. */
  view: CopilotView;
  /** The whitelisted element this step points at. */
  target: TourId;
  title: Bilingual;
  body: Bilingual;
  placement?: Placement;
  dos?: Bilingual[];
  donts?: Bilingual[];
  /** True when the target is a FIXED/floating control (e.g. the Chat Advisor FAB), not a normal
   *  page section. Floating targets don't move when the page scrolls, so the Pre-Flight Check must
   *  skip the scroll-into-view adjustment, and the overlay must skip the mobile bottom sheet (which
   *  would otherwise cover the very control it's meant to highlight). */
  floating?: boolean;
}

export interface CopilotTour {
  id: string;
  steps: CopilotStep[];
}

/** Live context handed to the service so a step can be enriched with real, current facts. */
export interface CopilotContext {
  lang: Lang;
  /** e.g. the current top D1 recommendation name, for the recommendation step. */
  topPick?: string;
}

/** Resolved, presentation-ready content for one step (already localized + enriched). */
export interface CopilotStepView {
  title: string;
  body: string;
  dos: string[];
  donts: string[];
  target: TourId;
  placement: Placement;
  view: CopilotView;
  floating: boolean;
}

/**
 * The decoupled CopilotService (Adapter Pattern, mirrors the chat's design). The current
 * implementation is local + rule-based (no LLM); it turns a config step + live context into a
 * localized, enriched StepView. A future LLM that emits structured step/command JSON is a drop-in.
 */
export interface CopilotService {
  readonly id: string;
  describe(step: CopilotStep, ctx: CopilotContext): CopilotStepView;
}
