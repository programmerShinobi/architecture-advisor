// Feature flags for optional, independently-shippable features. The frozen model and the core
// four-step Advisor never depend on a flag — only add-on layers do.
//
// The Chat Advisor (Phase 3) is code-split behind this single switch, so it can be turned off
// again with a ONE-LINE change (`chat: false`) with zero other edits — the Copilot tour drops its
// chat step, the FAB unmounts, and "Start Over" simply stops resetting it, all automatically.
export const FEATURES = {
  /** Chat Advisor (FAB + panel + hook + adapter). */
  chat: true,
} as const;
