// Library lens — evergreen reference material for EVERY architecture the Advisor evaluates
// (all 21 D1–D5 options), keyed `${dim}:${optionId}`. English by decision (content layer is
// English; UI chrome stays bilingual — see DECISIONS.md). Each entry is a knowledge-base card:
// a formal definition, the underlying concepts, related patterns, and the terminology a reader
// should know — complementing (not repeating) the Catalog's plain-language explanation. The
// standards/literature links reuse the option's READER_CITATIONS. Parity is test-enforced.

export interface ArchLibraryRef {
  /** A precise, quotable definition. */
  definition: string;
  /** The underlying concepts/principles that make it work. */
  concepts: string[];
  /** Related/constituent patterns worth knowing by name. */
  patterns: string[];
  /** Terminology: term → short definition. */
  terms: { term: string; def: string }[];
}

export const INSIGHT_LIBRARY: Record<string, ArchLibraryRef> = {
  // ───────────────────────── D1 · Deployment granularity ─────────────────────────
  'D1:layered': {
    definition:
      'An architectural style that partitions a single deployable into horizontal layers of technical responsibility, where each layer may depend only on the layer(s) beneath it.',
    concepts: [
      'Separation of concerns by technical role (presentation, domain, persistence).',
      'Unidirectional dependency flow (closed vs open/relaxed layering).',
      'Abstraction of lower layers behind interfaces.',
    ],
    patterns: ['Presentation–Domain–Data separation', 'Repository', 'Service Layer', 'DTO / Mapper'],
    terms: [
      { term: 'Closed layering', def: 'Each layer may call only the layer directly below it.' },
      { term: 'Layer bridging', def: 'Skipping a layer (allowed only in relaxed/open layering).' },
      { term: 'Change amplification', def: 'One feature change forcing edits across many layers — the style’s known weakness.' },
    ],
  },
  'D1:monolith': {
    definition:
      'A deployment style in which the entire application is built, released, and run as a single deployable unit sharing one process space and, typically, one database.',
    concepts: [
      'Single build/release/runtime unit; in-process communication.',
      'Strong (ACID) consistency via one transactional store.',
      'Deployment coupling: all capabilities ship together.',
    ],
    patterns: ['Monolith First', 'Blue‑green / rolling deployment', 'Feature flags', 'Vertical + horizontal (replica) scaling'],
    terms: [
      { term: 'Deployment coupling', def: 'All parts must be released together as one unit.' },
      { term: 'Blast radius', def: 'The scope of impact when a deploy or fault goes wrong — here, the whole app.' },
      { term: 'Big ball of mud', def: 'A monolith without internal structure; the failure mode, not the definition.' },
    ],
  },
  'D1:modular-monolith': {
    definition:
      'A monolith whose internal code is partitioned into modules with explicitly enforced boundaries — typically aligned to bounded contexts — while remaining one deployable.',
    concepts: [
      'Logical (module) boundaries decoupled from physical (deploy) boundaries.',
      'Bounded contexts as the module cut lines (DDD).',
      'Enforcement via tooling: architecture tests / dependency rules in CI.',
    ],
    patterns: ['Bounded Context', 'Published (module) API', 'In-process domain events', 'Strangler Fig (as the exit path)'],
    terms: [
      { term: 'Module boundary', def: 'A compile-time contract: only the module’s public API may be imported.' },
      { term: 'Context map', def: 'A DDD artifact describing how bounded contexts relate and integrate.' },
      { term: 'Fitness function', def: 'An automated check (e.g., dependency test) guarding an architectural property.' },
    ],
  },
  'D1:microservices': {
    definition:
      'An architectural style structuring an application as a suite of small, independently deployable services, each running in its own process, owning its data, and communicating over a network.',
    concepts: [
      'Independent deployability as the defining property (Newman).',
      'Decentralized data: database-per-service; smart endpoints, dumb pipes.',
      'Organizational alignment: services ↔ teams (Conway’s Law).',
    ],
    patterns: ['API Gateway', 'Service Registry/Discovery', 'Circuit Breaker', 'Saga', 'Transactional Outbox', 'Strangler Fig', 'Sidecar'],
    terms: [
      { term: 'Bounded context', def: 'The DDD boundary a well-cut service typically maps to.' },
      { term: 'Distributed monolith', def: 'Services that must deploy together — distribution’s cost without its benefits.' },
      { term: 'Eventual consistency', def: 'Cross-service state converges over time instead of within one transaction.' },
      { term: 'Service mesh', def: 'Infrastructure layer (proxies) handling service-to-service traffic concerns.' },
    ],
  },
  'D1:serverless': {
    definition:
      'A cloud execution model (Functions-as-a-Service) where code runs in ephemeral, provider-managed units that scale automatically — including to zero — and are billed per use.',
    concepts: [
      'Ephemeral, stateless compute; state externalized to managed services.',
      'Scale-to-zero economics and provider-managed elasticity.',
      'Event-triggered invocation as the composition model.',
    ],
    patterns: ['Function per event', 'Queue-based load leveling', 'Fan-out/fan-in', 'Orchestration via workflow services (e.g., state machines)'],
    terms: [
      { term: 'Cold start', def: 'Extra latency when the platform provisions a fresh function instance.' },
      { term: 'Provisioned concurrency', def: 'Pre-warmed instances trading cost for tail latency.' },
      { term: 'BaaS', def: 'Backend-as-a-Service — managed building blocks (auth, storage) FaaS composes with.' },
    ],
  },

  // ───────────────────────── D2 · Communication style ─────────────────────────
  'D2:synchronous': {
    definition:
      'A communication style in which the caller sends a request and blocks (logically) until the callee returns a response — REST and gRPC being the canonical implementations.',
    concepts: [
      'Temporal coupling: both parties must be available simultaneously.',
      'Availability multiplication along call chains.',
      'Contract-first interface design (OpenAPI/Protobuf).',
    ],
    patterns: ['Request–Response', 'Circuit Breaker', 'Retry with backoff + jitter', 'Idempotency key', 'Backend for Frontend (BFF)'],
    terms: [
      { term: 'Timeout budget', def: 'The per-hop latency allowance derived from the end-to-end SLO.' },
      { term: 'Idempotency', def: 'Property allowing safe retries: repeating a call yields the same effect.' },
      { term: 'Fan-out', def: 'One request triggering parallel downstream calls.' },
    ],
  },
  'D2:async-messaging': {
    definition:
      'A communication style in which producers place messages on a broker-managed channel and consumers process them independently in time — decoupling sender and receiver availability.',
    concepts: [
      'Temporal decoupling and load leveling via queues.',
      'Delivery semantics: at-most-once / at-least-once / effectively-once.',
      'Poison-message isolation (dead-letter queues).',
    ],
    patterns: ['Point-to-point queue', 'Competing Consumers', 'Dead Letter Queue', 'Transactional Outbox', 'Claim Check'],
    terms: [
      { term: 'At-least-once', def: 'The common guarantee: duplicates possible, loss not — consumers must be idempotent.' },
      { term: 'Consumer lag', def: 'Backlog between produced and processed messages; the health metric.' },
      { term: 'Backpressure', def: 'Mechanisms preventing producers from overwhelming consumers.' },
    ],
  },
  'D2:event-driven': {
    definition:
      'A style in which components emit events — immutable records of domain facts — and other components react by subscription, without the producer knowing its consumers.',
    concepts: [
      'Publish/subscribe topology; producer–consumer ignorance.',
      'Events as facts (past tense) vs commands as requests.',
      'Choreography (reactive flows) vs orchestration (central coordinator).',
    ],
    patterns: ['Publish–Subscribe', 'Event Notification vs Event-Carried State Transfer', 'Saga (choreographed)', 'Event Catalog / Schema Registry'],
    terms: [
      { term: 'Choreography', def: 'Workflow emerging from services reacting to each other’s events.' },
      { term: 'Orchestration', def: 'A coordinator explicitly directing the workflow steps.' },
      { term: 'Event storming', def: 'A workshop technique for discovering domain events and boundaries.' },
    ],
  },
  'D2:streaming': {
    definition:
      'A data-in-motion style built on ordered, partitioned, replayable logs, where consumers track offsets and process unbounded event sequences continuously.',
    concepts: [
      'The log as durable, re-readable history (not a transient queue).',
      'Partitioning for parallelism; ordering guaranteed per partition.',
      'Stream–table duality: a table is a view of a stream.',
    ],
    patterns: ['Log-based pub/sub', 'Change Data Capture (CDC)', 'Materialized View', 'Windowing (tumbling/sliding)', 'Exactly-once processing (transactions)'],
    terms: [
      { term: 'Offset', def: 'A consumer’s position in a partition — the replay/recovery cursor.' },
      { term: 'Compaction', def: 'Log retention keeping only the latest record per key.' },
      { term: 'Watermark', def: 'A processor’s notion of event-time progress for handling lateness.' },
    ],
  },

  // ───────────────────────── D3 · Data management ─────────────────────────
  'D3:single-db': {
    definition:
      'A data architecture in which all application components read and write one shared database, giving system-wide ACID transactions at the cost of schema-level coupling.',
    concepts: [
      'ACID transactions as the consistency mechanism.',
      'The schema as a shared (and therefore coupling) contract.',
      'Read scaling via replication; write scaling bounded by one primary.',
    ],
    patterns: ['Shared Database (pattern and anti-pattern, by context)', 'Read Replicas', 'Expand–Contract (parallel change) migrations'],
    terms: [
      { term: 'ACID', def: 'Atomicity, Consistency, Isolation, Durability — the transactional guarantees.' },
      { term: 'Expand–contract', def: 'Zero-downtime schema change: add new, migrate, remove old.' },
      { term: 'Integration database', def: 'Systems integrating by sharing tables — the notorious coupling anti-pattern.' },
    ],
  },
  'D3:db-per-service': {
    definition:
      'A data architecture in which each service exclusively owns its data store; other services access that data only through the owner’s API or published events.',
    concepts: [
      'Data ownership as the encapsulation boundary.',
      'Sagas + outbox replacing distributed transactions.',
      'Consumer-owned projections replacing cross-service joins.',
    ],
    patterns: ['Database per Service', 'Saga (orchestrated/choreographed)', 'Transactional Outbox', 'API Composition', 'CQRS projection'],
    terms: [
      { term: 'Saga', def: 'A sequence of local transactions with compensating actions on failure.' },
      { term: 'Compensating transaction', def: 'The explicit “undo” for an already-committed saga step.' },
      { term: 'Projection', def: 'A consumer-maintained read copy derived from another service’s events.' },
    ],
  },
  'D3:cqrs': {
    definition:
      'Command Query Responsibility Segregation: an architectural pattern separating the model that processes state changes (commands) from the model(s) that answer queries.',
    concepts: [
      'Command/query asymmetry as the driving force.',
      'Purpose-built read models (one per query need).',
      'Staleness as an explicit, designed property.',
    ],
    patterns: ['Command model / Aggregate', 'Materialized View', 'Event-driven projection', 'Task-based UI'],
    terms: [
      { term: 'Aggregate', def: 'A consistency boundary processing commands and guarding invariants (DDD).' },
      { term: 'Read model', def: 'A query-shaped, denormalized representation fed from the write side.' },
      { term: 'Rebuild', def: 'Regenerating a projection from source events/changes — the schema-change escape hatch.' },
    ],
  },
  'D3:event-sourcing': {
    definition:
      'A persistence pattern in which state changes are stored as an append-only sequence of domain events, and current state is derived by replaying (folding) those events.',
    concepts: [
      'The event log as the system of record; state as a fold over events.',
      'Immutability and audit-by-construction.',
      'Schema evolution via upcasting/versioned events.',
    ],
    patterns: ['Event Store', 'Snapshot', 'Upcaster', 'CQRS (near-mandatory companion)', 'Temporal query'],
    terms: [
      { term: 'Event stream', def: 'The ordered events of one aggregate instance.' },
      { term: 'Snapshot', def: 'A cached fold of a long stream to bound replay time.' },
      { term: 'Upcasting', def: 'Transforming old event versions to the current schema on read.' },
    ],
  },
  'D3:polyglot': {
    definition:
      'The deliberate use of multiple, specialized data stores within one system, each chosen for a workload’s access pattern, with derived stores synchronized from a designated system of record.',
    concepts: [
      'Workload-to-engine fit (relational, document, key-value, search, graph, columnar).',
      'System-of-record vs derived-store roles.',
      'Synchronization contracts (freshness, rebuildability).',
    ],
    patterns: ['Cache-Aside', 'CDC-fed search/analytics indexes', 'Materialized views across engines', 'Data lake/warehouse off the OLTP path'],
    terms: [
      { term: 'System of record', def: 'The single authoritative store for a dataset.' },
      { term: 'Derived store', def: 'A rebuildable copy optimized for one access pattern.' },
      { term: 'CDC', def: 'Change Data Capture — streaming a store’s changes to feed others.' },
    ],
  },

  // ───────────────────────── D4 · Code structure ─────────────────────────
  'D4:hexagonal': {
    definition:
      'Ports & Adapters (Cockburn): an application core exposing technology-neutral ports, with interchangeable adapters connecting those ports to the outside world (UI, DB, services).',
    concepts: [
      'Dependency inversion at the architectural scale.',
      'Symmetry: driving (primary) vs driven (secondary) sides.',
      'Testability via port substitution (fakes at the boundary).',
    ],
    patterns: ['Port (interface)', 'Adapter', 'Composition Root / DI', 'Anti-Corruption Layer'],
    terms: [
      { term: 'Driving adapter', def: 'Inbound technology invoking the core (HTTP controller, CLI).' },
      { term: 'Driven adapter', def: 'Outbound implementation the core calls through a port (repository, client).' },
      { term: 'Composition root', def: 'The single place where ports are wired to concrete adapters.' },
    ],
  },
  'D4:clean': {
    definition:
      'Clean Architecture (Martin): concentric layers — Entities, Use Cases, Interface Adapters, Frameworks — governed by the Dependency Rule: source dependencies point only inward.',
    concepts: [
      'The Dependency Rule as the single organizing law.',
      'Entities (enterprise rules) vs Use Cases (application rules).',
      'Frameworks as replaceable details at the rim.',
    ],
    patterns: ['Use Case / Interactor', 'Input/Output Boundary', 'Presenter', 'Gateway'],
    terms: [
      { term: 'Interactor', def: 'A use-case object orchestrating entities to fulfill one application behavior.' },
      { term: 'Boundary', def: 'The interface pair crossing a ring without violating the Dependency Rule.' },
      { term: 'Screaming architecture', def: 'Top-level structure that announces the domain, not the framework.' },
    ],
  },
  'D4:vertical-slice': {
    definition:
      'A code organization style in which each feature (request → response path) is implemented as a self-contained slice, minimizing cross-feature coupling instead of enforcing global layers.',
    concepts: [
      'Change locality over structural uniformity.',
      'Per-slice, opt-in complexity (CQRS-ish handlers where needed).',
      'A minimal shared kernel for true invariants only.',
    ],
    patterns: ['Feature folder', 'Request handler (mediator)', 'Shared Kernel', 'Rule of Three (for extracting duplication)'],
    terms: [
      { term: 'Slice', def: 'Everything one feature needs, colocated: endpoint, logic, data access.' },
      { term: 'Shared kernel', def: 'The small, deliberately shared core (domain types, auth) slices may use.' },
      { term: 'Rule of three', def: 'Tolerate duplication twice; extract on the third occurrence.' },
    ],
  },
  'D4:layered': {
    definition:
      'The application-internal variant of layering: code grouped by technical role (e.g., controllers, services, repositories) with downward-only dependencies.',
    concepts: [
      'Technical cohesion (all controllers together) vs domain cohesion.',
      'The service layer as the transaction/use-case boundary.',
      'Known erosion mode: god services and anemic domain models.',
    ],
    patterns: ['Controller–Service–Repository', 'Transaction Script', 'Anemic vs Rich domain model (the debate this style hosts)'],
    terms: [
      { term: 'Transaction script', def: 'Procedural use-case logic in a service method — fine small, unwieldy large.' },
      { term: 'Anemic model', def: 'Entities as data bags with logic exiled to services.' },
      { term: 'God service', def: 'A service class that accreted every rule the layers had no better home for.' },
    ],
  },

  // ───────────────────────── D5 · Frontend architecture ─────────────────────────
  'D5:micro-frontends': {
    definition:
      'An architectural style extending microservice ideas to the UI: independently developed and deployed frontend slices, owned by autonomous teams, composed into a single user experience.',
    concepts: [
      'Team-aligned vertical slices of the UI (Conway, applied deliberately).',
      'Composition strategies: build-time, runtime (module federation), or edge/server-side.',
      'Shared contracts: design tokens, routing, auth/session, analytics.',
    ],
    patterns: ['Module Federation', 'Web Components composition', 'App Shell', 'Design System / Token pipeline'],
    terms: [
      { term: 'Host/remote', def: 'Federation roles: the shell (host) loading team bundles (remotes).' },
      { term: 'Runtime dedup', def: 'Sharing one framework instance across slices to control page weight.' },
      { term: 'Vertical slice (UI)', def: 'A journey-aligned UI area owned end-to-end by one team.' },
    ],
  },
  'D5:spa': {
    definition:
      'Single-Page Application: the browser loads one HTML shell and a JavaScript application that renders views and handles routing client-side, exchanging data (not pages) with servers.',
    concepts: [
      'Client-side routing and state; the server becomes an API.',
      'Code-splitting/lazy loading as the load-performance lever.',
      'Server-state vs UI-state separation (query caches).',
    ],
    patterns: ['Client-side Router', 'Code Splitting', 'Optimistic UI', 'Backend for Frontend (BFF)'],
    terms: [
      { term: 'Hydration (n/a)', def: 'SPAs render fully client-side; hydration belongs to SSR hybrids.' },
      { term: 'Bundle budget', def: 'A CI-enforced ceiling on shipped JS — this repo gates one.' },
      { term: 'Route-level splitting', def: 'Loading each view’s code only when its route activates.' },
    ],
  },
  'D5:ssr': {
    definition:
      'Server-Side Rendering / Static Site Generation: producing HTML on the server per request (SSR) or ahead of time (SSG), then optionally hydrating it into an interactive client app.',
    concepts: [
      'Render-time spectrum: build-time (SSG) → edge/ISR → per-request (SSR).',
      'Hydration and its costs; islands/partial hydration as mitigation.',
      'Caching as a first-class design axis (CDN, stale-while-revalidate).',
    ],
    patterns: ['Static Generation', 'Incremental Static Regeneration', 'Islands Architecture', 'Streaming SSR'],
    terms: [
      { term: 'Hydration', def: 'Attaching client-side behavior to server-rendered HTML.' },
      { term: 'ISR', def: 'Incremental Static Regeneration — static pages refreshed on a schedule/demand.' },
      { term: 'Islands', def: 'Mostly-static pages with isolated interactive components hydrated selectively.' },
    ],
  },
};
