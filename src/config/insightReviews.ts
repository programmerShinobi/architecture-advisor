// Review lens — structured, objective evaluations for EVERY architecture the Advisor evaluates
// (all 21 D1–D5 options), keyed `${dim}:${optionId}`. English by decision (content layer is
// English; UI chrome stays bilingual — see DECISIONS.md). Each review gives: overview, pros, cons,
// performance, scalability, developer experience, suitable use cases, and a final verdict — the
// evaluation structure the user-facing Review section promises. Citations reuse the option's
// READER_CITATIONS via readerContent. Parity with the frozen model is test-enforced.

export interface ArchReview {
  overview: string;
  pros: string[];
  cons: string[];
  performance: string;
  scalability: string;
  dx: string;
  useCases: string[];
  verdict: string;
}

export const INSIGHT_REVIEWS: Record<string, ArchReview> = {
  // ───────────────────────── D1 · Deployment granularity ─────────────────────────
  'D1:layered': {
    overview:
      'The classic single deployable partitioned by technical responsibility. Time-tested, universally understood, and quick to start — with a well-known erosion mode as domains grow.',
    pros: [
      'Zero learning curve — every hire has seen it.',
      'Fast bootstrap; frameworks scaffold it for free.',
      'Clear home for each kind of code (UI, rules, persistence).',
    ],
    cons: [
      'Technical layers do not match how features change — one feature touches every layer.',
      'No enforced domain boundaries; erosion into a tangle is the default trajectory.',
      'Whole-app deploys and a single failure domain.',
    ],
    performance: 'In-process calls — excellent baseline latency; performance issues are query/algorithm problems, not architecture ones.',
    scalability: 'Whole-app horizontal/vertical scaling only; fine until one hot module needs independent scaling.',
    dx: 'Comfortable at small size; degrades as unrelated features contend in shared services and merge conflicts rise.',
    useCases: [
      'Small teams and well-understood CRUD-heavy domains.',
      'Internal tools and admin systems.',
      'Prototypes that must ship this month.',
    ],
    verdict:
      'A sensible default for small, stable systems — but pair it with explicit module boundaries (or move to a modular monolith) the moment the domain grows teeth.',
  },
  'D1:monolith': {
    overview:
      'One deployable, one database, one release train. The most operationally simple architecture and the recommended starting point for most new products ("monolith first").',
    pros: [
      'Simplest possible operations: one build, one deploy, one thing to monitor.',
      'Strong consistency is trivial — one database, real transactions.',
      'Refactoring across the whole system is an IDE operation, not a migration project.',
    ],
    cons: [
      'One failure domain: a bad deploy or memory leak takes everything down.',
      'One release cadence for all teams; coordination costs grow with team count.',
      'Scaling is all-or-nothing; a single hot path forces scaling the world.',
    ],
    performance: 'Best-in-class baseline — every call is in-process; no serialization or network tax.',
    scalability: 'Vertical first, then whole-app replicas behind a load balancer; the ceiling is real but much higher than teams assume.',
    dx: 'Excellent while the team is small: one repo, one run command, debuggable end to end. Watch build times and test suites as it grows.',
    useCases: [
      'New products before product-market fit.',
      'Teams of one to ~eight engineers.',
      'Systems where strong consistency dominates (money, inventory).',
    ],
    verdict:
      'Underrated and usually right. Start here, keep modules clean, and let real pain — not fashion — justify any split.',
  },
  'D1:modular-monolith': {
    overview:
      'A monolith with enforced internal boundaries aligned to bounded contexts: microservices-grade modularity, monolith-grade operations. The pragmatic sweet spot for most growing products.',
    pros: [
      'Team autonomy via module ownership without distributed-systems tax.',
      'One deploy, one database, real transactions — operations stay simple.',
      'A proven stepping stone: modules extract cleanly to services later (Strangler Fig).',
    ],
    cons: [
      'Boundary discipline must be enforced (CI) or it silently erodes.',
      'Still one failure domain and one release train.',
      'No independent scaling per module.',
    ],
    performance: 'Identical to a monolith — in-process calls throughout.',
    scalability: 'Whole-app scaling; the payoff is organizational scaling (teams in parallel), not runtime scaling.',
    dx: 'Very good: clear ownership, enforced contracts, single debuggable process. The boundary tooling is the only extra moving part.',
    useCases: [
      'Products with several teams that keep stepping on each other.',
      'Domains stabilizing toward clear bounded contexts.',
      'Organizations wanting a reversible path toward microservices.',
    ],
    verdict:
      'The default recommendation for growing systems: buy modularity first — it is cheap; buy distribution later — it is not.',
  },
  'D1:microservices': {
    overview:
      'Many independently deployable services, each owning its data. Delivers real team autonomy and independent scaling — at a permanent operational and consistency cost that empirical studies consistently flag.',
    pros: [
      'Independent deploys: teams release without coordinating trains.',
      'Independent scaling and failure isolation per service.',
      'Technology freedom per service where genuinely useful.',
    ],
    cons: [
      'Distributed-systems tax forever: network failures, eventual consistency, tracing.',
      'The pains reported most in practice: operational complexity and data consistency.',
      'The classic failure mode — the distributed monolith — is easy to build by accident.',
    ],
    performance: 'Every hop adds serialization + network latency; chatty designs multiply it. Good designs keep call chains shallow and async.',
    scalability: 'The headline strength: scale only what is hot, deploy only what changed.',
    dx: 'Bimodal. Wonderful inside one service; hard across services (local env, debugging, cross-cutting changes). Platform quality decides everything.',
    useCases: [
      'Large or distributed organizations with mature DevOps.',
      'Systems whose parts have genuinely different scaling profiles.',
      'Domains with stable, well-proven context boundaries.',
    ],
    verdict:
      'Powerful and conditional. Adopt when team scale and load asymmetry demand it AND the platform exists; otherwise the modular monolith gives most of the benefit at a fraction of the cost.',
  },
  'D1:serverless': {
    overview:
      'Functions-as-a-Service on managed infrastructure: scale-to-zero, pay-per-use, no servers to run. Superb for spiky and event-driven work; constrained for latency-critical or stateful cores.',
    pros: [
      'Scale-to-zero economics — idle costs nothing.',
      'Elasticity without capacity planning.',
      'Least infrastructure to operate of any option here.',
    ],
    cons: [
      'Cold-start latency on the critical path.',
      'Execution limits (duration/memory) and awkward local testing.',
      'Vendor lock-in gravity; cost can invert at sustained high volume.',
    ],
    performance: 'Excellent for parallel burst work; unpredictable tail latency from cold starts unless provisioned concurrency (which erodes the cost model).',
    scalability: 'Effectively unlimited for stateless bursts — the platform’s strongest axis.',
    dx: 'Fast to ship a function; harder to test, trace, and reason about at system scale. IaC discipline is non-negotiable.',
    useCases: [
      'Spiky/unpredictable traffic and event-driven glue.',
      'Scheduled/batch jobs and webhook handlers.',
      'Early products wanting zero ops surface.',
    ],
    verdict:
      'Choose it for the edges (events, bursts, glue) with confidence; choose it for the core only when the workload truly matches the FaaS shape.',
  },

  // ───────────────────────── D2 · Communication style ─────────────────────────
  'D2:synchronous': {
    overview:
      'Direct request/response (REST/gRPC). The simplest mental model and the strongest coupling: the caller shares the callee’s fate, latency, and availability.',
    pros: [
      'Immediate answers; trivial to understand and debug.',
      'Ubiquitous tooling, gateways, and contract formats.',
      'Natural fit for queries and user-facing reads.',
    ],
    cons: [
      'Temporal coupling: callee down → caller down (multiplied along chains).',
      'Latency adds up per hop; availability multiplies down.',
      'Retry storms and cascades without breakers/timeouts.',
    ],
    performance: 'Lowest per-call overhead of the styles, but chain depth is the real budget — p95 of a chain is the sum of its hops.',
    scalability: 'Scales with the slowest dependency; backpressure is the caller’s problem.',
    dx: 'Excellent: request in, response out, stack traces make sense. The discipline burden (timeouts, idempotency) is real but well-known.',
    useCases: [
      'User-facing queries needing an immediate answer.',
      'Simple service-to-service lookups.',
      'Public APIs.',
    ],
    verdict:
      'Right for questions, wrong for workflows. Keep chains shallow, timeouts explicit, and reach for async the moment "eventually" is acceptable.',
  },
  'D2:async-messaging': {
    overview:
      'Producers and consumers decoupled in time via queues/brokers. Trades the simple call stack for resilience, buffering, and independent pacing.',
    pros: [
      'Temporal decoupling: consumers can be down without losing work.',
      'Load leveling: bursts queue instead of toppling services.',
      'Natural retry/DLQ machinery for reliability.',
    ],
    cons: [
      'End-to-end reasoning is harder; flows span logs and queues.',
      'At-least-once delivery forces idempotent consumers.',
      'Latency becomes variable — "done" is asynchronous.',
    ],
    performance: 'Throughput-oriented rather than latency-oriented; broker adds milliseconds but absorbs spikes gracefully.',
    scalability: 'Excellent: add consumers to drain faster; queues absorb what consumers cannot.',
    dx: 'Good with discipline (schemas, tracing, DLQ runbooks); confusing without — messages “disappear” only when observability is missing.',
    useCases: [
      'Background work (email, exports, billing runs).',
      'Integrations between systems with different uptime/pace.',
      'Buffering write bursts ahead of slower processors.',
    ],
    verdict:
      'The workhorse of reliable integration. Adopt broadly for commands/workflows; keep sync only where the user is literally waiting for the answer.',
  },
  'D2:event-driven': {
    overview:
      'Components publish domain facts; interested parties subscribe. Maximizes extensibility and decoupling; global ordering and workflow visibility become design problems.',
    pros: [
      'Producers need not know consumers — add features without touching upstream.',
      'Fits domain thinking: events are business facts.',
      'Excellent audit/analytics side effects for free.',
    ],
    cons: [
      'Eventual consistency by construction.',
      'Emergent flows are hard to see and debug without tracing.',
      'Event schema evolution requires governance.',
    ],
    performance: 'Comparable to messaging; fan-out to many consumers is cheap for producers.',
    scalability: 'Very strong: consumers scale independently; new subscribers are free for producers.',
    dx: 'Great locally (handle event → do thing), demanding globally (who reacts to what?). An event catalog and tracing are the difference between elegance and chaos.',
    useCases: [
      'Cross-domain propagation (order placed → shipping, loyalty, analytics).',
      'Extensible platforms where future consumers are unknown.',
      'CQRS projections and cache invalidation.',
    ],
    verdict:
      'Choose for extensibility across domains — with an event catalog, tracing, and explicit consistency UX as entry criteria, not afterthoughts.',
  },
  'D2:streaming': {
    overview:
      'Ordered, replayable, partitioned logs (Kafka-class) for continuous data flows. A different beast from messaging: the log is a durable, re-readable source of history.',
    pros: [
      'Replayability: rebuild consumers/views from history.',
      'Massive throughput with per-partition ordering.',
      'One backbone serves realtime processing AND integration.',
    ],
    cons: [
      'Real operational weight: partitions, offsets, retention, backpressure.',
      'Partition-key mistakes are forever (ordering/hotspots).',
      'Overkill for simple work queues.',
    ],
    performance: 'Built for firehoses — millions of events/sec with linear partition scaling; end-to-end latency in low milliseconds when tuned.',
    scalability: 'The strongest of the styles — horizontal by partition, consumers in groups.',
    dx: 'Powerful but specialist: offset semantics, rebalancing, and reprocessing require real study. Managed platforms remove the worst of it.',
    useCases: [
      'Telemetry/clickstream/IoT pipelines.',
      'Change-data-capture and event sourcing backbones.',
      'Materialized views and stream analytics.',
    ],
    verdict:
      'Adopt when volume, ordering, or replay genuinely matter; otherwise a plain queue is cheaper in every dimension.',
  },

  // ───────────────────────── D3 · Data management ─────────────────────────
  'D3:single-db': {
    overview:
      'One shared database as the system of record. Simplest possible consistency and operations — and the strongest silent coupler of services and modules.',
    pros: [
      'Real ACID transactions across the whole domain.',
      'One backup, one migration pipeline, one thing to tune.',
      'Joins and reporting are trivial.',
    ],
    cons: [
      'Couples every writer to one schema — the classic microservices anti-pattern.',
      'Single write-scaling ceiling.',
      'Schema changes need whole-system coordination.',
    ],
    performance: 'Excellent when indexed and tuned; a mature relational engine outperforms naive distributed setups by miles.',
    scalability: 'Reads scale via replicas; writes eventually hit the single-node ceiling (later than most teams believe).',
    dx: 'Superb: one connection string, real transactions, SQL for every question.',
    useCases: [
      'Monoliths and modular monoliths (its natural partner).',
      'Consistency-critical domains.',
      'Anything pre-scale — which is most systems.',
    ],
    verdict:
      'Correct for single-deployable architectures; a liability under microservices. Judge it by the deployment model around it.',
  },
  'D3:db-per-service': {
    overview:
      'Each service exclusively owns its store; integration happens via APIs/events. The data foundation that makes service independence real.',
    pros: [
      'True encapsulation: schema changes stay local.',
      'Independent scaling, tuning, and even engine choice per service.',
      'Failure isolation extends to the data tier.',
    ],
    cons: [
      'Cross-service transactions are gone — sagas/outbox replace them.',
      'Cross-entity queries need composition or projections.',
      'N databases = N backups, migrations, capacity plans.',
    ],
    performance: 'Local access stays fast; cross-service reads pay API/projection costs — design read models deliberately.',
    scalability: 'Excellent and targeted: scale exactly the hot store.',
    dx: 'Clear ownership is loved; the consistency machinery (sagas, outbox, projections) is a real skill tax.',
    useCases: [
      'Microservices (it is practically their definition).',
      'Domains with clear data ownership per capability.',
      'Regulated data needing isolation boundaries.',
    ],
    verdict:
      'Non-negotiable if you do microservices honestly. The cost is the consistency toolkit — budget for it or stay monolithic.',
  },
  'D3:cqrs': {
    overview:
      'Separate write and read models for a slice whose command and query needs genuinely diverge. A precision tool routinely over-applied.',
    pros: [
      'Each side shaped and scaled to its job.',
      'Read models per screen kill N+1 query pain.',
      'Pairs naturally with events/projections.',
    ],
    cons: [
      'More moving parts + eventual consistency between sides.',
      'Projection rebuild/versioning machinery required.',
      'Easy to cargo-cult system-wide.',
    ],
    performance: 'Reads become O(1)-shaped lookups against purpose-built models; writes keep invariants without read contention.',
    scalability: 'Strong: fan out read replicas/projections independently of the write path.',
    dx: 'Pleasant per side; the mental model of staleness and rebuilds must be taught, and the UX must show pending states honestly.',
    useCases: [
      'Read-heavy slices with complex writes (catalogs, dashboards).',
      'High-contention aggregates needing slim write paths.',
      'Event-sourced contexts (its natural partner).',
    ],
    verdict:
      'Excellent surgically, harmful as a default. Apply per-slice with measured asymmetry as the entry ticket.',
  },
  'D3:event-sourcing': {
    overview:
      'State stored as an immutable event log; current state is a projection. Perfect audit and time-travel for domains where history IS the requirement — at a permanent complexity premium.',
    pros: [
      'Complete, incorruptible audit trail by construction.',
      'Temporal queries and retroactive fixes (replay with corrections).',
      'Events double as integration and analytics gold.',
    ],
    cons: [
      'Schema evolution (upcasting) is a discipline forever.',
      'Projections add operational surface (rebuilds, lag).',
      'Steep learning curve; easy to misapply beyond audit-heavy cores.',
    ],
    performance: 'Appends are fast; reads depend entirely on projections; long streams need snapshots.',
    scalability: 'Good: append-only writes shard well; projections scale like read models.',
    dx: 'Intellectually satisfying, practically demanding — versioned events, replay tooling, and staging rebuild drills are table stakes.',
    useCases: [
      'Ledgers, payments, compliance-critical records.',
      'Domains where "how did we get here?" is a business question.',
      'Systems already committed to CQRS + events.',
    ],
    verdict:
      'A specialist’s power tool: transformative where audit/time-travel are core, an expensive detour anywhere else.',
  },
  'D3:polyglot': {
    overview:
      'Right store per workload — relational, document, search, cache, graph — each fed from a clear system of record. Fit at the cost of operational breadth.',
    pros: [
      'Each access pattern gets an engine built for it.',
      'Avoids one-engine-fits-nothing contortions.',
      'Managed cloud services make the portfolio feasible.',
    ],
    cons: [
      'Every engine is a standing tax: backups, upgrades, expertise.',
      'Cross-store consistency contracts must be designed and monitored.',
      'Team cognitive load grows with the portfolio.',
    ],
    performance: 'The point: search queries hit a search engine, graphs a graph DB — each near-optimal instead of one engine mediocre at all.',
    scalability: 'Per-engine and therefore precise; the coordination layer (sync pipelines) is the new bottleneck to watch.',
    dx: 'Fun breadth, real context-switching; strong platform conventions (one way to run/backup/monitor each engine) keep it sane.',
    useCases: [
      'Products combining transactions + search + caching at real scale.',
      'Analytics/recommendation features beside OLTP cores.',
      'Migration periods bridging old and new stores.',
    ],
    verdict:
      'Adopt engine-by-engine with evidence, keep one system of record per dataset, and cap the portfolio — polyglot by policy, not by accretion.',
  },

  // ───────────────────────── D4 · Code structure ─────────────────────────
  'D4:hexagonal': {
    overview:
      'Ports & Adapters: a pure domain core, technology at the edges. The reference structure for testable, framework-independent business logic.',
    pros: [
      'Core unit-testable without any infrastructure.',
      'Framework/database swaps become adapter work.',
      'Forces explicit contracts (ports) for every dependency.',
    ],
    cons: [
      'Up-front indirection and boilerplate.',
      'Discipline required to keep the core pure.',
      'Overkill for short-lived or trivial services.',
    ],
    performance: 'Neutral at runtime — an interface hop is nanoseconds; the win is engineering speed, not CPU.',
    scalability: 'Code-scale strength: parallel work on adapters and core with few collisions.',
    dx: 'Excellent once internalized: tests read like specs, onboarding maps cleanly. The pattern must be taught once, then it pays daily.',
    useCases: [
      'Long-lived domains with real business rules.',
      'Systems facing framework/vendor churn.',
      'Teams practicing TDD/BDD seriously.',
    ],
    verdict:
      'The strongest default for serious backend cores; scale the ceremony down honestly for small utilities.',
  },
  'D4:clean': {
    overview:
      'Concentric rings with a strict inward dependency rule — hexagonal’s intent, more prescriptive shape. Entities and use cases at the center, frameworks as details.',
    pros: [
      'Business rules outlive frameworks by construction.',
      'Use-case classes give behavior an explicit, testable home.',
      'Screaming architecture: structure reveals purpose.',
    ],
    cons: [
      'The most ceremony of the D4 options.',
      'Dogmatic application produces empty pass-through layers.',
      'Interactor boilerplate on trivial CRUD is real.',
    ],
    performance: 'Runtime-neutral; the rings are compile-time concepts.',
    scalability: 'Same as hexagonal — organizational, not runtime.',
    dx: 'Very good on large long-lived systems; frustrating when applied to simple apps (boilerplate without benefit). Team buy-in decides.',
    useCases: [
      'Enterprise cores with decade lifespans.',
      'Multi-team codebases needing a shared, explicit structure.',
      'Domains rich in genuine business rules.',
    ],
    verdict:
      'Choose it when longevity and team scale justify the ceremony; choose hexagonal-lite or slices when they do not.',
  },
  'D4:vertical-slice': {
    overview:
      'Organize by feature, not layer: each slice owns its request-to-response path. Optimizes for how software actually changes.',
    pros: [
      'Change locality: one feature = one folder = one PR.',
      'Complexity is opt-in per slice, not imposed globally.',
      'Onboarding by feature is natural.',
    ],
    cons: [
      'Duplication needs active gardening (rule of three).',
      'Weak shared-kernel discipline re-invents money/date types per slice.',
      'Cross-cutting refactors touch many slices.',
    ],
    performance: 'Runtime-neutral; occasionally faster paths because each slice queries exactly what it needs.',
    scalability: 'Team-parallel by design — slices collide rarely.',
    dx: 'Loved in CRUD-heavy, feature-driven products: no layer archaeology, just find the folder. Architects must still guard invariants.',
    useCases: [
      'Feature-factory products with steady request-shaped work.',
      'Teams burned by layer ceremonies.',
      'CQRS-style handlers (natural pairing).',
    ],
    verdict:
      'The pragmatic modern default for request-driven apps; add a small shared kernel and duplication discipline and it scales surprisingly far.',
  },
  'D4:layered': {
    overview:
      'Technical layers inside the codebase (controller/service/repository). Familiar and fast to start; the change-amplification trap as domains grow.',
    pros: [
      'Everyone knows it; frameworks assume it.',
      'Clear technical separation of concerns.',
      'Adequate for small/stable domains.',
    ],
    cons: [
      'Feature changes cut across every layer.',
      'Services become god-objects/transaction scripts.',
      'No domain boundaries — erosion is unopposed.',
    ],
    performance: 'Neutral; layers are organizational.',
    scalability: 'Poor organizationally at size: shared layers become merge-conflict magnets.',
    dx: 'Comfortable early, sluggish later; the moment "where does this go?" has three answers, the structure is failing.',
    useCases: [
      'Small services and internal tools.',
      'Stable, well-understood domains.',
      'Codebases with heavy framework scaffolding.',
    ],
    verdict:
      'Fine as a starting point; plan the exit (slices or hexagonal) before the service layer becomes the city dump.',
  },

  // ───────────────────────── D5 · Frontend architecture ─────────────────────────
  'D5:micro-frontends': {
    overview:
      'Independently deployable UI slices per team, composed into one product. Conway’s Law applied to the frontend — with browser-weight and consistency bills attached.',
    pros: [
      'True team autonomy: independent releases end frontend release trains.',
      'Incremental migration of legacy frontends.',
      'Blast-radius isolation per slice.',
    ],
    cons: [
      'Bundle duplication and page-weight risk.',
      'UX consistency requires an actively-owned design system.',
      'Composition tooling (federation) is its own platform.',
    ],
    performance: 'The risk axis: duplicated runtimes and multiple bundles unless dedup/budgets are enforced per slice.',
    scalability: 'Organizational scalability is the entire point — many teams, one product, no lockstep.',
    dx: 'Great per team (small codebases, own pipeline); the integration shell and contracts demand a real platform owner.',
    useCases: [
      'Portals/suites built by many UI teams.',
      'Gradual legacy-frontend strangling.',
      'Organizations already running domain-aligned teams.',
    ],
    verdict:
      'Justified at organizational scale only. Below several UI teams, a well-modularized SPA delivers the same modularity without the weight.',
  },
  'D5:spa': {
    overview:
      'One rich client app; the server serves data. The default for interactive products — with first-paint and SEO as the known taxes.',
    pros: [
      'Richest interactivity model; app-like UX.',
      'Ships as static assets — trivial hosting/CDN.',
      'One codebase, one deploy for the whole UI.',
    ],
    cons: [
      'First paint waits for JS unless mitigated.',
      'SEO needs prerendering for public content.',
      'Bundle growth is a constant battle (budgets!).',
    ],
    performance: 'Post-load interactions are instant; initial load is the discipline point — code-splitting and budgets are mandatory.',
    scalability: 'Serving scales infinitely (static); codebase scale needs internal modularity.',
    dx: 'The mainstream happy path: hot reload, huge ecosystem, one language across the app.',
    useCases: [
      'Dashboards, editors, internal tools.',
      'Authenticated product UIs where SEO is irrelevant.',
      'This very application.',
    ],
    verdict:
      'The right default for app-like products. Enforce bundle budgets from day one and prerender the few public pages.',
  },
  'D5:ssr': {
    overview:
      'HTML rendered on the server or at build time (SSG), hydrating into interactivity. Wins first paint and SEO decisively; adds a rendering runtime to operate (unless fully static).',
    pros: [
      'Fast first contentful paint by construction.',
      'SEO/social previews work natively.',
      'SSG variants are the cheapest, fastest hosting on earth.',
    ],
    cons: [
      'A server/edge runtime to run and scale (for true SSR).',
      'Hydration complexity and its mismatch bugs.',
      'Personalization vs cacheability tension.',
    ],
    performance: 'Best first-load metrics of the three; interaction readiness depends on hydration strategy (islands help).',
    scalability: 'SSG scales like static files (perfectly); SSR scales like a service (plan it).',
    dx: 'Modern meta-frameworks make it smooth, at the price of more concepts (render modes, caching layers) than a plain SPA.',
    useCases: [
      'Content, marketing, docs, commerce landing pages.',
      'Anything where Google and first impressions pay the bills.',
      'Hybrid apps with public content + private app areas.',
    ],
    verdict:
      'Choose per route class: static-generate everything you can, server-render what personalization forces, and hydrate only where interaction demands.',
  },
};
