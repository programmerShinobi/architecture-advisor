import { describe, it, expect } from 'vitest';
import { answerText, localAdvisorAdapter } from './localAdvisorAdapter';
import { buildChatContext, isValidContext, isValidLevels } from './context';
import { DEFAULT_LEVELS } from '../../config/defaults';
import { FACTOR_ORDER } from '../../config/factors';
import { rank } from '../scoring';
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
    expect(a).toMatch(/didn.t quite catch|Chat Advisor/i);
  });

  it('is deterministic', () => {
    expect(answerText('recommend', ctx())).toBe(answerText('recommend', ctx()));
  });

  // Broadened scenario coverage (Phase 3.4): every new aspect stays grounded in the frozen engine
  // or the real UI — never invented behavior — so it can never contradict the app.
  it('answers cost/ops questions from the real COST_OPS table', () => {
    const a = answerText('what is the operational cost of microservices?', ctx());
    expect(a).toMatch(/Cost & operations — Microservices/);
    expect(a).toMatch(/Operational overhead: (low|medium|high)/);
  });

  it('answers risk/anti-pattern questions from the real detector (never fabricates a warning)', () => {
    // Heavy legacy coupling + no migration plan, biasing the engine's own top D1 pick toward
    // serverless — a real, wired anti-pattern rule ("legacy-without-plan"), not an invented one.
    const risky = ctx({ levels: { ...DEFAULT_LEVELS, legacy: 2, scale: 2, ttm: 2, budget: 0, devops: 0 } });
    const a = answerText('any risks with this?', risky);
    expect(a).toMatch(/Warnings for your scenario/);
    expect(a).toMatch(/Strangler Fig|legacy/i);
  });

  it('reports "no anti-patterns" honestly when none are triggered', () => {
    const a = answerText('any risks with this?', ctx({ levels: { ...DEFAULT_LEVELS, team: 2, devops: 2 } }));
    expect(a).toMatch(/No anti-patterns detected/i);
  });

  it('answers sensitivity questions from the real sensitivity() flips', () => {
    const a = answerText('how sensitive is this pick?', ctx());
    expect(a).toMatch(/How close your pick is|stable/i);
  });

  it('answers migration-path questions from the real MIGRATION_PATHS config', () => {
    const a = answerText('how do I migrate my legacy system?', ctx());
    expect(a).toMatch(/Incremental migration path/);
    expect(a).toMatch(/^1\./m);
  });

  it('answers app-usage FAQ (privacy, mode, export, reset) without touching the engine', () => {
    expect(answerText('is my data private?', ctx())).toMatch(/100% in your browser/);
    expect(answerText('what is expert mode?', ctx())).toMatch(/Guided mode|Expert mode/);
    expect(answerText('how do I export my plan?', ctx())).toMatch(/Save & share/);
    expect(answerText('how do I reset?', ctx())).toMatch(/Reset.+button|restores the default/i);
  });

  it('new intents are bilingual (ID)', () => {
    expect(answerText('apakah ini privasi?', ctx({ lang: 'id' }))).toMatch(/berjalan di peramban/);
    expect(answerText('bagaimana cara migrasi sistem lama?', ctx({ lang: 'id' }))).toMatch(/Jalur migrasi bertahap/);
  });

  // Second coverage pass (owner: as many scenarios as possible, as complete and detailed as
  // possible) — still every answer reads only the frozen engine or real, existing config/UI.
  it('lists the FULL anti-pattern catalog on a generic ask, distinct from the scenario-specific one', () => {
    const a = answerText('list all anti-patterns', ctx());
    expect(a).toMatch(/Every anti-pattern this app watches for/);
    expect(a).toMatch(/premature-microservices|distributed monolith/i);
  });

  it('explains a DIMENSION (the axis itself) with every option ranked and scored', () => {
    const a = answerText('what is Deployment Granularity?', ctx());
    expect(a).toMatch(/Deployment Granularity/);
    expect(a).toMatch(/1\. \*\*.+\*\* \(\d+\/100\)/);
  });

  it('explains a FACTOR with its question, current answer, and all 3 levels', () => {
    const a = answerText('explain Budget / cost flexibility', ctx());
    expect(a).toMatch(/Budget \/ cost flexibility/);
    expect(a).toMatch(/Your current answer/);
    expect(a).toMatch(/0\..+\n1\..+\n2\./s);
  });

  it('summarizes all 14 current answers on request', () => {
    const a = answerText('what are my current answers?', ctx());
    expect(a).toMatch(/Your current answers \(14 factors\)/);
    expect(a.match(/^- /gm)?.length).toBe(14);
  });

  it('lists real runner-up alternatives (never the same as the top pick)', () => {
    const a = answerText("what's the runner-up?", ctx());
    const top = rank(ctx().levels, 'D1')[0].name;
    expect(a).toMatch(/Alternatives for/);
    expect(a).not.toContain(`**${top}** (`); // the #1 pick itself is never listed as an "alternative"
  });

  it('answers a quality-attribute glossary question (distinct from the architecture glossary)', () => {
    const a = answerText('what is scalability?', ctx());
    expect(a).toMatch(/Scalability/);
    expect(a).toMatch(/ISO\/IEC 25010/);
  });

  it('answers the broadened app-usage FAQ: shortcuts, theme, language, PWA, a11y, browsers, methodology, wizard', () => {
    expect(answerText('what are the keyboard shortcuts?', ctx())).toMatch(/command palette/i);
    expect(answerText('how do I switch to dark mode?', ctx())).toMatch(/light and dark themes/i);
    expect(answerText('how do I change language?', ctx())).toMatch(/EN \/ ID/);
    expect(answerText('can I install this app?', ctx())).toMatch(/PWA/);
    expect(answerText('is this app accessible?', ctx())).toMatch(/WCAG AA/);
    expect(answerText('which browsers are supported?', ctx())).toMatch(/Chrome, Edge, Firefox/);
    expect(answerText('how does scoring work?', ctx())).toMatch(/Score = Σ weight × fit/);
    expect(answerText('what is the custom wizard?', ctx())).toMatch(/Custom Wizard/);
    expect(answerText('how do I compare two scenarios?', ctx())).toMatch(/Pin A/);
  });

  // 5W1H completeness pass (owner: map coverage explicitly onto Who/What/When/Where/Why/How so no
  // question leaves a user confused). What/Why/How were already broad; these close the Who/When/
  // Where gaps and sharpen "why not X" — all still grounded, never invented.
  it('Who/When: explains who a NAMED option fits, grounded in its real qaFit strengths', () => {
    const a = answerText('who should use microservices?', ctx());
    expect(a).toMatch(/Microservices fits best when you prioritize/);
  });

  it('Who/When: surfaces a REAL anti-pattern caution when the forced pick would actually trigger one', () => {
    // Small team + low devops maturity is the real premature-microservices precondition.
    const a = answerText('when should I use microservices?', ctx({ levels: { ...DEFAULT_LEVELS, team: 0, devops: 0 } }));
    expect(a).toMatch(/But watch out/);
    expect(a).toMatch(/distributed monolith|premature/i);
  });

  it('Why not: explains a non-top pick AND names the real gap to the current winner', () => {
    const a = answerText('why not serverless?', ctx());
    const ranked = rank(ctx().levels, 'D1');
    const place = ranked.findIndex((r) => r.id === 'serverless') + 1;
    if (place > 1) {
      expect(a).toMatch(/points behind the current winner/);
    } else {
      expect(a).toMatch(/Serverless/);
    }
  });

  it('Who (app-level): answers "who is this for" without needing a named architecture', () => {
    const a = answerText('who is this app for?', ctx());
    expect(a).toMatch(/students to senior architects|Guided mode/);
  });

  it('Where: "where is my data" reaches the same grounded privacy answer as "is this private"', () => {
    expect(answerText('where is my data stored?', ctx())).toMatch(/100% in your browser/);
  });

  it('Where: points to the Insights tab for "where can I learn more"', () => {
    const a = answerText('where can I learn more about architectures?', ctx());
    expect(a).toMatch(/Insights/);
  });

  it('How: onboarding ("getting started") and honesty ("how accurate") FAQ', () => {
    expect(answerText('how do I get started?', ctx())).toMatch(/Pick a scenario card/);
    expect(answerText('how accurate is this?', ctx())).toMatch(/Decision support, not an oracle/);
  });

  it('5W1H additions are bilingual (ID)', () => {
    expect(answerText('siapa yang cocok pakai microservices?', ctx({ lang: 'id' }))).toMatch(/cocok saat Anda memprioritaskan/);
    expect(answerText('untuk siapa aplikasi ini?', ctx({ lang: 'id' }))).toMatch(/mahasiswa hingga arsitek senior/);
  });

  // Regression tests for real question/answer MISMATCHES the owner found by hand-testing — each one
  // is a case where a short, generic keyword shadowed a MORE SPECIFIC, conceptually different intent.
  describe('mismatch regressions — a generic keyword must never shadow a more specific intent', () => {
    it('"why not serverless?" answers about Serverless, not the generic privacy blurb ("server" ⊂ "serverless")', () => {
      const a = answerText('why not serverless?', ctx());
      expect(a).not.toMatch(/100% in your browser/);
      expect(a).toMatch(/Serverless/);
    });

    it('"aplikasi offline" (ID) reaches the PWA-install answer, not the generic privacy blurb', () => {
      const a = answerText('bisakah instal aplikasi offline?', ctx({ lang: 'id' }));
      expect(a).toMatch(/PWA/);
    });

    it('"daftar semua anti-pattern" (ID, "list all") reaches the full catalog, not the privacy blurb', () => {
      const a = answerText('daftar semua anti-pattern', ctx({ lang: 'id' }));
      expect(a).toMatch(/Semua anti-pattern yang dipantau/);
    });

    it('"what is Cost efficiency?" explains the QUALITY ATTRIBUTE, not the scenario\'s cost/ops numbers', () => {
      const a = answerText('what is Cost efficiency?', ctx());
      expect(a).toMatch(/ISO\/IEC 25010/);
      expect(a).not.toMatch(/Cost & operations —/);
    });

    it('"apa itu efisiensi biaya?" (ID) explains the quality attribute too', () => {
      const a = answerText('apa itu efisiensi biaya?', ctx({ lang: 'id' }));
      expect(a).toMatch(/ISO\/IEC 25010/);
    });

    it('"what is an anti-pattern?" explains the CONCEPT (glossary), not a scenario-specific check', () => {
      const a = answerText('what is an anti-pattern?', ctx());
      expect(a).not.toMatch(/Warnings for your scenario|No anti-patterns detected/);
      expect(a).toMatch(/Anti-pattern/);
    });

    it('"any risks with this combination?" still answers about THIS scenario, not the glossary concept', () => {
      const a = answerText('any risks with this combination?', ctx());
      expect(a).toMatch(/Warnings for your scenario|No anti-patterns detected/);
    });

    it('a real cost/ops question is unaffected by the QA-priority check ("what\'s the operational cost?")', () => {
      const a = answerText("what's the operational cost?", ctx());
      expect(a).toMatch(/Cost & operations —/);
    });
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
