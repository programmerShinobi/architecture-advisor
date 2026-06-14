import { ANTI_PATTERNS, type AntiPatternContext, type AntiPatternRule } from '../config/antiPatterns';

// Evaluate all rules against the current factors + chosen combination; return the active ones.
// Pure and deterministic, in canonical rule order (danger rules are authored first).
export function detectAntiPatterns(ctx: AntiPatternContext): AntiPatternRule[] {
  return ANTI_PATTERNS.filter((rule) => rule.test(ctx));
}
