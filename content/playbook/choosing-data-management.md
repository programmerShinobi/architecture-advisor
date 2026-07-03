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
translation_status: id
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

## Kenapa data itu genting

Kamu bisa mengganti bahasa atau framework, tetapi mengubah cara data dimiliki dan dijaga konsisten
jauh lebih mahal. Karena itu, putuskan D3 dengan hati-hati.

:::guided
- **Satu basis data bersama:** semua bagian membaca/menulis ke satu tempat. Paling sederhana, dan
  "benar seketika" itu mudah — tetapi semua ikut terkopling.
- **Database-per-service:** tiap layanan punya datanya sendiri. Mandiri, tetapi menjaga data lintas
  layanan tetap cocok jadi urusan aplikasi.
- **CQRS:** pisahkan model *menulis* dari model *membaca* saat keduanya sangat berbeda bebannya.
- **Event Sourcing:** simpan riwayat sebagai daftar peristiwa — audit lengkap, tapi rumit.
- **Polyglot:** pakai jenis basis data yang tepat untuk tiap kebutuhan.
:::

## Panduan singkat

- Sistem kecil / satu tim → **satu basis data** (jangan memecah tanpa alasan).
- Layanan yang benar-benar butuh mandiri → **database-per-service** (+ saga/outbox).
- Baca dan tulis sangat berbeda skalanya → **CQRS** pada irisan itu saja.
- Riwayat adalah domainnya (keuangan, audit) → **event sourcing**.
- Pola akses beragam tajam → **polyglot** (sadari biaya operasionalnya).

:::expert
**Lebih dalam.** Kleppmann adalah rujukan untuk replikasi, partisi, dan model konsistensi. Di dunia
microservices, ganti transaksi lintas-layanan dengan **saga** + **transactional outbox** dan rangkul
konsistensi eventual secara sengaja. CQRS dan event sourcing **sering diterapkan berlebihan** — pakai
selektif pada bagian yang benar-benar menuntutnya. Studi empiris (Laigner et al.) menegaskan data
per-layanan adalah bagian tersulit dari microservices dalam praktik.
:::

## Coba di Advisor

Faktor seperti *dataVolume* dan *consistency* menggeser rekomendasi **D3** di Advisor — lihat radar
dan peringatan anti-pattern (mis. microservices di atas satu basis data bersama).
