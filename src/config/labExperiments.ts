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
}

export const LAB_EXPERIMENTS: LabExperiment[] = [
  {
    id: 'team-size-flip',
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
];
