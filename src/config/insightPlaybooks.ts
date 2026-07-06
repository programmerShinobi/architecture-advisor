// Playbook lens — structured, step-by-step implementation guidance for EVERY architecture the
// Advisor evaluates (all 21 D1–D5 options), keyed `${dim}:${optionId}`. English by decision
// (content layer is English; UI chrome stays bilingual — see DECISIONS.md). Each playbook answers:
// how do I implement it, what do I need first, what practices keep it healthy, what mistakes to
// avoid. Citations reuse the option's READER_CITATIONS via readerContent. Parity with the frozen
// model is test-enforced (LearnView.test).

export interface ArchPlaybook {
  /** What you will have when you finish. */
  goal: string;
  prerequisites: string[];
  steps: string[];
  practices: string[];
  pitfalls: string[];
}

export const INSIGHT_PLAYBOOKS: Record<string, ArchPlaybook> = {
  // ───────────────────────── D1 · Deployment granularity ─────────────────────────
  'D1:layered': {
    goal: 'A single deployable organized in clear horizontal layers (presentation → business → data) with enforced downward-only dependencies.',
    prerequisites: [
      'A well-understood domain and a small team that can share one codebase.',
      'An agreed layer contract: what belongs in presentation, business, and data.',
      'A dependency-check in CI (lint rule or module boundary tool).',
    ],
    steps: [
      'Define the three layers and the allowed dependency direction (top → down only).',
      'Place all business rules in the business layer — controllers stay thin, repositories dumb.',
      'Expose the data layer behind interfaces so the business layer never sees SQL/ORM types.',
      'Add a CI check that fails when a layer imports upward or skips a layer.',
      'Write unit tests against the business layer without booting the web or DB layer.',
    ],
    practices: [
      'Keep DTOs at the boundaries; never leak persistence entities into presentation.',
      'One transaction boundary per use case, owned by the business layer.',
      'Document the layer rules in the repo (a one-page ADR beats tribal knowledge).',
    ],
    pitfalls: [
      '"Pass-through" business layers that just forward calls — a sign the layering is ceremonial.',
      'Letting a feature change ripple through every layer routinely — consider vertical slices then.',
      'Sharing persistence models across layers "temporarily" — it never stays temporary.',
    ],
  },
  'D1:monolith': {
    goal: 'One well-structured deployable containing the whole application — the fastest credible start for a new product.',
    prerequisites: [
      'One repository, one build pipeline, one relational database.',
      'A module convention agreed before the first feature (folder-per-domain beats folder-per-type).',
      'Basic CI: lint, tests, build on every push.',
    ],
    steps: [
      'Scaffold a single service with health checks, config via environment, and structured logging.',
      'Model the first bounded contexts as internal modules with explicit public interfaces.',
      'Keep one database, one schema-migration tool, and transactional consistency.',
      'Automate deploy as one unit (blue/green or rolling) from day one.',
      'Record the "when would we split?" triggers in an ADR so the future extraction is deliberate.',
    ],
    practices: [
      'Enforce module boundaries inside the monolith even though nothing forces you to.',
      'Load-test the single process early; vertical scaling has a knowable ceiling.',
      'Feature flags for risky changes — one deployable means one blast radius.',
    ],
    pitfalls: [
      'Treating "monolith" as an excuse for a big ball of mud — internal structure still matters.',
      'Premature extraction of services before the domain boundaries have stabilized.',
      'Letting the release cadence be hostage to the slowest team — that is the signal to modularize.',
    ],
  },
  'D1:modular-monolith': {
    goal: 'A single deployable whose internal modules have enforced boundaries aligned to bounded contexts — microservices-grade modularity without the network.',
    prerequisites: [
      'Identified bounded contexts (an EventStorming or context-mapping session is enough to start).',
      'A boundary-enforcement tool in CI (dependency-cruiser, ArchUnit, Nx module rules, or lint).',
      'Team agreement that cross-module calls go through public module APIs only.',
    ],
    steps: [
      'Partition the codebase by domain module (orders/, billing/, catalog/) — not by technical layer.',
      'Give each module a public interface file; mark everything else module-private.',
      'Enforce the boundaries in CI: a PR that imports another module’s internals must fail.',
      'Keep one database but segregate schemas/tables by module ownership; forbid cross-module joins.',
      'Route cross-module workflows through in-process events or the owning module’s API.',
      'Revisit boundaries quarterly; merge or split modules as the domain clarifies.',
    ],
    practices: [
      'One team can own several modules, but one module never belongs to several teams.',
      'Treat module APIs like published contracts: versioned mentally, changed deliberately.',
      'Measure coupling (imports across boundaries) as a fitness function.',
    ],
    pitfalls: [
      'Boundaries as folders only — without CI enforcement they erode in weeks.',
      'A shared "utils/common" module that quietly becomes the coupling hub.',
      'Cross-module database joins — they make later extraction near-impossible.',
    ],
  },
  'D1:microservices': {
    goal: 'Independently deployable services, each owning its data, sized to team and scaling boundaries — with the operational platform to run them.',
    prerequisites: [
      'Mature delivery: CI/CD per service, containerized runtime, centralized logging, tracing, metrics.',
      'Stable bounded contexts (ideally proven inside a modular monolith first).',
      'Teams aligned to services (Conway) and an on-call/ownership model.',
    ],
    steps: [
      'Extract the first service along a proven bounded context using the Strangler Fig pattern.',
      'Move its data with it: the service owns its store; others integrate via API/events only.',
      'Introduce an API gateway and service-to-service auth (mTLS or tokens) at the edge.',
      'Standardize a service template (health, config, telemetry, build) to keep entropy down.',
      'Replace cross-service transactions with sagas + the transactional outbox.',
      'Add per-service SLOs and deploy independence checks (a service must release alone).',
    ],
    practices: [
      'Few, larger services first; split further only on demonstrated need.',
      'Consumer-driven contract tests to keep integrations honest without E2E gridlock.',
      'Budget platform time explicitly — the platform is a product, not a side effect.',
    ],
    pitfalls: [
      'The distributed monolith: shared databases or lockstep releases (see the Review lens).',
      'Extracting by technical layer ("auth service", "DB service") instead of by domain.',
      'Underestimating the standing cost: tracing, versioning, and on-call are forever.',
    ],
  },
  'D1:serverless': {
    goal: 'Event-triggered functions on managed infrastructure with scale-to-zero economics for spiky or glue workloads.',
    prerequisites: [
      'Workloads that are short-lived, stateless, and tolerant of cold starts.',
      'Managed state services chosen (queue, object store, database) — functions hold no state.',
      'IaC (Terraform/SAM/CDK) from the start; console-clicked functions do not survive audits.',
    ],
    steps: [
      'Pick one bursty or event-driven workload (image resize, webhook, nightly batch) as the pilot.',
      'Define functions per event with explicit timeouts, memory, and retry policies.',
      'Wire dead-letter queues and idempotency keys before production traffic.',
      'Instrument cold-start latency and per-invocation cost from day one.',
      'Gate long-running or latency-critical paths OUT of functions — host those elsewhere.',
    ],
    practices: [
      'Keep functions single-purpose and small; share code via layers/packages, not mega-functions.',
      'Local emulation + contract tests, because step-through debugging in the cloud is painful.',
      'Review the bill monthly: sustained high volume can invert the cost advantage.',
    ],
    pitfalls: [
      'Chaining dozens of functions into an invisible distributed monolith — use a workflow service.',
      'Ignoring vendor lock-in: keep domain logic in portable modules, bind to the provider at the edge.',
      'Stateful hacks (in-memory caches, temp files) that break the scale-to-zero model.',
    ],
  },

  // ───────────────────────── D2 · Communication style ─────────────────────────
  'D2:synchronous': {
    goal: 'Request/response integration (REST/gRPC) with explicit timeouts, retries, and failure isolation.',
    prerequisites: [
      'An interface definition discipline (OpenAPI/protobuf) with review on change.',
      'A latency budget for each call chain (p95 per hop).',
    ],
    steps: [
      'Define the contract first (OpenAPI/proto), generate clients/servers from it.',
      'Set explicit timeouts on every call — no defaults, no infinite waits.',
      'Add idempotency keys to mutating endpoints so retries are safe.',
      'Introduce circuit breakers + bounded retries with jitter at the client.',
      'Version the API additively; breaking changes get a new major path.',
    ],
    practices: [
      'Keep call chains shallow (≤2 synchronous hops); deeper chains multiply latency and failure.',
      'Return partial results/degraded modes instead of cascading 500s.',
      'Contract tests in CI between consumer and provider.',
    ],
    pitfalls: [
      'Synchronously calling a service that synchronously calls another — the availability product shrinks fast.',
      'Retrying non-idempotent operations — duplicate side effects.',
      'Using sync calls for workflows that only need eventual completion.',
    ],
  },
  'D2:async-messaging': {
    goal: 'Producer/consumer integration over a broker with at-least-once delivery handled safely.',
    prerequisites: [
      'A managed broker (SQS/RabbitMQ/Pub/Sub) — do not self-host first.',
      'Message schema definitions with a compatibility rule (add-only).',
    ],
    steps: [
      'Model each integration as a named queue with an explicit message contract.',
      'Make every consumer idempotent (dedupe on a message/idempotency key).',
      'Configure dead-letter queues + alerting before go-live.',
      'Use the transactional outbox on producers so "save + publish" cannot diverge.',
      'Load-test consumer lag and set autoscaling on queue depth.',
    ],
    practices: [
      'One queue per use, not a shared "events" pipe with if-else consumers.',
      'Poison-message runbooks: who unblocks the DLQ and how.',
      'Trace IDs propagated through message headers for end-to-end debugging.',
    ],
    pitfalls: [
      'Assuming exactly-once delivery — design for at-least-once or suffer duplicates.',
      'Unbounded queues hiding a failing consumer for days.',
      'Request/response emulation over queues where a simple sync call was right.',
    ],
  },
  'D2:event-driven': {
    goal: 'Components that publish domain facts (events) and react to others’, enabling extension without touching producers.',
    prerequisites: [
      'A canonical event schema registry (even a reviewed folder of JSON schemas works).',
      'Distributed tracing — emergent flows are undebuggable without it.',
    ],
    steps: [
      'Name events as past-tense domain facts (OrderPlaced), never commands in disguise.',
      'Publish from the transactional outbox so events match committed state.',
      'Let each consumer own its projection/read model; no shared consumer state.',
      'Version events additively; consumers ignore unknown fields.',
      'Document each event’s producer, consumers, and ordering guarantees in the registry.',
    ],
    practices: [
      'Design for eventual consistency explicitly: show "pending" states in UX.',
      'Replayable consumers (idempotent + offset-based) make recovery routine.',
      'An event catalog page beats archaeology across repos.',
    ],
    pitfalls: [
      'Event chains that implement a workflow nobody can see — add a saga/orchestrator when flow matters.',
      'Fat events carrying entire entities — couple consumers to your internals.',
      'Using events where a query was needed: events notify, they do not answer questions.',
    ],
  },
  'D2:streaming': {
    goal: 'Ordered, replayable event streams (Kafka-class) powering real-time processing and materialized views.',
    prerequisites: [
      'A real throughput/ordering need (telemetry, clickstream, CDC) — not just messaging fashion.',
      'A managed streaming platform; self-hosting Kafka is a team of its own.',
    ],
    steps: [
      'Choose partition keys deliberately — they define ordering and parallelism forever.',
      'Set retention/compaction per topic according to replay needs.',
      'Build consumers as replayable processors with checkpointed offsets.',
      'Handle backpressure: bounded buffers, lag alerts, autoscaled consumer groups.',
      'Plan reprocessing: a new consumer version must be able to rebuild its view from the log.',
    ],
    practices: [
      'Schema registry + compatibility checks on every producer change.',
      'Monitor consumer lag as a first-class SLO.',
      'Keep stream processors stateless where possible; push state to stores built for it.',
    ],
    pitfalls: [
      'Hot partitions from low-cardinality keys — throughput collapses to one consumer.',
      'Treating the stream as a database without designing compaction/retention.',
      'Ignoring reprocessing cost until the first schema mistake forces a full replay.',
    ],
  },

  // ───────────────────────── D3 · Data management ─────────────────────────
  'D3:single-db': {
    goal: 'One well-governed relational database with strong transactional consistency for the whole application.',
    prerequisites: [
      'A migration tool (Flyway/Liquibase/Prisma migrate) with migrations in the repo.',
      'Clear schema ownership conventions per module/team.',
    ],
    steps: [
      'Design the schema around the domain; normalize first, denormalize with evidence.',
      'Adopt one migration pipeline: every change is a versioned, reviewed migration.',
      'Set connection pooling and per-service credentials/least privilege.',
      'Establish backup + restore drills (a backup untested is a hope, not a plan).',
      'Add slow-query monitoring and an indexing review cadence.',
    ],
    practices: [
      'Transactions at use-case boundaries; keep them short.',
      'Views or module-scoped schemas to keep module boundaries visible even in one DB.',
      'Read replicas before exotic scaling — most apps never outgrow them.',
    ],
    pitfalls: [
      'Letting every service/module write every table — the shared DB becomes the coupling hub.',
      'Scaling writes by buying bigger hardware forever instead of revisiting the model.',
      'Schema changes without expand/contract — locking migrations take prod down.',
    ],
  },
  'D3:db-per-service': {
    goal: 'Each service exclusively owns its data store; all cross-service access happens via APIs or events.',
    prerequisites: [
      'Service boundaries that match data ownership (the hard part — do this first).',
      'Async integration available (broker) for cross-service consistency.',
    ],
    steps: [
      'Assign every table/collection to exactly one owning service; kill shared access paths.',
      'Split the schema physically (separate DBs or at least separate credentials/schemas).',
      'Replace cross-service joins with API composition or consumer-owned projections.',
      'Replace cross-service transactions with sagas + transactional outbox.',
      'Give each service its own backup, migration pipeline, and capacity plan.',
    ],
    practices: [
      'Duplicate read data deliberately (projections) instead of reaching into others’ stores.',
      'Contract-first for the events that feed projections.',
      'Data-ownership map kept current — one page, one owner per dataset.',
    ],
    pitfalls: [
      'The "integration database" backdoor that quietly reunifies everything.',
      'Sagas without compensation design — half-completed workflows in production.',
      'Reporting by querying every service live; build a warehouse/lake fed by events instead.',
    ],
  },
  'D3:cqrs': {
    goal: 'Separated write model (commands) and read model (queries) for a slice where their shapes and loads genuinely diverge.',
    prerequisites: [
      'Evidence: a real asymmetry (write contention vs read fan-out, or wildly different shapes).',
      'An event or CDC channel to keep the read side updated.',
    ],
    steps: [
      'Scope CQRS to the one slice that needs it — not the whole system.',
      'Model commands with invariants enforced in the write model (aggregates).',
      'Project events/changes into read models shaped exactly for each query.',
      'Measure and expose read-model staleness; make the UX honest about it.',
      'Automate projection rebuilds — they are your schema-change escape hatch.',
    ],
    practices: [
      'Keep the write model minimal; resist querying it for lists.',
      'One projection per screen/use case beats a generic "read DB".',
      'Version projections; rebuild rather than migrate them in place.',
    ],
    pitfalls: [
      'System-wide CQRS by default — most slices never need it.',
      'Hiding staleness from users and then debugging "phantom" data complaints.',
      'Letting projections be written by multiple services — read models have one owner.',
    ],
  },
  'D3:event-sourcing': {
    goal: 'The event log as the source of truth for a domain where history itself is the requirement (ledgers, audit).',
    prerequisites: [
      'A domain where "what happened when" is a first-class requirement, not a nice-to-have.',
      'Team experience with CQRS/projections — ES without it is a trap.',
    ],
    steps: [
      'Model aggregates and their events; events are immutable, past-tense, and versioned.',
      'Persist to an append-only store with optimistic concurrency per aggregate stream.',
      'Build projections for every read need; never query the log directly for UI.',
      'Add snapshotting once aggregate streams grow long.',
      'Design upcasting for event schema evolution before you need it.',
    ],
    practices: [
      'Keep events business-meaningful (OrderPaid), not CRUD deltas (RowUpdated).',
      'Test aggregates by replaying event fixtures — it is the natural unit test.',
      'Rehearse a full projection rebuild in staging regularly.',
    ],
    pitfalls: [
      'Event-sourcing the whole system because one context needed it.',
      'Treating events as an integration API — publish separate integration events.',
      'Underestimating schema evolution: renaming a field is a versioning project.',
    ],
  },
  'D3:polyglot': {
    goal: 'The right store per workload (relational, document, search, cache, graph) with the operational cost consciously bounded.',
    prerequisites: [
      'Distinct access patterns proven by measurement, not preference.',
      'Ops capacity (or managed services) for every engine you adopt.',
    ],
    steps: [
      'Start from the query patterns; pick the smallest set of engines that serves them.',
      'Designate one system of record per dataset; other stores are derived.',
      'Feed derived stores via events/CDC with rebuildability.',
      'Standardize backup, monitoring, and upgrade playbooks per engine.',
      'Cap the portfolio: adding engine #N requires retiring or justifying against the cap.',
    ],
    practices: [
      'Prefer managed offerings; your differentiation is not running databases.',
      'Consistency contracts documented per derived store (how stale can it be?).',
      'One team owns each engine’s operational excellence.',
    ],
    pitfalls: [
      'Resume-driven database adoption — every engine is a standing tax.',
      'Two systems of record for one dataset "temporarily".',
      'Search/cache treated as source of truth and then "losing" data on rebuild.',
    ],
  },

  // ───────────────────────── D4 · Code structure ─────────────────────────
  'D4:hexagonal': {
    goal: 'A framework-agnostic domain core isolated behind ports, with adapters translating to web, DB, and external systems.',
    prerequisites: [
      'Team agreement on what counts as domain logic vs adapter code.',
      'A dependency rule check in CI (core must not import framework/IO).',
    ],
    steps: [
      'Define the core: entities, domain services, and port interfaces (driven + driving).',
      'Implement adapters at the edge: HTTP controllers, repositories, clients — each maps to a port.',
      'Wire adapters to ports in a thin composition root (DI container or manual).',
      'Unit-test the core with fake ports; integration-test adapters against real tech.',
      'Enforce direction in CI: imports point inward only.',
    ],
    practices: [
      'Ports speak domain language (SaveOrder), not tech language (insertRow).',
      'One adapter per technology concern; adapters stay thin and dumb.',
      'Let use-case tests read like specifications — that is the payoff.',
    ],
    pitfalls: [
      'Leaking ORM entities or framework annotations into the core.',
      'Port interfaces that mirror a specific vendor API — you have adapters around adapters.',
      'Hexagon ceremony for a 2-week script — match the investment to the lifespan.',
    ],
  },
  'D4:clean': {
    goal: 'Concentric layers (entities → use cases → interface adapters → frameworks) with the dependency rule pointing strictly inward.',
    prerequisites: [
      'A long-lived product that will outlive today’s framework choices.',
      'CI enforcement of the inward dependency rule.',
    ],
    steps: [
      'Model entities (enterprise rules) free of any framework import.',
      'Express each application behavior as a use-case interactor with input/output boundaries.',
      'Write interface adapters (controllers/presenters/gateways) that translate both ways.',
      'Keep frameworks in the outermost ring — replaceable details.',
      'Add architecture tests asserting ring dependencies (ArchUnit/dependency-cruiser).',
    ],
    practices: [
      'Screaming architecture: the top-level folders say what the system does, not which framework.',
      'One use case per class/function keeps interactors testable and named.',
      'Presenters shape output for views; use cases stay UI-ignorant.',
    ],
    pitfalls: [
      'Ceremony overload on small apps — rings without value.',
      'Anemic use cases that only delegate to services — collapse layers honestly instead.',
      'Framework types (HTTP request, ORM entity) smuggled into use-case signatures.',
    ],
  },
  'D4:vertical-slice': {
    goal: 'Code organized by feature/use case, where each slice contains everything it needs — optimizing for change locality.',
    prerequisites: [
      'A team comfortable letting slices differ internally (no one-size layer template).',
      'Conventions for what may be shared (kernel) vs duplicated.',
    ],
    steps: [
      'Create one folder per feature (PlaceOrder/, CancelOrder/) containing handler, model, and data access.',
      'Route each request straight to its slice handler (mediator or plain functions).',
      'Extract a small shared kernel ONLY for true invariants (domain types, auth).',
      'Test each slice end-to-end at the handler level — that is the natural seam.',
      'Refactor duplication only when three slices repeat it (rule of three).',
    ],
    practices: [
      'Let simple slices stay simple; complexity is opt-in per slice.',
      'Slice boundaries mirror user-facing capabilities, easing product conversations.',
      'Keep cross-slice calls rare and explicit — prefer duplication over coupling.',
    ],
    pitfalls: [
      'A "common" folder that regrows the horizontal layers you left.',
      'Slices reaching into each other’s internals — invisible coupling returns.',
      'Zero shared invariants: money/date/id types should not be re-invented per slice.',
    ],
  },
  'D4:layered': {
    goal: 'Classic technical layering inside the deployable — quick, familiar, and adequate for small or stable domains.',
    prerequisites: [
      'A domain simple/stable enough that change amplification stays tolerable.',
      'Agreement on strict vs relaxed layering (may layers skip?).',
    ],
    steps: [
      'Fix the layer set (e.g., controller → service → repository) and dependency direction.',
      'Keep domain logic in services; controllers translate, repositories persist.',
      'Ban upward imports via lint/CI.',
      'Unit-test services with repository fakes.',
      'Watch change patterns: when every feature touches all layers, revisit (vertical slices).',
    ],
    practices: [
      'Thin controllers, expressive services, dumb repositories.',
      'DTO mapping at boundaries to avoid leaking persistence shapes.',
      'Name layers consistently across the codebase.',
    ],
    pitfalls: [
      'Business logic drifting into controllers or SQL.',
      'The service layer becoming a transaction-script dumping ground.',
      'Ceremonial layers that only forward calls.',
    ],
  },

  // ───────────────────────── D5 · Frontend architecture ─────────────────────────
  'D5:micro-frontends': {
    goal: 'Independently built and deployed UI slices owned by separate teams, composed into one coherent product.',
    prerequisites: [
      'Multiple UI teams whose release trains genuinely block each other.',
      'A design system (tokens + components) to keep the seams invisible.',
    ],
    steps: [
      'Slice by user journey/domain (checkout, catalog), never by technical widget.',
      'Choose one composition style (module federation, web components, or route-based) and standardize it.',
      'Define shared contracts: design tokens, auth/session, analytics, routing events.',
      'Set performance budgets per slice; enforce shared framework/runtime deduplication.',
      'Build a reference slice ("golden path") teams can copy.',
    ],
    practices: [
      'Independent deploys are the point — protect them with per-slice pipelines and contract tests.',
      'Cross-slice communication via documented events, not shared globals.',
      'A platform team owns the shell, tokens, and federation glue.',
    ],
    pitfalls: [
      'Micro-frontends for one team — all the overhead, none of the payoff.',
      'Duplicated framework bundles blowing the page weight — measure and dedupe.',
      'Inconsistent UX because the design system was "later".',
    ],
  },
  'D5:spa': {
    goal: 'A single rich client application with client-side routing, optimized for interactivity and shipped as static assets.',
    prerequisites: [
      'API endpoints designed for the client (or a BFF).',
      'A bundler with code-splitting (Vite/rollup-class) and a bundle-size budget in CI.',
    ],
    steps: [
      'Scaffold with file/route-based code splitting and lazy loading for heavy views.',
      'Centralize server state (query library) separate from UI state.',
      'Add route-level error and loading boundaries.',
      'Wire performance budgets (initial JS, LCP) into CI.',
      'Mitigate SEO/first-paint where needed: prerender or SSR the few public pages.',
    ],
    practices: [
      'Accessibility from the start: focus management on route change, semantic landmarks.',
      'Persist minimal state in the URL so views are shareable.',
      'Lazy-load below-the-fold and admin surfaces aggressively.',
    ],
    pitfalls: [
      'A single monolithic bundle — interactivity you can’t reach in time.',
      'Recreating a server-cache in Redux by hand — use a data-fetch layer.',
      'Ignoring first-paint on content pages that actually needed SSR/SSG.',
    ],
  },
  'D5:ssr': {
    goal: 'Server-rendered (or statically generated) pages with fast first paint and SEO, hydrating into interactivity where needed.',
    prerequisites: [
      'A rendering strategy per route class: static (SSG), incremental, or per-request SSR.',
      'Hosting that matches it (static CDN vs node/edge runtime).',
    ],
    steps: [
      'Classify routes: marketing/docs → SSG; personalized → SSR; app-like → hybrid/islands.',
      'Implement data fetching at the route level with caching headers thought through.',
      'Keep hydration cost low: islands/partial hydration for mostly-static pages.',
      'Set cache/CDN rules (stale-while-revalidate) per route class.',
      'Measure Core Web Vitals in CI or field monitoring; they are the point of SSR.',
    ],
    practices: [
      'Prefer static generation wherever data allows — cheapest and fastest by design.',
      'Stream HTML for slow data so first paint never waits for the slowest query.',
      'One source of truth for head/meta/canonical tags.',
    ],
    pitfalls: [
      'SSR-ing everything, including pages a CDN could have served statically.',
      'Hydration mismatches from non-deterministic render (dates, random) — render deterministically.',
      'Session logic in edge/server render paths that breaks cacheability silently.',
    ],
  },
};
