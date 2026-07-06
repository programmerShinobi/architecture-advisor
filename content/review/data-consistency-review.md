---
title_id: "Review Konsistensi Data: Saga, Outbox, dan Konsistensi Eventual"
title_en: "Reviewing Data Consistency: Saga, Outbox, and Eventual Consistency"
slug: data-consistency-review
section: review
audience: [awam, expert]
summary_tldr_id: "Begitu data terpecah di banyak layanan, kamu kehilangan transaksi tunggal. Pola saga mengoordinasi langkah lintas-layanan dengan kompensasi; transactional outbox memastikan 'simpan lalu terbitkan peristiwa' tidak pernah terpisah. Kuncinya: rangkul konsistensi eventual secara sengaja, bukan sebagai kejutan."
summary_tldr_en: "Once data is split across services, you lose the single transaction. The saga pattern coordinates cross-service steps with compensations; the transactional outbox ensures 'save then publish an event' never drift apart. The key: embrace eventual consistency deliberately, not as a surprise."
evidence_strength: strong
last_reviewed: 2026-07-02
review_due: 2027-07-02
translation_status: en
related_advisor:
  dimensions: [D3]
  options: [db-per-service, single-db, event-sourcing]
sources:
  - { label: "Richardson — Pattern: Saga", venue: "microservices.io", year: 2019, url: "https://microservices.io/patterns/data/saga.html" }
  - { label: "Richardson — Microservices Patterns", venue: "Manning", year: 2018, url: "https://www.manning.com/books/microservices-patterns" }
  - { label: "Kleppmann — Designing Data-Intensive Applications", venue: "O'Reilly", year: 2017, url: "https://dataintensive.net/" }
  - { label: "Newman — Building Microservices, 2nd ed.", venue: "O'Reilly", year: 2021, url: "https://www.oreilly.com/library/view/building-microservices-2nd/9781492034018/" }
status: published
author: Architecture Advisor
---

## When this review is needed

Any time a flow touches data in **more than one service/database**. This is where many distributed
systems quietly become incorrect.

:::guided
**An analogy:** booking a ticket + a seat + the payment at three separate counters. There is no
magic "cancel everything" — if one step fails, you must **undo the steps that already happened**.
That is the essence of a saga.
:::

## Review checklist

- [ ] Cross-service flows use a **saga** (choreography or orchestration), not distributed
      transactions.
- [ ] Every step has a **compensation** in case a later step fails.
- [ ] "Save data + publish an event" uses the **transactional outbox** (they can never drift apart).
- [ ] Consumers are **idempotent** (safe to reprocess; delivery is usually at-least-once).
- [ ] The **eventual-consistency window** is understood and acceptable to the business.
- [ ] No **shared database** quietly reintroducing coupling (see the distributed monolith).

:::expert
**Deeper.** Richardson catalogues sagas + the outbox + API composition; Kleppmann provides the
consistency/ordering foundations. Orchestration (one coordinator) is easier to reason about but
centralises logic; choreography (event-based) is looser but the flow becomes emergent and harder to
debug — invest in tracing and event schemas. Event sourcing can make "the events" the source of
truth, at the cost of schema evolution.
:::

## Try it in the Advisor

The *consistency* factor and the **D3** choice light up anti-pattern warnings in the Advisor when a
data combination is risky — use them as the trigger for this review.
