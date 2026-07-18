import { FACTOR_ORDER } from '../../config/factors';
import { DEFAULT_LEVELS } from '../../config/defaults';
import type { ChatContext, ChatMode } from './types';
import type { Lang, Levels } from '../../types';
import type { Overrides } from '../scoring';

/** Deep clone (structuredClone is supported across all target browsers + the test runtime). */
const clone = <T>(v: T): T => structuredClone(v);

/** A COMPLETE 14-factor baseline (DEFAULT_LEVELS is a partial the engine fills with 0). The chat
 *  context is always complete, so neither the engine nor the adapter can ever read an undefined. */
const BASELINE_LEVELS: Levels = Object.fromEntries(
  FACTOR_ORDER.map((f) => [f, (DEFAULT_LEVELS as Partial<Levels>)[f] ?? 0]),
) as Levels;

// The "Zero-Mismatch" context handoff (Blueprint Phase 1.1). We DEEP-CLONE the pipeline payload
// before the chatbot touches it, so the chat can never mutate the app's live scenario state, and
// we VALIDATE it (dependency-free — the repo's no-Zod stance) so a corrupt/partial payload degrades
// to an intelligent baseline instead of throwing a null-pointer at runtime.

const isLevel = (v: unknown): v is 0 | 1 | 2 => v === 0 || v === 1 || v === 2;

/** True only for a complete, in-range Levels object (all 14 factors present at 0–2). */
export function isValidLevels(v: unknown): v is Levels {
  if (typeof v !== 'object' || v === null) return false;
  const rec = v as Record<string, unknown>;
  return FACTOR_ORDER.every((f) => isLevel(rec[f]));
}

/** Sanitize overrides to `Partial<Record<QaId, 0..100>>` — drop anything malformed (never throw). */
function safeOverrides(v: unknown): Overrides {
  const out: Overrides = {};
  if (typeof v !== 'object' || v === null) return out;
  for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
    if (typeof val === 'number' && Number.isFinite(val) && val >= 0 && val <= 100) {
      out[k as keyof Overrides] = Math.round(val);
    }
  }
  return out;
}

/**
 * Build the chatbot's context from the live app state — DEEP-CLONED and VALIDATED. Invalid or
 * missing levels fall back to the moderate DEFAULT_LEVELS (intelligent baseline), guaranteeing the
 * adapter always receives a complete, in-range payload (zero undefined/null pointer exceptions).
 */
export function buildChatContext(input: {
  levels: unknown;
  overrides: unknown;
  mode: unknown;
  lang: unknown;
}): ChatContext {
  const levels: Levels = isValidLevels(input.levels) ? clone(input.levels) : { ...BASELINE_LEVELS };
  const mode: ChatMode = input.mode === 'expert' ? 'expert' : 'guided';
  const lang: Lang = input.lang === 'id' ? 'id' : 'en';
  return { levels, overrides: safeOverrides(input.overrides), mode, lang };
}

/** Runtime guard used by persistence hydration — a stored context must still be valid to rehydrate. */
export function isValidContext(v: unknown): v is ChatContext {
  if (typeof v !== 'object' || v === null) return false;
  const c = v as Record<string, unknown>;
  return isValidLevels(c.levels) && (c.mode === 'guided' || c.mode === 'expert') && (c.lang === 'en' || c.lang === 'id');
}
