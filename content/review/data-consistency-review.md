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
translation_status: id
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

## Kapan review ini dibutuhkan

Setiap kali sebuah alur menyentuh data di **lebih dari satu layanan/basis data**. Di sinilah banyak
sistem terdistribusi diam-diam menjadi tidak benar.

:::guided
**Analogi:** memesan tiket + kursi + pembayaran di tiga loket berbeda. Tidak ada satu "batalkan semua"
ajaib — jika satu gagal, kamu harus **membatalkan langkah yang sudah terjadi**. Itulah inti saga.
:::

## Checklist review

- [ ] Alur lintas-layanan memakai **saga** (koreografi atau orkestrasi), bukan transaksi terdistribusi.
- [ ] Tiap langkah punya **kompensasi** bila langkah berikutnya gagal.
- [ ] "Simpan data + terbitkan peristiwa" memakai **transactional outbox** (tak pernah terpisah).
- [ ] Konsumen bersifat **idempoten** (aman diproses ulang; pengiriman biasanya at-least-once).
- [ ] Jendela **konsistensi eventual** dipahami dan dapat diterima bisnis.
- [ ] Tidak ada **basis data bersama** yang diam-diam mengembalikan kopling (lihat distributed monolith).

:::expert
**Lebih dalam.** Richardson mengkatalogkan saga + outbox + API composition; Kleppmann memberi fondasi
konsistensi/pengurutan. Orkestrasi (satu koordinator) lebih mudah dipahami tetapi memusatkan logika;
koreografi (berbasis peristiwa) lebih longgar tetapi alur muncul secara emergent dan sulit di-debug —
investasikan pada tracing dan skema peristiwa. Event sourcing dapat menjadikan "peristiwa" sebagai
sumber kebenaran, dengan biaya evolusi skema.
:::

## Coba di Advisor

Faktor *consistency* dan pilihan **D3** di Advisor menyalakan peringatan anti-pattern saat kombinasi
data berisiko — pakai sebagai pemicu review ini.
