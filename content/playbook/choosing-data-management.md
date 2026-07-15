---
title_id: "Memilih Pengelolaan Data (D3): dari Satu DB ke Polyglot"
title_en: "Choosing Data Management (D3): from One DB to Polyglot"
slug: choosing-data-management
section: playbook
audience: [awam, expert]
summary_tldr_id: "Data adalah keputusan yang paling sulit dibalik. Satu basis data bersama itu paling sederhana dan konsisten, tapi mengopling semua penulis. Database-per-service, CQRS, event sourcing, dan polyglot menukar kesederhanaan itu dengan kemandirian dan kecocokan — dengan biaya konsistensi eventual. Pisahkan data hanya saat benar-benar perlu."
summary_tldr_en: "Data is the hardest decision to reverse. A single shared database is simplest and consistent but couples every writer. Database-per-service, CQRS, event sourcing, and polyglot trade that simplicity for independence and fit — at the cost of eventual consistency. Split data only when you truly must."
evidence_strength: strong
last_reviewed: 2026-07-02
review_due: 2027-07-02
translation_status: id+en
related_advisor:
  dimensions: [D3]
  options: [single-db, db-per-service, cqrs, event-sourcing, polyglot]
sources:
  - { label: "Kleppmann — Designing Data-Intensive Applications", venue: "O'Reilly", year: 2017, url: "https://dataintensive.net/" }
  - { label: "Richardson — Microservices Patterns", venue: "Manning", year: 2018, url: "https://www.manning.com/books/microservices-patterns" }
  - { label: "Laigner et al. — Data Management in Microservices: State of the Practice", venue: "VLDB", year: 2021, url: "https://doi.org/10.14778/3484224.3484232" }
  - { label: "Fowler — CQRS", venue: "martinfowler.com", year: 2011, url: "https://martinfowler.com/bliki/CQRS.html" }
  - { label: "Fowler — Event Sourcing", venue: "martinfowler.com", year: 2005, url: "https://martinfowler.com/eaaDev/EventSourcing.html" }
  - { label: "Newman — Building Microservices, 2nd ed.", venue: "O'Reilly", year: 2021, url: "https://www.oreilly.com/library/view/building-microservices-2nd/9781492034018/" }
status: published
author: Architecture Advisor
---

## Why data is the critical decision

You can swap a language or a framework, but changing how data is owned and kept consistent is far
more expensive. That is why D3 deserves the most care.

:::guided
- **Single shared database:** every part reads/writes one place. Simplest, and "immediately correct"
  comes for free — but everything is coupled.
- **Database-per-service:** each service owns its data. Independent, but keeping data consistent
  across services becomes the application's job.
- **CQRS:** separate the *write* model from the *read* model when their loads differ sharply.
- **Event sourcing:** store history as a list of events — a complete audit trail, but complex.
- **Polyglot:** use the right kind of database for each need.
:::

## A short guide

- Small system / one team → **single database** (don't split without a reason).
- Services that genuinely need independence → **database-per-service** (+ sagas/outbox).
- Reads and writes scale very differently → **CQRS** on that slice only.
- History *is* the domain (finance, audit) → **event sourcing**.
- Sharply divergent access patterns → **polyglot** (know the operational cost).

:::expert
**Deeper.** Kleppmann is the reference for replication, partitioning, and consistency models. In a
microservices world, replace cross-service transactions with **sagas** + the **transactional
outbox** and embrace eventual consistency deliberately. CQRS and event sourcing are **commonly
over-applied** — use them selectively on the parts that truly demand them. The empirical study
(Laigner et al.) confirms per-service data is the hardest part of microservices in practice.
:::

## Try it in the Advisor

Factors such as *dataVolume* and *consistency* shift the **D3** recommendation in the Advisor —
check the radar and the anti-pattern warnings (e.g. microservices on top of one shared database).

<!-- lang:id -->

## Mengapa data adalah keputusan kritis

Kamu bisa mengganti bahasa atau framework, tapi mengubah cara data dimiliki dan dijaga konsisten jauh
lebih mahal. Itulah sebabnya D3 layak mendapat perhatian paling besar.

:::guided
- **Basis data tunggal bersama:** setiap bagian membaca/menulis ke satu tempat. Paling sederhana, dan
  "langsung benar" didapat gratis — tapi semuanya terkopling.
- **Database-per-service:** tiap layanan memiliki datanya. Independen, tapi menjaga data konsisten
  antar-layanan menjadi tugas aplikasi.
- **CQRS:** pisahkan model *tulis* dari model *baca* saat bebannya berbeda tajam.
- **Event sourcing:** simpan riwayat sebagai daftar event — jejak audit lengkap, tapi kompleks.
- **Polyglot:** pakai jenis basis data yang tepat untuk tiap kebutuhan.
:::

## Panduan singkat

- Sistem kecil / satu tim → **basis data tunggal** (jangan memecah tanpa alasan).
- Layanan yang benar-benar butuh kemandirian → **database-per-service** (+ saga/outbox).
- Baca dan tulis menskala sangat berbeda → **CQRS** hanya pada irisan itu.
- Riwayat *adalah* domainnya (keuangan, audit) → **event sourcing**.
- Pola akses yang sangat berbeda → **polyglot** (ketahui biaya operasionalnya).

:::expert
**Lebih dalam.** Kleppmann adalah rujukan untuk replikasi, partisi, dan model konsistensi. Dalam dunia
microservices, ganti transaksi lintas-layanan dengan **saga** + **transactional outbox** dan rangkul
konsistensi eventual secara sengaja. CQRS dan event sourcing **umum diterapkan berlebihan** — pakai
secara selektif pada bagian yang benar-benar menuntutnya. Studi empiris (Laigner dkk.) menegaskan data
per-layanan adalah bagian tersulit microservices dalam praktik.
:::

## Coba di Advisor

Faktor seperti *dataVolume* dan *consistency* menggeser rekomendasi **D3** di Advisor — periksa radar dan
peringatan anti-pattern (mis. microservices di atas satu basis data bersama).
