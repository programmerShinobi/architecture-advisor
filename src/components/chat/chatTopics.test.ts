import { describe, it, expect } from 'vitest';
import { CHAT_TOPICS } from './chatTopics';
import { answerText } from '../../lib/chat';
import { DEFAULT_LEVELS } from '../../config/defaults';
import type { ChatContext } from '../../lib/chat';

/**
 * The capability catalogue must never promise something the adapter cannot answer.
 *
 * Every question offered in the topic browser is one tap away from being sent, so a suggestion that
 * lands on the fallback is worse than showing nothing: the app would be confidently advertising a
 * capability it does not have, which is the exact failure mode this product argues against. These
 * tests send every entry through the real adapter in BOTH languages, so the rule is enforced by the
 * machine instead of by whoever last edited the list.
 */

const FALLBACK_EN = "I didn't quite catch that.";
const FALLBACK_ID = 'Saya belum menangkap itu.';

const ctx = (lang: 'en' | 'id'): ChatContext => ({
  levels: { ...DEFAULT_LEVELS },
  overrides: {},
  mode: 'guided',
  lang,
});

describe('chat topic catalogue — every advertised question is actually answerable', () => {
  for (const topic of CHAT_TOPICS) {
    for (const ask of topic.asks) {
      it(`[en] "${ask.en}" (${topic.id}) is routed, not fallback`, () => {
        const a = answerText(ask.en, ctx('en'));
        expect(a).not.toContain(FALLBACK_EN);
        expect(a.trim().length).toBeGreaterThan(20);
      });

      it(`[id] "${ask.id}" (${topic.id}) is routed, not fallback`, () => {
        const a = answerText(ask.id, ctx('id'));
        expect(a).not.toContain(FALLBACK_ID);
        expect(a.trim().length).toBeGreaterThan(20);
      });
    }
  }

  it('topics and questions are structurally sound (ids unique, both languages filled)', () => {
    expect(new Set(CHAT_TOPICS.map((t) => t.id)).size).toBe(CHAT_TOPICS.length);
    for (const t of CHAT_TOPICS) {
      expect(t.asks.length).toBeGreaterThan(0);
      expect(t.label.en && t.label.id && t.hint.en && t.hint.id).toBeTruthy();
      for (const a of t.asks) expect(a.en.trim() && a.id.trim()).toBeTruthy();
    }
  });
});
