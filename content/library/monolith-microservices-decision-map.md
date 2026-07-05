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
translation_status: id
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

## Petanya, satu layar

```
Mulai baru? ──────────────► MONOLITH (satu deploy, satu DB, modul rapi sejak awal)
      │
      ▼ tim saling injak / build lambat?
MODULAR MONOLITH (batas modul ditegakkan CI, per bounded context)
      │
      ▼ ada bagian yang BUTUH skala/deploy/tim mandiri + DevOps matang?
EKSTRAK LAYANAN ITU SAJA (Strangler Fig; data ikut dimiliki layanan)
      │
      ▼ beban bergelombang, stateless, toleran cold-start?
SERVERLESS untuk tepi ber-burst (fungsi kecil, keadaan di layanan terkelola)
```

:::guided
**Cara membacanya:** turun satu anak tangga hanya ketika **sakitnya nyata** — bukan karena tren.
Setiap anak tangga menambah biaya operasional yang permanen.
:::

## Sinyal untuk tiap langkah

| Langkah | Sinyal "waktunya" | Sinyal "jangan dulu" |
|---|---|---|
| Tetap monolith | produk belum terbukti; tim ≤ ~8 | — |
| → Modular monolith | konflik merge sering; domain mulai jelas | batas domain masih berubah-ubah |
| → Ekstrak layanan | satu modul dominan beban/rilisnya | belum ada CI/CD + observability |
| → Serverless di tepi | trafik burst; kerja event-driven | jalur kritis-latensi; stateful berat |

:::expert
**Lebih dalam.** Klasifikasi refactoring (Fritzsch et al.) menunjukkan ekstraksi inkremental
per-bounded-context adalah jalur yang paling sering berhasil; tinjauan sistematis (Soldani et al.)
menempatkan kompleksitas operasional dan konsistensi data sebagai "pain" dominan — keduanya biaya
tetap begitu kamu terdistribusi. Aturan emas Newman: *jangan pecah basis datanya belakangan* —
kepemilikan data ikut layanan sejak ekstraksi pertama (saga/outbox menggantikan transaksi lintas
layanan; lihat artikel Review "Konsistensi Data"). Kembali satu langkah (merge layanan yang terlalu
halus) adalah keputusan sah — arah panah peta ini dua arah.
:::

## Coba di Advisor

Isi faktor proyekmu di **Advisor** — peringkat **D1** + kartu **jalur migrasi** pada dasarnya
menempatkanmu di salah satu anak tangga peta ini, lengkap dengan alasannya.
