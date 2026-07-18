import { describe, it, expect } from 'vitest';
import { answerText, localAdvisorAdapter } from './localAdvisorAdapter';
import { buildChatContext, isValidContext, isValidLevels } from './context';
import { DEFAULT_LEVELS } from '../../config/defaults';
import { FACTOR_ORDER } from '../../config/factors';
import type { ChatContext } from './types';
import type { Levels } from '../../types';

// A COMPLETE, valid 14-factor object (DEFAULT_LEVELS is a partial the engine fills with 0).
const fullLevels = (): Levels => Object.fromEntries(FACTOR_ORDER.map((f, i) => [f, (i % 3) as 0 | 1 | 2])) as Levels;

const ctx = (over: Partial<ChatContext> = {}): ChatContext => ({
  levels: { ...DEFAULT_LEVELS },
  overrides: {},
  mode: 'guided',
  lang: 'en',
  ...over,
});

// The chatbot is grounded in the frozen engine + config (never fabricates) and is bilingual. These
// tests are the anti-fabrication / Zero-Mismatch guard for the local ChatService adapter.
describe('local advisor adapter — grounded, deterministic, bilingual', () => {
  it('recommend intent lists a real top pick per dimension (EN)', () => {
    const a = answerText('what do you recommend?', ctx());
    expect(a).toMatch(/Recommendation for your current scenario/i);
    expect(a).toMatch(/\d+\/100/); // real engine scores
  });

  it('recommend intent works in Indonesian', () => {
    const a = answerText('apa rekomendasinya?', ctx({ lang: 'id' }));
    expect(a).toMatch(/Rekomendasi untuk skenario Anda/i);
  });

  it('explains a named architecture from the model content', () => {
    const a = answerText('what is microservices?', ctx());
    expect(a).toMatch(/Microservices/);
    expect(a).toMatch(/ranks #\d/i); // scenario-aware placement
  });

  it('compares two named options by their strongest attributes', () => {
    const a = answerText('monolith vs microservices', ctx());
    expect(a).toMatch(/Monolith/);
    expect(a).toMatch(/Microservices/);
    expect(a).toMatch(/strongest on/i);
  });

  it('answers "why" from real contribution weights', () => {
    const a = answerText('why?', ctx());
    expect(a).toMatch(/Why .+\?/);
    expect(a).toMatch(/fit \d/);
  });

  it('falls back to capabilities on gibberish (never fabricates)', () => {
    const a = answerText('asdfqwer zzz', ctx());
    expect(a).toMatch(/didn.t quite catch|AI Advisor/i);
  });

  it('is deterministic', () => {
    expect(answerText('recommend', ctx())).toBe(answerText('recommend', ctx()));
  });

  it('adapter streams the full answer and is offline (network:false)', async () => {
    expect(localAdvisorAdapter.network).toBe(false);
    const history = [{ id: '1', role: 'user' as const, text: 'recommend', ts: 0 }];
    let out = '';
    for await (const c of localAdvisorAdapter.reply(history, ctx(), new AbortController().signal)) out += c.delta;
    expect(out).toBe(answerText('recommend', ctx()));
  });

  it('adapter stops promptly when aborted (no API spam / runaway stream)', async () => {
    const ac = new AbortController();
    const history = [{ id: '1', role: 'user' as const, text: 'recommend', ts: 0 }];
    ac.abort();
    const it = localAdvisorAdapter.reply(history, ctx(), ac.signal)[Symbol.asyncIterator]();
    await expect(it.next()).rejects.toThrow(); // first chunk rejects immediately — no output
  });
});

describe('context handoff — deep clone, validation, intelligent fallback', () => {
  it('deep-clones valid levels so the chat can never mutate app state', () => {
    const appLevels = fullLevels();
    const before = appLevels.team ?? 0;
    const c = buildChatContext({ levels: appLevels, overrides: {}, mode: 'guided', lang: 'en' });
    expect(c.levels).not.toBe(appLevels); // a distinct clone
    c.levels.team = ((before + 1) % 3) as 0 | 1 | 2; // mutate the chat copy
    expect(appLevels.team).toBe(before); // original untouched
  });

  it('invalid/partial levels fall back to the moderate baseline (no crash, no undefined)', () => {
    const c = buildChatContext({ levels: { team: 5 }, overrides: 'nope', mode: 'weird', lang: 'xx' });
    expect(isValidLevels(c.levels)).toBe(true);
    expect(c.mode).toBe('guided');
    expect(c.lang).toBe('en');
    expect(c.overrides).toEqual({});
  });

  it('sanitizes overrides — drops out-of-range / malformed entries', () => {
    const c = buildChatContext({ levels: DEFAULT_LEVELS, overrides: { scalability: 40, bad: 999, x: 'y' }, mode: 'expert', lang: 'id' });
    expect(c.overrides).toEqual({ scalability: 40 });
    expect(c.mode).toBe('expert');
  });

  it('isValidContext guards hydration from corrupt storage', () => {
    expect(isValidContext(buildChatContext({ levels: DEFAULT_LEVELS, overrides: {}, mode: 'guided', lang: 'en' }))).toBe(true);
    expect(isValidContext({ levels: { team: 9 }, mode: 'guided', lang: 'en' })).toBe(false);
    expect(isValidContext(null)).toBe(false);
  });
});
