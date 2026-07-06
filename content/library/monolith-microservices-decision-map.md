---
title_id: "Peta Keputusan Monolith → Microservices: Kapan Bertahan, Modularisasi, atau Memecah"
title_en: "The Monolith → Microservices Decision Map: When to Stay, Modularize, or Split"
slug: monolith-microservices-decision-map
section: library
audience: [awam, expert]
summary_tldr_id: "Ini bukan pilihan biner. Peta keputusannya: (1) baru mulai → monolith; (2) tim mulai saling menginjak → modular monolith; (3) ada bagian yang benar-benar butuh skala/deploy mandiri DAN operasional matang → ekstrak layanan itu saja (Strangler Fig); (4) beban bergelombang tanpa keadaan → pertimbangkan serverless. Distribusi adalah biaya yang dibeli untuk kebutuhan spesifik — bukan tujuan."
summary_tldr_en: "It's not a binary choice. The map: (1) starting out → monolith; (2) teams stepping on each other → modular monolith; (3) a part truly needs independent scale/deploys AND ops are mature → extract just that service (Strangler Fig); (4) spiky stateless load → consider serverless. Distribution is a cost you buy for specific needs — not a goal."
evidence_strength: strong
last_reviewed: 2026-07-05
review_due: 2027-07-05
translation_status: en
related_advisor:
  dimensions: [D1]
  options: [monolith, modular-monolith, microservices, serverless]
sources:
  - { label: "Fowler — MonolithFirst", venue: "martinfowler.com", year: 2015, url: "https://martinfowler.com/bliki/MonolithFirst.html" }
  - { label: "Newman — Monolith to Microservices", venue: "O'Reilly", year: 2019, url: "https://www.oreilly.com/library/view/monolith-to-microservices/9781492047834/" }
  - { label: "Fritzsch et al. — From Monolith to Microservices: A Classification of Refactoring Approaches", venue: "Springer", year: 2019, url: "https://doi.org/10.1007/978-3-030-06019-0_10" }
  - { label: "Soldani et al. — The pains and gains of microservices", venue: "Journal of Systems and Software", year: 2018, url: "https://doi.org/10.1016/j.jss.2018.09.082" }
  - { label: "Richardson — Microservices Patterns", venue: "Manning", year: 2018, url: "https://www.manning.com/books/microservices-patterns" }
status: published
author: Architecture Advisor
---

## The map, on one screen

```
Starting fresh? ──────────► MONOLITH (one deploy, one DB, tidy modules from day one)
      │
      ▼ teams stepping on each other / slow builds?
MODULAR MONOLITH (module boundaries enforced in CI, per bounded context)
      │
      ▼ one part NEEDS independent scale/deploys/teams + mature DevOps?
EXTRACT JUST THAT SERVICE (Strangler Fig; the data moves with the service)
      │
      ▼ spiky, stateless, cold-start-tolerant load?
SERVERLESS for the bursty edges (small functions, state in managed services)
```

:::guided
**How to read it:** step down one rung only when **the pain is real** — not because of the trend.
Every rung adds permanent operational cost.
:::

## Signals for each step

| Step | "It's time" signals | "Not yet" signals |
|---|---|---|
| Stay monolith | product unproven; team ≤ ~8 | — |
| → Modular monolith | frequent merge conflicts; domain taking shape | domain boundaries still churning |
| → Extract a service | one module dominates load/releases | no CI/CD + observability yet |
| → Serverless at the edge | bursty traffic; event-driven work | latency-critical paths; heavy state |

:::expert
**Deeper.** The refactoring classification (Fritzsch et al.) shows incremental,
per-bounded-context extraction is the path that most often succeeds; the systematic review
(Soldani et al.) ranks operational complexity and data consistency as the dominant "pains" — both
are fixed costs once you distribute. Newman's golden rule: *don't split the database later* — data
ownership moves with the service from the first extraction (sagas/outbox replace cross-service
transactions; see the Review article "Reviewing Data Consistency"). Stepping back up (merging
over-fine services) is a legitimate decision — this map's arrows run both ways.
:::

## Try it in the Advisor

Fill in your project factors in the **Advisor** — the **D1** ranking + the **migration path** card
essentially place you on one of this map's rungs, reasons included.
