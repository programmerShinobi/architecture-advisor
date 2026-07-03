# Architecture Reader — the science behind the choices

> A plain-language, **evidence-grounded** companion to the Advisor. It explains *what* each
> architecture is, *when* it fits, and *what it costs* — for newcomers **and** experts — drawing on
> recognised standards and the software-architecture literature. It is the canonical source for the
> **architecture explanations inside the in-app Manual / Guide** (Section 5), whose concise bilingual
> content lives in [`src/config/readerContent.ts`](../../src/config/readerContent.ts) and links back
> here for depth.
>
> **Honesty note.** These are *defensible, well-supported* explanations, not universal laws. Context
> decides. Citations are to primary standards, seminal books, and peer-reviewed / widely-recognised
> works — see the [Bibliography](#bibliography). Where the field genuinely disagrees, we say so.

## How to read this

Two audiences, one text:

- **Newcomer** → read the **What / When it fits / What it costs** lines. Skip the *Deeper* notes.
- **Expert** → the **Deeper** notes carry the mechanism, the evidence, and the disagreements.

In the app, these explanations live in the **Manual / Guide** (open it from the header): each option
shows the plain lines **and** the *Deeper* note with inline sources together, so the Guide is a full
deep-dive. Everything there is bilingual (EN/ID); this document is English (the repo's documentation
language).

---

## 1. Why quality attributes — the method, briefly

Architecture is the set of **early, hard-to-reverse decisions** that most shape a system's qualities
[bass]. Rather than pick by trend, the Advisor makes those decisions against **quality attributes**
(QAs) — the "-ilities" — using recognised methods:

- **ISO/IEC 25010:2023** [iso25010] gives the quality vocabulary (performance efficiency, reliability,
  security, maintainability, compatibility, and — new in 2023 — *flexibility → scalability*). Two of
  the Advisor's twelve QAs (cost efficiency, time-to-market) are economic/delivery goals shown
  **honestly outside** the ISO product-quality model.
- **ATAM** [atam] contributes the **utility tree**: turn stakeholder concerns into weighted, testable
  QA priorities, then reason about **trade-offs** (a decision that helps one QA usually costs another).
- **Attribute-Driven Design (ADD)** [add] selects structures *because* they serve the prioritised QAs.
- **Multi-Attribute Value Theory** [mavt] is the decision-analysis basis for the additive weighted score
  (Σ weight × fit) — a transparent, auditable value model, not a black box.
- **Evolutionary architecture / fitness functions** [evoarch] make the chosen qualities **measurable
  over time**, so the architecture can be guarded as it changes.

**Deeper.** The additive model assumes *preferential independence* between QAs and a linear value
scale — reasonable for a decision-support heuristic, and the reason the tool surfaces **close calls**
and **sensitivity** rather than claiming a single "correct" answer. This mirrors ATAM's stance that the
output is a *shared understanding of trade-offs*, not a verdict [atam][bass].

---

## 2. Deployment granularity (D1) — how the system is split into deployables

The most consequential structural axis: one deployable, or many? The literature is clear that this is
a **trade-off between team autonomy / independent scalability and operational complexity**
[newman][fundamentals][hardparts].

### Layered / N-Tier

- **What.** One deployable organised in horizontal layers (presentation → business → data).
- **When it fits.** Small teams, well-understood domains, and a fast start; the default "boring"
  choice that is often right [fundamentals].
- **What it costs.** As the domain grows, layers can erode into a tangle ("big ball of mud") because
  the layering doesn't enforce *domain* boundaries.
- **Deeper.** Layering is a technical partitioning; it optimises for role separation, not change
  locality — a change to one feature often touches every layer [fundamentals][peaa].

### Monolith

- **What.** A single deployable containing the whole application.
- **When it fits.** Early products and small teams; deployment, testing, and refactoring are simplest,
  and strong consistency is trivial (one process, one database).
- **What it costs.** One shared failure domain and one release cadence; scaling means scaling the whole
  app, and a large codebase can slow independent teams.
- **Deeper.** Fowler's **"Monolith First"** [fowlerMonolithFirst] argues most systems should *start*
  monolithic and extract services only when boundaries are proven — premature distribution is a common,
  costly mistake [newman].

### Modular Monolith

- **What.** A single deployable with **enforced internal module boundaries** (well-defined interfaces,
  dependency rules).
- **When it fits.** You want clean boundaries and independent team workstreams **without** distributed-
  systems overhead — frequently the pragmatic sweet spot [hardparts][newman].
- **What it costs.** Boundaries can still erode without discipline (enforce them in CI); it remains a
  single deploy and a shared failure domain.
- **Deeper.** Modules aligned to **bounded contexts** [ddd] give you most of microservices' *modularity*
  benefit and a clean **Strangler-Fig** [strangler] path to extraction later — extract a module into a
  service only when it demonstrably needs independent scaling or deployment [newman].

### Microservices

- **What.** Many independently deployable services, each owning its data, communicating over the network
  [fowlerMicro][newman].
- **When it fits.** Large, distributed organisations; parts with genuinely different scaling needs;
  mature DevOps. Strongest on **independent deployability and scalability** [dragoni][taibi].
- **What it costs.** Distributed-systems complexity: network failure, eventual consistency, distributed
  tracing, and heavy operational/infra overhead — repeatedly the top reported "pain" [soldani].
- **Deeper.** Benefits are real but **conditional on organisational maturity** [dragoni][soldani]. The
  classic failure mode is the **distributed monolith** — services that must deploy together (often via a
  shared database), paying distribution's cost for none of its benefit [taibi][newman]. Conway's Law
  applies: service boundaries tend to mirror team boundaries [fundamentals].

### Serverless (FaaS)

- **What.** Functions run on demand on managed infrastructure; scale-to-zero, pay-per-use.
- **When it fits.** Spiky or unpredictable load, event-driven glue, and small teams that want to avoid
  running servers [berkeleyServerless].
- **What it costs.** Cold-start latency, execution limits, harder local testing/observability, and
  **vendor lock-in**; cost can invert at sustained high volume [baldini][berkeleyServerless].
- **Deeper.** The Berkeley view [berkeleyServerless] frames FaaS as simplified cloud programming whose
  open problems are state, latency, and portability — excellent for bursty, stateless work; a poor fit
  for long-running, latency-critical, or stateful workloads.

---

## 3. Communication style (D2) — how the parts talk

Synchronous coupling trades simplicity for temporal coupling; asynchronous styles trade complexity for
resilience and scalability [eip][ddia].

- **Synchronous (request/response).** Simple and easy to reason about; strong temporal coupling — the
  caller waits and shares the callee's fate. Best when you truly need an immediate answer [fundamentals].
- **Async messaging (queues/brokers).** Decouples producer and consumer in time; buffers load and
  improves resilience, at the cost of harder end-to-end reasoning and delivery semantics (at-least-once,
  idempotency) [eip].
- **Event-driven (pub/sub).** Highly decoupled and scalable; components react to facts. Strong on
  extensibility, weaker on global ordering and consistency — you design for **eventual consistency**
  [ddia][hardparts].
- **Streaming.** Continuous, ordered event flows (e.g. logs, telemetry); high throughput and real-time
  processing, with real operational weight (partitioning, backpressure, reprocessing) [ddia].

**Deeper.** *Enterprise Integration Patterns* [eip] is the canonical catalogue here; Kleppmann [ddia]
gives the consistency/ordering foundations. Prefer **managed** brokers/streams first — the operational
burden is the usual regret.

---

## 4. Data management (D3) — where data lives and how it stays correct

The hardest reversibility lives in data. Distribution multiplies the difficulty of consistency [ddia].

- **Single shared database.** Simplest operations and **strong consistency** via transactions; but it
  couples every writer and blocks independent scaling — an anti-pattern *under* microservices
  [newman][taibi].
- **Database-per-service.** Each service owns its store, enabling independent deploy/scale; cross-service
  consistency becomes an application concern (sagas, outbox) rather than a transaction [newman][ddia].
- **CQRS (Command/Query Responsibility Segregation).** Separate read and write models so each scales and
  evolves independently; adds moving parts and (often) eventual consistency between them — use it
  **selectively**, not everywhere [cqrs][hardparts].
- **Event Sourcing.** Persist state as an append-only log of events — full audit trail and temporal
  queries; powerful but complex (versioning, replay, snapshotting), and easy to over-apply
  [eventsourcing][ddia].
- **Polyglot persistence.** Use the right store per job (relational, document, graph, search); optimises
  fit at the cost of more operational surfaces to run and understand [ddia].

**Deeper.** Kleppmann [ddia] is the reference for replication, partitioning, and consistency models;
CQRS and Event Sourcing are frequently **misapplied** far beyond the contexts that justify them
[cqrs][eventsourcing].

---

## 5. Code structure (D4) — how each deployable is organised inside

Independent of deployment, *internal* structure governs testability and change cost.

- **Hexagonal (Ports & Adapters).** Isolate domain logic behind ports; adapters handle IO/frameworks —
  highly testable, framework-agnostic core [hexagonal].
- **Clean Architecture.** Concentric layers with the **dependency rule** pointing inward to the domain;
  same intent as hexagonal, more prescriptive [clean].
- **Vertical Slice.** Organise by *feature* rather than by technical layer, cutting cross-layer coupling
  and improving change locality [fundamentals].
- **Layered.** Classic top-to-bottom layers — quick and familiar; can tangle as the domain grows
  (see D1 · Layered) [peaa].

**Deeper.** Hexagonal [hexagonal] and Clean [clean] both enforce that **business rules don't depend on
IO or frameworks**, which is what makes the core unit-testable and durable; DDD [ddd][implddd] supplies
the boundaries these structures protect.

---

## 6. Frontend architecture (D5) — how the UI is built and delivered

- **Micro-frontends.** Independently deployable UI pieces owned by different teams — team autonomy at
  the cost of browser weight and consistency effort; justified mainly at large team scale
  [microfrontends].
- **Single-page app (SPA).** One rich client app; excellent interactivity and one deployable, with
  weaker first-paint/SEO unless mitigated.
- **Server-rendered (SSR/SSG).** Render on the server (or at build time) for fast first paint and strong
  SEO; SSR adds runtime cost — prefer static/incremental rendering where possible [webvitals].

**Deeper.** The trade-off tracks **Core Web Vitals** [webvitals]: SSR/SSG win first-contentful-paint and
SEO; SPAs win rich interactivity; micro-frontends buy team independence you only need past a certain
organisational size [microfrontends][fundamentals].

---

## Bibliography

Standards, seminal books, and widely-recognised works. Books are cited by author/edition; where a
stable public link exists it is given.

- **[iso25010]** ISO/IEC 25010:2023, *Systems and software engineering — SQuaRE — Product quality model*. <https://www.iso.org/standard/78176.html>
- **[bass]** Bass, Clements & Kazman, *Software Architecture in Practice*, 4th ed., Addison-Wesley (SEI), 2021.
- **[fundamentals]** Richards & Ford, *Fundamentals of Software Architecture*, O'Reilly, 2020.
- **[hardparts]** Ford, Richards, Sadalage & Dehghani, *Software Architecture: The Hard Parts*, O'Reilly, 2021.
- **[newman]** Newman, *Building Microservices*, 2nd ed., O'Reilly, 2021.
- **[fowlerMicro]** Lewis & Fowler, "Microservices", martinfowler.com, 2014. <https://martinfowler.com/articles/microservices.html>
- **[fowlerMonolithFirst]** Fowler, "MonolithFirst", martinfowler.com, 2015. <https://martinfowler.com/bliki/MonolithFirst.html>
- **[strangler]** Fowler, "StranglerFigApplication", martinfowler.com, 2004. <https://martinfowler.com/bliki/StranglerFigApplication.html>
- **[ddia]** Kleppmann, *Designing Data-Intensive Applications*, O'Reilly, 2017.
- **[evoarch]** Ford, Parsons & Kua, *Building Evolutionary Architectures*, 2nd ed., O'Reilly, 2022. <https://evolutionaryarchitecture.com/>
- **[ddd]** Evans, *Domain-Driven Design*, Addison-Wesley, 2003.
- **[implddd]** Vernon, *Implementing Domain-Driven Design*, Addison-Wesley, 2013.
- **[clean]** Martin, *Clean Architecture*, Prentice Hall, 2017.
- **[hexagonal]** Cockburn, "Hexagonal Architecture (Ports & Adapters)", 2005. <https://alistair.cockburn.us/hexagonal-architecture/>
- **[eip]** Hohpe & Woolf, *Enterprise Integration Patterns*, Addison-Wesley, 2003.
- **[peaa]** Fowler, *Patterns of Enterprise Application Architecture*, Addison-Wesley, 2002.
- **[cqrs]** Fowler, "CQRS", martinfowler.com, 2011. <https://martinfowler.com/bliki/CQRS.html>
- **[eventsourcing]** Fowler, "Event Sourcing", martinfowler.com, 2005. <https://martinfowler.com/eaaDev/EventSourcing.html>
- **[atam]** Kazman, Klein & Clements, *ATAM: Method for Architecture Evaluation*, SEI, CMU/SEI-2000-TR-004, 2000. <https://insights.sei.cmu.edu/library/atam-method-for-architecture-evaluation/>
- **[add]** Wojcik et al., *Attribute-Driven Design (ADD), Version 2.0*, SEI, 2006. <https://insights.sei.cmu.edu/library/attribute-driven-design-add-version-20/>
- **[mavt]** Keeney & Raiffa, *Decisions with Multiple Objectives*, Cambridge University Press, 1993. <https://doi.org/10.1017/CBO9781139174084>
- **[dragoni]** Dragoni et al., "Microservices: Yesterday, Today, and Tomorrow", in *Present and Ulterior Software Engineering*, Springer, 2017. <https://doi.org/10.1007/978-3-319-67425-4_12>
- **[soldani]** Soldani, Tamburri & van den Heuvel, "The pains and gains of microservices: A systematic grey-literature review", *Journal of Systems and Software* 146, 2018. <https://doi.org/10.1016/j.jss.2018.09.082>
- **[taibi]** Taibi, Lenarduzzi & Pahl, "Architectural Patterns for Microservices: A Systematic Mapping Study", CLOSER, 2018. <https://doi.org/10.5220/0006798302210232>
- **[berkeleyServerless]** Jonas et al., "Cloud Programming Simplified: A Berkeley View on Serverless Computing", UC Berkeley, 2019. <https://arxiv.org/abs/1902.03383>
- **[baldini]** Baldini et al., "Serverless Computing: Current Trends and Open Problems", in *Research Advances in Cloud Computing*, Springer, 2017. <https://doi.org/10.1007/978-981-10-5026-8_1>
- **[microfrontends]** Geers, *Micro Frontends in Action*, Manning, 2020; Jackson, "Micro Frontends", martinfowler.com, 2019. <https://martinfowler.com/articles/micro-frontends.html>
- **[webvitals]** Google, *Web Vitals*, web.dev. <https://web.dev/articles/vitals>

---

| Version | Date | Notes |
|---|---|---|
| 0.1 | 2026-07-02 | Initial: method (ISO 25010 / ATAM / ADD / MAVT / fitness functions) + all five decisions (D1–D5) with What / When it fits / What it costs / Deeper, and a cited bibliography. Source for the architecture explanations in the in-app Manual / Guide (Section 5). |
