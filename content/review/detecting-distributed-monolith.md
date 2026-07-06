---
title_id: "Mendeteksi 'Distributed Monolith' Sebelum Ia Menyakitimu"
title_en: "Detecting the 'Distributed Monolith' Before It Hurts You"
slug: detecting-distributed-monolith
section: review
audience: [awam, expert]
summary_tldr_id: "Distributed monolith adalah kegagalan microservices paling klasik: layanan yang terpisah tetapi harus dideploy bersama — membayar seluruh biaya sistem terdistribusi tanpa satu pun manfaatnya. Kenali tandanya lewat basis data bersama, deploy yang terkopling, dan komunikasi sinkron yang berantai."
summary_tldr_en: "A distributed monolith is microservices' most classic failure: services that are split yet must deploy together — paying all the cost of a distributed system for none of its benefits. Spot it via a shared database, coupled deploys, and chatty synchronous chains."
evidence_strength: strong
last_reviewed: 2026-07-02
review_due: 2027-07-02
translation_status: en
related_advisor:
  dimensions: [D1, D3]
  options: [microservices, single-db]
sources:
  - { label: "Taibi & Lenarduzzi — On the Definition of Microservice Bad Smells", venue: "IEEE Software", year: 2018, url: "https://doi.org/10.1109/MS.2018.2141031" }
  - { label: "Taibi, Lenarduzzi & Pahl — Architectural Patterns for Microservices", venue: "CLOSER", year: 2018, url: "https://doi.org/10.5220/0006798302210232" }
  - { label: "Newman — Building Microservices, 2nd ed.", venue: "O'Reilly", year: 2021, url: "https://www.oreilly.com/library/view/building-microservices-2nd/9781492034018/" }
status: published
author: Architecture Advisor
---

## Why this matters

Many teams split their monolith into "microservices" and then wonder why everything got harder, not
easier. The cause is usually the same: they built a **distributed monolith**.

:::guided
**A simple analogy:** you move the kitchen, living room, and bedroom into separate buildings — but
they still share one light switch and one door. Now you have all the complexity of separate
buildings, and none of the freedom.
:::

## Warning-sign checklist

- [ ] Several services **share one database** (or the same tables).
- [ ] One change regularly **forces several services to deploy together**.
- [ ] Common flows are **long synchronous call chains** across services.
- [ ] Services **cannot be released or scaled independently**.
- [ ] Teams must coordinate tightly for almost every change.

The more boxes you tick, the more likely you have a distributed monolith.

:::expert
**Deeper.** The most common hidden root cause is the **shared database** — it quietly re-couples
services that were meant to be independent. The fix: separate data ownership
(*database-per-service*), replace cross-service transactions with **sagas** + the **transactional
outbox**, and reduce synchronous chains with asynchronous events. Taibi & Lenarduzzi provide
testable *bad-smell* definitions; empirically, the distributed monolith consistently ranks as the
top anti-pattern.
:::

## Try it in the Advisor

The **Advisor** flags this combination through its **anti-pattern warnings** (e.g. microservices on
top of one shared database). Test your scenario and see whether the warning appears.
