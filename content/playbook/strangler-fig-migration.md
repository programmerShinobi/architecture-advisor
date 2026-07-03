---
title_id: "Strangler Fig: Migrasi Monolith ke Microservices Tanpa Big Bang"
title_en: "Strangler Fig: Migrating a Monolith to Microservices Without a Big Bang"
slug: strangler-fig-migration
section: playbook
audience: [awam, expert]
summary_tldr_id: "Jangan menulis ulang sistem sekaligus. Pola Strangler Fig mengekstrak satu kemampuan pada satu waktu ke layanan baru, mengalihkan trafik bertahap, sampai monolith lama 'tercekik' dan bisa dipensiunkan — risiko kecil, nilai lebih cepat."
summary_tldr_en: "Don't rewrite the whole system at once. The Strangler Fig pattern extracts one capability at a time into a new service, shifts traffic gradually, until the old monolith is 'strangled' and can be retired — low risk, earlier value."
evidence_strength: strong
last_reviewed: 2026-07-02
review_due: 2027-07-02
translation_status: id
related_advisor:
  dimensions: [D1]
  options: [monolith, modular-monolith, microservices]
sources:
  - { label: "Fowler — StranglerFigApplication", venue: "martinfowler.com", year: 2004, url: "https://martinfowler.com/bliki/StranglerFigApplication.html" }
  - { label: "Newman — Monolith to Microservices", venue: "O'Reilly", year: 2019, url: "https://www.oreilly.com/library/view/monolith-to-microservices/9781492047834/" }
  - { label: "Fritzsch et al. — From Monolith to Microservices: A Classification of Refactoring Approaches", venue: "Springer", year: 2019, url: "https://doi.org/10.1007/978-3-030-06019-0_10" }
status: published
author: Architecture Advisor
---

## Masalahnya

Menulis ulang sistem besar sekaligus ("big bang rewrite") adalah salah satu cara paling terkenal
untuk gagal: mahal, lama, dan berisiko tinggi karena tidak ada nilai sampai semuanya selesai.

:::guided
**Ide sederhananya:** bayangkan pohon ara pencekik yang tumbuh perlahan mengelilingi pohon inang.
Alih-alih menebang pohon lama, kita menumbuhkan yang baru **sepotong demi sepotong** di sekitarnya,
sampai akhirnya pohon lama tidak lagi dibutuhkan.
:::

## Langkah pola Strangler Fig

1. **Pasang "penyadap" (facade/proxy)** di depan monolith agar trafik bisa dialihkan per-rute.
2. **Pilih satu kemampuan** yang bernilai dan batasnya jelas untuk diekstrak lebih dulu.
3. **Bangun layanan baru** untuk kemampuan itu; alihkan trafiknya lewat facade.
4. **Ulangi** kemampuan demi kemampuan, selalu bisa dibatalkan (rollback) bila bermasalah.
5. **Pensiunkan** bagian monolith yang sudah tergantikan.

:::expert
**Lebih dalam.** Prasyaratnya adalah **batas yang benar** — ekstrak sepanjang *bounded context*,
bukan sepanjang lapisan teknis; keluar dari satu basis data bersama biasanya bagian tersulit
(butuh pola seperti *transactional outbox* dan *saga*). Sering kali **modular monolith** adalah
langkah antara yang bijak: tegakkan batas modul dulu di dalam satu proses, buktikan, baru ekstrak
yang benar-benar butuh skala/deploy mandiri. Studi klasifikasi refactoring (Fritzsch et al.)
menunjukkan pendekatan bertahap jauh lebih aman daripada rewrite.
:::

## Coba di Advisor

Jalankan **Advisor** untuk sistem lamamu (pilih profil "sudah punya sistem") — lihat rekomendasi
D1 dan **kartu jalur migrasi** yang menyarankan rute bertahap, bukan lompatan besar.
