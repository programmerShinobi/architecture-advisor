---
title_id: "Memilih Gaya Komunikasi (D2): Sinkron, Asinkron, atau Event"
title_en: "Choosing a Communication Style (D2): Sync, Async, or Events"
slug: choosing-communication-style
section: playbook
audience: [awam, expert]
summary_tldr_id: "Sinkron itu sederhana tapi mengikat pemanggil pada nasib yang dipanggil. Asinkron dan berbasis peristiwa melepas kopling itu — lebih tahan banting dan mudah diskalakan — dengan menukar kesederhanaan menjadi konsistensi eventual. Pilih sinkron saat butuh jawaban seketika; asinkron saat butuh ketahanan."
summary_tldr_en: "Synchronous is simple but ties the caller to the callee's fate. Async and event-driven remove that coupling — more resilient and scalable — trading simplicity for eventual consistency. Pick sync when you need an immediate answer; async when you need resilience."
evidence_strength: strong
last_reviewed: 2026-07-02
review_due: 2027-07-02
translation_status: en
related_advisor:
  dimensions: [D2]
  options: [synchronous, async-messaging, event-driven, streaming]
sources:
  - { label: "Hohpe & Woolf — Enterprise Integration Patterns", venue: "Addison-Wesley", year: 2003, url: "https://www.enterpriseintegrationpatterns.com/" }
  - { label: "Kleppmann — Designing Data-Intensive Applications", venue: "O'Reilly", year: 2017, url: "https://dataintensive.net/" }
  - { label: "Newman — Building Microservices, 2nd ed.", venue: "O'Reilly", year: 2021, url: "https://www.oreilly.com/library/view/building-microservices-2nd/9781492034018/" }
status: published
author: Architecture Advisor
---

## The core question

Does the caller **have to wait** for an answer right now, or is it enough to **notify** and move on?

:::guided
- **Synchronous (request–response):** like phoning someone and waiting on the line. Simple, but if
  the person you called is slow or unreachable, you are stuck too.
- **Asynchronous (messaging):** like sending a text message — the recipient replies when ready. More
  resilient, but the flow is harder to trace.
- **Event-driven:** you announce "this happened", and whoever cares reacts. Very loosely coupled and
  easy to extend.
:::

## When to use which

- You need an immediate answer to continue → **synchronous**.
- Buffering load spikes, background work, cross-system integration → **async messaging**.
- Many consumers reacting to the same fact, easy extensibility → **event-driven**.
- Continuous, real-time data flows (logs, telemetry) → **streaming**.

:::expert
**Deeper.** Synchronous coupling is *temporal*: latency and failures accumulate along the call
chain — add timeouts, idempotent retries, and circuit breakers. Async styles force you to think
about delivery semantics (at-least-once), idempotency, and ordering; *Enterprise Integration
Patterns* is the canonical catalogue, while Kleppmann provides the consistency/ordering
foundations. Design for **eventual consistency** deliberately, not as a surprise.
:::

## Try it in the Advisor

In the **Advisor**, factors such as *real-time* and *async* shift the **D2** recommendation — check
the trade-off radar to compare communication styles for your scenario.
