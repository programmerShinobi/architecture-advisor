// Feature flags for optional, independently-shippable features. The frozen model and the core
// four-step Advisor never depend on a flag — only add-on layers do.
//
// The AI Advisor chat (Phase 3) is gated OFF for now (owner: the chat UX is still being finalized).
// Everything chat-related is already code-split behind this single switch, so re-enabling is a
// ONE-LINE change (`chat: true`) with zero other edits — the Copilot tour restores its chat step,
// the FAB mounts, and "Start Over" resets it, all automatically.
export const FEATURES = {
  /** AI Advisor chat (FAB + panel + hook + adapter). Off until finalized. */
  chat: false,
} as const;
