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
translation_status: id+en
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

<!-- lang:id -->

## Kapan tinjauan ini dibutuhkan

Setiap kali sebuah alur menyentuh data di **lebih dari satu layanan/basis data**. Di sinilah banyak
sistem terdistribusi diam-diam menjadi tidak benar.

:::guided
**Sebuah analogi:** memesan tiket + kursi + pembayaran di tiga loket terpisah. Tak ada "batalkan
semuanya" secara ajaib — jika satu langkah gagal, kamu harus **membatalkan langkah yang sudah terjadi**.
Itulah inti sebuah saga.
:::

## Checklist tinjauan

- [ ] Alur lintas-layanan memakai **saga** (koreografi atau orkestrasi), bukan transaksi terdistribusi.
- [ ] Setiap langkah punya **kompensasi** jika langkah berikutnya gagal.
- [ ] "Simpan data + publikasikan event" memakai **transactional outbox** (tak pernah bisa menyimpang).
- [ ] Konsumer **idempoten** (aman diproses ulang; pengiriman biasanya at-least-once).
- [ ] **Jendela konsistensi eventual** dipahami dan dapat diterima bisnis.
- [ ] Tak ada **basis data bersama** yang diam-diam memunculkan kembali kopling (lihat distributed monolith).

:::expert
**Lebih dalam.** Richardson mengkatalogkan saga + outbox + komposisi API; Kleppmann menyediakan fondasi
konsistensi/pengurutan. Orkestrasi (satu koordinator) lebih mudah dinalar tapi memusatkan logika;
koreografi (berbasis event) lebih longgar tapi alurnya menjadi muncul-sendiri dan lebih sulit di-debug
— investasikan pada tracing dan skema event. Event sourcing bisa menjadikan "event" sebagai sumber
kebenaran, dengan biaya evolusi skema.
:::

## Coba di Advisor

Faktor *consistency* dan pilihan **D3** memunculkan peringatan anti-pattern di Advisor saat kombinasi
data berisiko — gunakan itu sebagai pemicu tinjauan ini.
