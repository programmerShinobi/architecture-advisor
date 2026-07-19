import type { Lang, Levels } from '../../types';
import type { Overrides } from '../scoring';

/** Reading mode — mirrors the app's Mode union (kept local to avoid a UI-layer import). */
export type ChatMode = 'guided' | 'expert';

// Phase 3 — Context-Aware Client-Side Chatbot. Strict, decoupled contracts so the UI is a dumb
// presentation layer for a Message[] + stream, and the ChatService is swappable (Adapter Pattern).

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  /** Markdown (rendered dependency-free via lib/markdown → React elements, XSS-safe by construction). */
  text: string;
  ts: number;
  /** assistant only: true while the stream is still arriving. */
  streaming?: boolean;
  /** assistant only: the turn failed (network/adapter error) — the bubble shows a Regenerate action. */
  error?: boolean;
}

/**
 * The immutable 4-step pipeline payload handed to the chatbot. It carries ONLY the scenario inputs
 * (the single source of truth); the adapter re-derives weights/rankings from the frozen engine, so
 * there is never a parallel or stale copy of the model. Deep-cloned on handoff (see buildChatContext).
 */
export interface ChatContext {
  levels: Levels;
  overrides: Overrides;
  mode: ChatMode;
  lang: Lang;
}

/** One streamed chunk from an adapter. Simulated for the local engine; real tokens for a future LLM. */
export type ChatChunk = { delta: string };

/**
 * The decoupled ChatService boundary (Adapter Pattern, Blueprint Phase 1.3). The current
 * implementation wraps the local rule-based engine; a network LLM is a drop-in replacement with
 * zero UI changes. `signal` supports cancellation; the return is an async stream the UI consumes.
 */
export interface ChatAdapter {
  readonly id: string;
  /** Whether this adapter reaches the network (drives offline UX + resiliency paths). */
  readonly network: boolean;
  reply(history: readonly ChatMessage[], context: ChatContext, signal: AbortSignal): AsyncIterable<ChatChunk>;
}

/** Suggested quick-prompts surfaced in the empty state (i18n keys resolved in the UI). */
export interface ChatSuggestion {
  key: string;
  prompt: string;
}

export type { DimensionId, QaId } from '../../types';
