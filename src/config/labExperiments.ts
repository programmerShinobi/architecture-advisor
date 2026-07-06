import type { Levels } from '../types';

// The "Lab" Insights section: interactive sandboxes ON the real engine (English-first content).
// Each experiment is a hypothesis plus a prepared scenario (factor levels for the frozen model's
// 14 factors, values 0–2). "Run it" loads the levels into the Advisor — the same engine, the same
// scoring — so the reader tests the hypothesis against the live calculation, not a canned answer.
// Client-side only; a unit test asserts every factor id and level is valid for the model.

export interface LabExperiment {
  id: string;
  title: string;
  /** The setup: what situation the levels describe. */
  brief: string;
  /** The claim to test in the Advisor. */
  hypothesis: string;
  levels: Levels;
  /** What to look at after running it. */
  watch: string[];
  /** The reading of the result, grounded in the model. */
  takeaway: string;
  /**
   * The architectures this experiment puts in play (`"D<n>:<optionId>"` keys) — shown as
   * deep-link chips on the page. Across all experiments the union covers ALL 21 options
   * (holistic parity with the four lenses; unit-tested).
   */
  focus: string[];
}

export const LAB_EXPERIMENTS: LabExperiment[] = [
  {
    id: 'team-size-flip',
    focus: ['D1:layered', 'D1:monolith', 'D1:modular-monolith', 'D1:microservices', 'D1:serverless'],
    title: 'When does team size flip D1?',
    brief:
      'A proven product that is growing: several teams, moderate scale, decent DevOps — but nothing extreme.',
    hypothesis:
      'Deployment style (D1) is driven more by team/organisation factors than by raw traffic.',
    levels: { team: 2, distribution: 1, ttm: 1, budget: 1, lifespan: 2, scale: 1, dataVolume: 1, async: 1, realtime: 0, domain: 1, consistency: 1, security: 1, legacy: 0, devops: 2 },
    watch: [
      'The D1 ranking and the gap between modular monolith and microservices.',
      'Now lower Team size to Small (1–5) and watch the ranking reorder.',
      'The "why not the runner-up" explainer for which attributes moved.',
    ],
    takeaway:
      'Deployability and maintainability weights follow team size and distribution — Conway\'s Law, computed. Traffic alone rarely justifies distribution.',
  },
  {
    id: 'premature-split',
    focus: ['D1:monolith', 'D1:modular-monolith', 'D1:microservices'],
    title: 'Trigger the premature-microservices warning',
    brief:
      'A small co-located team with immature DevOps — but imagine they pick microservices anyway.',
    hypothesis:
      'The anti-pattern engine warns when the chosen style needs operational maturity the factors do not support.',
    levels: { team: 0, distribution: 0, ttm: 2, budget: 0, lifespan: 1, scale: 0, dataVolume: 0, async: 0, realtime: 0, domain: 0, consistency: 1, security: 0, legacy: 0, devops: 0 },
    watch: [
      'The D1 recommendation (it should favour a monolith/modular monolith).',
      'In Expert mode, override the D1 selection to Microservices.',
      'The anti-pattern warning that appears — read its reasoning.',
    ],
    takeaway:
      'The warning is the literature\'s checklist (team, boundaries, DevOps) encoded as a guard — the same signals as the "avoiding premature microservices" review.',
  },
  {
    id: 'realtime-streaming',
    focus: ['D2:synchronous', 'D2:async-messaging', 'D2:event-driven', 'D2:streaming'],
    title: 'Push D2 towards streaming',
    brief:
      'An IoT-flavoured system: high data volume, heavily async, near-real-time processing.',
    hypothesis:
      'Real-time + async + data volume move D2 from request–response towards events and streaming.',
    levels: { team: 1, distribution: 1, ttm: 1, budget: 1, lifespan: 2, scale: 2, dataVolume: 2, async: 2, realtime: 2, domain: 1, consistency: 0, security: 1, legacy: 0, devops: 2 },
    watch: [
      'The D2 ranking — where do event-driven and streaming land?',
      'Drop Real-time back to its lowest level and compare (pin A/B to see it side by side).',
      'The trade-off radar for what streaming costs in simplicity.',
    ],
    takeaway:
      'Streaming wins continuous flows, not request/reply — the factors encode exactly that boundary, and the A/B compare makes the flip visible.',
  },
  {
    id: 'consistency-anchor',
    focus: ['D3:single-db', 'D3:db-per-service', 'D3:cqrs', 'D3:event-sourcing', 'D3:polyglot'],
    title: 'Consistency as the data anchor',
    brief:
      'A regulated, correctness-critical system: strong consistency demands, high security, long lifespan.',
    hypothesis:
      'Strong consistency requirements anchor D3 on a single database even when other factors say "distribute".',
    levels: { team: 2, distribution: 2, ttm: 0, budget: 2, lifespan: 2, scale: 1, dataVolume: 1, async: 0, realtime: 0, domain: 2, consistency: 2, security: 2, legacy: 1, devops: 1 },
    watch: [
      'The D3 ranking — single shared DB vs database-per-service.',
      'Now relax Consistency to its lowest level and watch D3 reorder.',
      'The data-consistency anti-pattern warnings if you force a mismatch.',
    ],
    takeaway:
      'Losing the single transaction is the real price of splitting data — when the business cannot tolerate eventual consistency, the model keeps data together.',
  },
  {
    id: 'legacy-strangler',
    focus: ['D1:monolith', 'D1:modular-monolith', 'D1:microservices'],
    title: 'Legacy weight and the migration path',
    brief:
      'A heavy legacy estate with a plan to modernise: big system, old constraints, decent team.',
    hypothesis:
      'High legacy coupling makes the Advisor recommend an incremental (Strangler Fig) path, not a leap.',
    levels: { team: 2, distribution: 1, ttm: 1, budget: 1, lifespan: 2, scale: 1, dataVolume: 1, async: 1, realtime: 0, domain: 2, consistency: 1, security: 1, legacy: 2, devops: 1 },
    watch: [
      'The migration-path card under the recommendation.',
      'The "legacy without a plan" warning and what silences it.',
      'How D1 balances modular monolith vs microservices under legacy weight.',
    ],
    takeaway:
      'The map\'s rungs apply: enforce boundaries first, extract along bounded contexts, keep every step reversible — the engine encodes the same incremental bias as the Strangler Fig literature.',
  },
  {
    id: 'ceremony-vs-speed',
    focus: ['D4:layered', 'D4:hexagonal', 'D4:clean', 'D4:vertical-slice'],
    title: 'Code structure: ceremony vs speed (D4)',
    brief:
      'A long-lived product with a complex domain and a stable team — the opposite of a throwaway prototype.',
    hypothesis:
      'Domain complexity and lifespan push D4 towards the framework-free cores (Hexagonal/Clean); a short-lived simple app flips it back to Layered/Vertical Slice.',
    levels: { team: 1, distribution: 0, ttm: 0, budget: 1, lifespan: 2, scale: 1, dataVolume: 1, async: 0, realtime: 0, domain: 2, consistency: 1, security: 1, legacy: 0, devops: 1 },
    watch: [
      'The D4 ranking — where do Hexagonal and Clean sit versus Layered?',
      'Now set Lifespan to its lowest and Time-to-market to its highest, and compare (pin A/B).',
      'The contribution bars: which quality attributes carry the D4 decision.',
    ],
    takeaway:
      'The ceremony of a protected core is an investment priced by lifespan and domain complexity — exactly the "don\'t impose Clean on a small app" guidance, computed.',
  },
  {
    id: 'frontend-autonomy',
    focus: ['D5:spa', 'D5:ssr', 'D5:micro-frontends'],
    title: 'When do micro-frontends earn their cost? (D5)',
    brief:
      'A large, distributed organisation with many UI teams on one product — high scale, mature DevOps.',
    hypothesis:
      'Micro-frontends only rise in D5 when team size and distribution are high; below that, SPA/SSR win on simplicity.',
    levels: { team: 2, distribution: 2, ttm: 1, budget: 2, lifespan: 2, scale: 2, dataVolume: 1, async: 1, realtime: 1, domain: 1, consistency: 1, security: 1, legacy: 0, devops: 2 },
    watch: [
      'The D5 ranking — how close do micro-frontends get to the top?',
      'Now set Team size and Team distribution to their lowest levels and compare (pin A/B).',
      'The trade-off radar: what micro-frontends pay in simplicity and first-paint.',
    ],
    takeaway:
      'Team autonomy is an organisational benefit — Conway\'s Law again: the org chart, not the framework, decides when micro-frontends are worth their integration cost.',
  },
];
