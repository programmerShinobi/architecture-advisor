import type { DimensionId } from '../types';

// The "Roadmap" Insights section: guided learning paths (English-first content, like the other
// lens datasets). Every step points at something that already exists — an architecture page
// (dim + optionId + lens), a Markdown article (slug), or the Advisor itself — so the Roadmap can
// never drift from the model or the content index (a unit test resolves every target).

export type LensId = 'catalog' | 'playbook' | 'review' | 'library';

export type RoadmapStep =
  | { kind: 'arch'; dim: DimensionId; optionId: string; lens: LensId; note: string }
  | { kind: 'article'; slug: string; note: string }
  | { kind: 'advisor'; note: string };

export interface LearningPath {
  id: string;
  title: string;
  audience: 'newcomer' | 'practitioner' | 'architect';
  description: string;
  outcome: string;
  steps: RoadmapStep[];
}

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'architecture-fundamentals',
    title: 'Architecture fundamentals',
    audience: 'newcomer',
    description:
      'Start from zero: what an architecture decision is, the simplest styles, and how to make your first informed choice.',
    outcome: 'You can explain the basic deployment styles and run the Advisor for a small project.',
    steps: [
      { kind: 'arch', dim: 'D1', optionId: 'layered', lens: 'catalog', note: 'Meet the classic starting point — layers, and why they erode.' },
      { kind: 'arch', dim: 'D1', optionId: 'monolith', lens: 'catalog', note: 'One deployable, one database — why "boring" is often right.' },
      { kind: 'arch', dim: 'D1', optionId: 'modular-monolith', lens: 'catalog', note: 'Module boundaries without distribution — the pragmatic middle.' },
      { kind: 'article', slug: 'monolith-microservices-decision-map', note: 'The whole D1 decision on one screen.' },
      { kind: 'article', slug: 'writing-good-adrs', note: 'Record your decision so future-you knows why.' },
      { kind: 'advisor', note: 'Run the Advisor with your own project factors and read the reasoning.' },
    ],
  },
  {
    id: 'monolith-to-microservices',
    title: 'From monolith to microservices — safely',
    audience: 'practitioner',
    description:
      'The migration journey: prove the boundaries first, extract only what needs independence, and avoid the classic failure modes.',
    outcome: 'You can plan an incremental extraction and spot a distributed monolith before it ships.',
    steps: [
      { kind: 'article', slug: 'when-to-use-microservices', note: 'Check the prerequisites before you commit.' },
      { kind: 'arch', dim: 'D1', optionId: 'modular-monolith', lens: 'playbook', note: 'Enforce module boundaries inside one process first.' },
      { kind: 'article', slug: 'strangler-fig-migration', note: 'Extract one capability at a time — never big-bang.' },
      { kind: 'arch', dim: 'D1', optionId: 'microservices', lens: 'review', note: 'The honest evaluation: what you gain and what it costs.' },
      { kind: 'article', slug: 'detecting-distributed-monolith', note: 'The warning signs that the split went wrong.' },
      { kind: 'article', slug: 'avoiding-premature-microservices', note: 'A checklist to keep you honest.' },
      { kind: 'advisor', note: 'Model your current system and compare D1 recommendations.' },
    ],
  },
  {
    id: 'communication-styles',
    title: 'Going event-driven — sync, async, events, streams',
    audience: 'practitioner',
    description:
      'The whole D2 spectrum: when request–response is right, when messaging and events loosen the coupling, and when a durable stream is the backbone.',
    outcome: 'You can choose a communication style deliberately, with its failure modes priced in.',
    steps: [
      { kind: 'article', slug: 'choosing-communication-style', note: 'Sync vs async vs events — the core question.' },
      { kind: 'arch', dim: 'D2', optionId: 'synchronous', lens: 'catalog', note: 'The baseline: request–response, and where its coupling strains.' },
      { kind: 'arch', dim: 'D2', optionId: 'event-driven', lens: 'catalog', note: 'What event-driven really buys you.' },
      { kind: 'arch', dim: 'D2', optionId: 'async-messaging', lens: 'playbook', note: 'Adopt messaging step by step (idempotency, DLQs, ordering).' },
      { kind: 'arch', dim: 'D2', optionId: 'streaming', lens: 'review', note: 'The durable, replayable log — evaluated honestly.' },
      { kind: 'advisor', note: 'Raise the async and real-time factors and watch D2 reorder.' },
    ],
  },
  {
    id: 'data-ownership',
    title: 'Data ownership, from one database to polyglot',
    audience: 'practitioner',
    description:
      'The hardest decision to reverse: who owns the data, how it stays consistent, and the patterns (sagas, outbox, CQRS, event sourcing) that keep a split correct.',
    outcome: 'You can decide when to split data — and keep a cross-service flow correct when you do.',
    steps: [
      { kind: 'article', slug: 'choosing-data-management', note: 'The D3 decision: from one DB to polyglot.' },
      { kind: 'arch', dim: 'D3', optionId: 'single-db', lens: 'catalog', note: 'Start here — and why staying is often right.' },
      { kind: 'arch', dim: 'D3', optionId: 'db-per-service', lens: 'playbook', note: 'Split ownership properly: sagas, the outbox, contracts.' },
      { kind: 'arch', dim: 'D3', optionId: 'cqrs', lens: 'review', note: 'Separate read/write models — evaluated, including the over-use trap.' },
      { kind: 'arch', dim: 'D3', optionId: 'event-sourcing', lens: 'review', note: 'The audit-trail heavyweight — evaluated honestly.' },
      { kind: 'arch', dim: 'D3', optionId: 'polyglot', lens: 'library', note: 'The right store per job — concepts and terminology.' },
      { kind: 'article', slug: 'data-consistency-review', note: 'Sagas, the outbox, and eventual consistency — the review checklist.' },
      { kind: 'advisor', note: 'Raise the consistency and data-volume factors and watch D3 shift.' },
    ],
  },
  {
    id: 'clean-code-structure',
    title: 'Code structure that survives change',
    audience: 'practitioner',
    description:
      'Independent of how you deploy, the inside of the codebase decides the cost of change. Learn the structures that keep the core testable.',
    outcome: 'You can pick between Hexagonal, Clean, Vertical Slice, and Layered for a given codebase.',
    steps: [
      { kind: 'article', slug: 'choosing-code-structure', note: 'The D4 decision in one guide.' },
      { kind: 'arch', dim: 'D4', optionId: 'layered', lens: 'review', note: 'The familiar baseline — honestly evaluated, erosion included.' },
      { kind: 'arch', dim: 'D4', optionId: 'hexagonal', lens: 'catalog', note: 'Ports & adapters — the core idea.' },
      { kind: 'arch', dim: 'D4', optionId: 'clean', lens: 'playbook', note: 'Adopt the dependency rule without the ceremony trap.' },
      { kind: 'arch', dim: 'D4', optionId: 'vertical-slice', lens: 'review', note: 'The feature-first alternative, evaluated.' },
      { kind: 'article', slug: 'genai-and-architecture', note: 'Why clear boundaries matter more in the AI-assisted era.' },
      { kind: 'article', slug: 'architectural-technical-debt', note: 'Manage the structural compromises you do take on.' },
    ],
  },
  {
    id: 'frontend-at-scale',
    title: 'Frontend architecture, from SPA to micro-frontends',
    audience: 'practitioner',
    description:
      'First paint, SEO, interactivity, team autonomy — the D5 trade-off, plus the organisational law behind it.',
    outcome: 'You can match a rendering strategy to a product and know when micro-frontends earn their cost.',
    steps: [
      { kind: 'article', slug: 'choosing-frontend-architecture', note: 'SPA vs SSR/SSG vs micro-frontends — the map.' },
      { kind: 'arch', dim: 'D5', optionId: 'spa', lens: 'catalog', note: 'The rich-client default and its blind spots.' },
      { kind: 'arch', dim: 'D5', optionId: 'ssr', lens: 'review', note: 'Server rendering, evaluated: first paint and SEO.' },
      { kind: 'arch', dim: 'D5', optionId: 'micro-frontends', lens: 'playbook', note: 'Adopt team-owned UI pieces without a consistency mess.' },
      { kind: 'article', slug: 'conways-law-team-topologies', note: "Conway's Law: why the org chart shows up in the UI." },
      { kind: 'advisor', note: 'Vary team size and watch when micro-frontends start to win D5.' },
    ],
  },
  {
    id: 'reviewing-architecture',
    title: 'Reviewing an architecture like an architect',
    audience: 'architect',
    description:
      'Structured evaluation: quality attributes, scenario-driven review, and automated guards that keep the decisions honest over time.',
    outcome: 'You can run an ATAM-style review and turn its findings into CI-enforced fitness functions.',
    steps: [
      { kind: 'article', slug: 'atam-review-checklist', note: 'The scenario-driven review method, step by step.' },
      { kind: 'arch', dim: 'D1', optionId: 'serverless', lens: 'review', note: 'Practice on a style with sharp trade-offs.' },
      { kind: 'article', slug: 'serverless-readiness-checklist', note: 'A readiness checklist you can reuse in reviews.' },
      { kind: 'article', slug: 'fitness-functions-guarding', note: 'Turn review findings into failing tests.' },
      { kind: 'article', slug: 'green-software-architecture', note: 'Add the sustainability lens — utilization as a review criterion.' },
      { kind: 'advisor', note: "Use the Advisor's radar and sensitivity cards as review input." },
    ],
  },
];
