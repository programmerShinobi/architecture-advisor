import type { DimensionId } from '../types';

// The "Academy" Insights section: course modules with self-check quizzes (English-first content).
// Every question is grounded in the model and the existing Insights content — each carries a
// `review` pointer to the page that teaches the answer, so a wrong answer becomes a reading step.
// Client-side only: answers are scored locally, nothing is sent anywhere.

export type QuizRef =
  | { kind: 'arch'; dim: DimensionId; optionId: string; lens: 'catalog' | 'playbook' | 'review' | 'library' }
  | { kind: 'article'; slug: string };

export interface QuizQuestion {
  q: string;
  choices: string[];
  /** Index into `choices`. */
  answer: number;
  explain: string;
  review: QuizRef;
}

export interface QuizModule {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export const ACADEMY_QUIZZES: QuizModule[] = [
  {
    id: 'd1-deployment',
    title: 'D1 · Deployment & composition',
    description: 'Monolith, modular monolith, microservices, serverless — when each one earns its keep.',
    questions: [
      {
        q: 'For a new product with a small team and an unproven domain, the evidence-backed default is…',
        choices: ['Microservices from day one', 'A monolith (or modular monolith)', 'Serverless for everything', 'One service per developer'],
        answer: 1,
        explain: 'Fowler\'s "MonolithFirst" and Newman both advise proving the product and its boundaries before paying distribution\'s permanent costs.',
        review: { kind: 'article', slug: 'when-to-use-microservices' },
      },
      {
        q: 'What primarily separates a modular monolith from a plain monolith?',
        choices: ['It runs in multiple processes', 'CI-enforced module boundaries inside one deployable', 'It requires Kubernetes', 'Each module has its own database'],
        answer: 1,
        explain: 'A modular monolith stays one process and one deploy, but module boundaries (per bounded context) are explicit and enforced — the cheap stepping stone to extraction.',
        review: { kind: 'arch', dim: 'D1', optionId: 'modular-monolith', lens: 'catalog' },
      },
      {
        q: 'The Strangler Fig pattern says to…',
        choices: ['Rewrite the system in one release', 'Freeze the monolith and build v2 beside it', 'Extract one capability at a time behind a facade, always able to roll back', 'Split every layer into its own service'],
        answer: 2,
        explain: 'Traffic is routed through a facade and capabilities move one by one — value ships early and each step is reversible, unlike a big-bang rewrite.',
        review: { kind: 'article', slug: 'strangler-fig-migration' },
      },
      {
        q: 'Which workload profile fits serverless (FaaS) best?',
        choices: ['Steady, latency-critical, stateful', 'Spiky and event-driven, tolerant of cold starts', 'Long-running batch jobs with huge in-memory state', 'Anything with a database'],
        answer: 1,
        explain: 'Scale-to-zero pays off for bursty, event-driven work; cold starts, execution limits, and statelessness make it a poor fit for latency-critical stateful cores.',
        review: { kind: 'article', slug: 'serverless-readiness-checklist' },
      },
      {
        q: 'A "distributed monolith" is a system where…',
        choices: ['One team owns all services', 'Services are split but still must deploy together (often via a shared database)', 'The monolith runs on many servers', 'Events replace all HTTP calls'],
        answer: 1,
        explain: 'You pay all the costs of distribution (network, ops, eventual consistency) with none of the independence — the top microservice anti-pattern in the literature.',
        review: { kind: 'article', slug: 'detecting-distributed-monolith' },
      },
    ],
  },
  {
    id: 'd2-communication',
    title: 'D2 · Communication style',
    description: 'Request–response, messaging, events, streaming — coupling, resilience, and consistency.',
    questions: [
      {
        q: 'The core question when choosing between sync and async communication is…',
        choices: ['Which protocol is fastest', 'Whether the caller must wait for an answer right now', 'Whether you use JSON or protobuf', 'How many services you have'],
        answer: 1,
        explain: 'If the caller needs the answer to continue, request–response fits; if notifying is enough, async styles buy resilience and decoupling.',
        review: { kind: 'article', slug: 'choosing-communication-style' },
      },
      {
        q: 'Synchronous call chains are risky at scale because…',
        choices: ['HTTP is deprecated', 'Latency and failures accumulate along the chain (temporal coupling)', 'They cannot cross data centers', 'They require an API gateway'],
        answer: 1,
        explain: 'Every hop adds latency and a failure mode; timeouts, idempotent retries, and circuit breakers are the standard mitigations.',
        review: { kind: 'arch', dim: 'D2', optionId: 'synchronous', lens: 'review' },
      },
      {
        q: 'Event-driven architecture shines when…',
        choices: ['Exactly one consumer needs a reply immediately', 'Many consumers react to the same fact and the system must be easy to extend', 'You need strong global transactions', 'The team is brand new to distributed systems'],
        answer: 1,
        explain: 'Publishing "this happened" decouples producers from an open-ended set of consumers — extensibility is the headline benefit.',
        review: { kind: 'arch', dim: 'D2', optionId: 'event-driven', lens: 'catalog' },
      },
      {
        q: 'Because message delivery is usually at-least-once, consumers must be…',
        choices: ['Stateless', 'Idempotent (safe to process the same message twice)', 'Synchronous', 'Single-threaded'],
        answer: 1,
        explain: 'Duplicates will happen; processing must converge to the same result — the foundational rule of messaging.',
        review: { kind: 'arch', dim: 'D2', optionId: 'async-messaging', lens: 'playbook' },
      },
      {
        q: 'Streaming (e.g. a log like Kafka) is the right D2 pick when…',
        choices: ['You need one nightly batch job', 'Data flows continuously and consumers replay or process it in near real time', 'Requests must block until processed', 'The payloads are tiny'],
        answer: 1,
        explain: 'A durable, replayable stream fits telemetry, analytics pipelines, and event backbones — continuous flows, not request/reply.',
        review: { kind: 'arch', dim: 'D2', optionId: 'streaming', lens: 'catalog' },
      },
    ],
  },
  {
    id: 'd3-data',
    title: 'D3 · Data management',
    description: 'The hardest decision to reverse: ownership, consistency, and the patterns that keep it correct.',
    questions: [
      {
        q: 'Why does the guidance say "split data only when you truly must"?',
        choices: ['Databases are expensive to license', 'Data ownership is the hardest architectural decision to reverse', 'SQL is faster than NoSQL', 'Backups become impossible'],
        answer: 1,
        explain: 'Frameworks are swappable; how data is owned and kept consistent is not — splitting trades free transactions for application-managed consistency.',
        review: { kind: 'article', slug: 'choosing-data-management' },
      },
      {
        q: 'Once each service owns its database, cross-service "transactions" are handled by…',
        choices: ['Two-phase commit everywhere', 'Sagas with compensating steps', 'Locking all databases', 'Retrying until it works'],
        answer: 1,
        explain: 'A saga coordinates local steps and undoes completed ones on failure — the standard replacement for distributed transactions.',
        review: { kind: 'article', slug: 'data-consistency-review' },
      },
      {
        q: 'The transactional outbox pattern exists so that…',
        choices: ['Events are prettier', '"Save data" and "publish the event" can never drift apart', 'Databases stay small', 'Consumers can skip idempotency'],
        answer: 1,
        explain: 'The event is written in the same local transaction as the data and relayed afterwards — no more "saved but never announced" bugs.',
        review: { kind: 'article', slug: 'data-consistency-review' },
      },
      {
        q: 'CQRS is best applied…',
        choices: ['To every service, always', 'Selectively, on slices where read and write models differ sharply', 'Only with event sourcing', 'When the team is bored'],
        answer: 1,
        explain: 'CQRS (and event sourcing) are commonly over-applied; the literature says use them on the parts whose load or shape truly demands it.',
        review: { kind: 'arch', dim: 'D3', optionId: 'cqrs', lens: 'review' },
      },
      {
        q: 'Event sourcing stores…',
        choices: ['The latest row per entity', 'The full history of changes as an append-only list of events', 'Snapshots only', 'CSV exports'],
        answer: 1,
        explain: 'State is derived by replaying events — a complete audit trail, at the cost of schema evolution and more complex reads.',
        review: { kind: 'arch', dim: 'D3', optionId: 'event-sourcing', lens: 'catalog' },
      },
    ],
  },
  {
    id: 'd4-structure',
    title: 'D4 · Code structure',
    description: 'Hexagonal, Clean, Vertical Slice, Layered — the inside of the codebase and the cost of change.',
    questions: [
      {
        q: 'What do Hexagonal and Clean Architecture fundamentally enforce?',
        choices: ['A specific folder layout', 'Business rules never depend on frameworks or IO', 'Microservices deployment', 'One controller per file'],
        answer: 1,
        explain: 'Ports & adapters and the dependency rule both fence the core from IO — that is what makes it unit-testable and durable.',
        review: { kind: 'article', slug: 'choosing-code-structure' },
      },
      {
        q: 'Vertical Slice architecture organises code by…',
        choices: ['Technical layer', 'Feature — one feature lives in one place', 'Team seniority', 'File size'],
        answer: 1,
        explain: 'It optimises for how software actually changes (per feature), the inverse of pure layering\'s change-amplification weakness.',
        review: { kind: 'arch', dim: 'D4', optionId: 'vertical-slice', lens: 'catalog' },
      },
      {
        q: 'The classic failure mode of a purely layered structure is…',
        choices: ['Too few files', 'One requirement change touching many layers (change amplification)', 'Not enough abstraction', 'Slow compilation'],
        answer: 1,
        explain: 'Technical layering spreads one feature across every layer, so small domain changes fan out — the most predictive signal of architectural debt.',
        review: { kind: 'article', slug: 'architectural-technical-debt' },
      },
      {
        q: 'When is Clean Architecture\'s ceremony NOT worth it?',
        choices: ['In long-lived complex domains', 'In small applications where the cost exceeds the benefit', 'When there are many integrations', 'When tests matter'],
        answer: 1,
        explain: 'The guidance is explicit: don\'t impose the full ceremony on a small app — pick the lightest structure that keeps the core testable.',
        review: { kind: 'arch', dim: 'D4', optionId: 'clean', lens: 'review' },
      },
      {
        q: 'Why does clear internal structure matter MORE with AI-assisted coding?',
        choices: ['AI writes less code', 'Code is cheaper to write and costlier to understand — boundaries and tests become the safety brakes', 'AI refuses layered code', 'It doesn\'t'],
        answer: 1,
        explain: 'Erosion happens faster when large "looks right" changes are cheap; enforced boundaries and fitness functions limit the blast radius.',
        review: { kind: 'article', slug: 'genai-and-architecture' },
      },
    ],
  },
  {
    id: 'd5-frontend',
    title: 'D5 · Frontend architecture',
    description: 'SPA, SSR/SSG, micro-frontends — first paint, SEO, interactivity, and team autonomy.',
    questions: [
      {
        q: 'The D5 decision fundamentally trades…',
        choices: ['CSS vs JavaScript', 'First paint & SEO versus interactivity & team autonomy', 'React vs Vue', 'Mobile vs desktop'],
        answer: 1,
        explain: 'SSR/SSG win time-to-content and SEO; SPAs win rich interactivity; micro-frontends buy team autonomy at an integration cost.',
        review: { kind: 'article', slug: 'choosing-frontend-architecture' },
      },
      {
        q: 'A content/marketing site where SEO and time-to-content dominate should default to…',
        choices: ['A SPA', 'SSR/SSG (prefer static or incremental rendering)', 'Micro-frontends', 'An iframe'],
        answer: 1,
        explain: 'Rendering on the server or at build time wins first-contentful-paint and crawlability — the Core Web Vitals logic.',
        review: { kind: 'arch', dim: 'D5', optionId: 'ssr', lens: 'catalog' },
      },
      {
        q: 'Micro-frontends earn their cost when…',
        choices: ['Any app has two pages', 'A large organisation has many UI teams on one product needing independent deploys', 'You want a smaller bundle', 'SEO is critical'],
        answer: 1,
        explain: 'Below a certain organisation size the integration and consistency overhead dominates — the benefit is team autonomy, not technology.',
        review: { kind: 'arch', dim: 'D5', optionId: 'micro-frontends', lens: 'review' },
      },
      {
        q: 'The standard mitigations for a SPA\'s first-load weakness are…',
        choices: ['Bigger servers', 'Code-splitting and prefetching', 'Removing images', 'HTTP/1.0'],
        answer: 1,
        explain: 'Splitting the bundle and prefetching likely routes soften the first paint while keeping the rich-client interactivity.',
        review: { kind: 'arch', dim: 'D5', optionId: 'spa', lens: 'playbook' },
      },
      {
        q: 'Conway\'s Law predicts that your UI architecture will mirror…',
        choices: ['The latest framework', 'The communication structure of the teams that build it', 'The database schema', 'The cloud provider'],
        answer: 1,
        explain: 'Micro-frontends without genuinely separate UI teams re-create the coupling they were meant to remove — design teams and boundaries together.',
        review: { kind: 'article', slug: 'conways-law-team-topologies' },
      },
    ],
  },
  {
    id: 'methods-practice',
    title: 'Methods · Reviews, ADRs & guardrails',
    description: 'ATAM, decision records, fitness functions, sustainability — the practice around the decisions.',
    questions: [
      {
        q: 'ATAM\'s output is…',
        choices: ['A pass/fail grade', 'A shared understanding of risks, sensitivity points, and trade-offs', 'A vendor recommendation', 'A performance benchmark'],
        answer: 1,
        explain: 'ATAM asks how well the architecture satisfies the prioritised quality attributes and what is sacrificed — it surfaces risks, not scores.',
        review: { kind: 'article', slug: 'atam-review-checklist' },
      },
      {
        q: 'When an architectural decision changes, the recorded ADR should be…',
        choices: ['Edited in place', 'Deleted', 'Superseded by a new ADR (records are immutable)', 'Moved to a wiki'],
        answer: 2,
        explain: 'ADRs are immutable: a new record supersedes the old one, preserving the trail of reasoning.',
        review: { kind: 'article', slug: 'writing-good-adrs' },
      },
      {
        q: 'A fitness function is…',
        choices: ['A gym plan for on-call engineers', 'An automated, CI-run check that fails when an architectural property is violated', 'A manual review meeting', 'A performance test only'],
        answer: 1,
        explain: 'Just as unit tests protect behaviour, fitness functions protect architectural properties — dependency rules, budgets, boundaries.',
        review: { kind: 'article', slug: 'fitness-functions-guarding' },
      },
      {
        q: 'Deliberate, prudent technical debt should be…',
        choices: ['Hidden from the backlog', 'Recorded (e.g. in an ADR) with its interest and a repayment trigger', 'Fixed immediately, always', 'Blamed on the last team'],
        answer: 1,
        explain: 'The goal is not zero debt but visible, managed debt — like a planned loan instead of a surprise bill.',
        review: { kind: 'article', slug: 'architectural-technical-debt' },
      },
      {
        q: 'For carbon-efficient ("green") architecture, the biggest proven lever is…',
        choices: ['Dark mode', 'Utilization — right-sizing, scale-to-zero when idle, cleaner regions/hours', 'Shorter variable names', 'More microservices'],
        answer: 1,
        explain: 'Many services at 5% utilization waste more than one at 60%; the SCI standard (ISO/IEC 21031) makes the target measurable.',
        review: { kind: 'article', slug: 'green-software-architecture' },
      },
    ],
  },
];
