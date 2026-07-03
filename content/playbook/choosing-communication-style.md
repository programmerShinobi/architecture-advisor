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
translation_status: id
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

## Pertanyaan intinya

Apakah pemanggil **harus menunggu** jawaban sekarang, atau cukup **memberi tahu** dan melanjutkan?

:::guided
- **Sinkron (minta–jawab):** seperti menelепon dan menunggu di telepon. Sederhana, tetapi kalau yang
  ditelepon lambat atau mati, kamu ikut terjebak.
- **Asinkron (pesan):** seperti mengirim pesan singkat — yang dituju membalas saat siap. Lebih tahan
  banting, tapi lebih sulit melacak alurnya.
- **Berbasis peristiwa:** kamu mengumumkan "ini terjadi", dan siapa pun yang berkepentingan bereaksi.
  Sangat longgar dan mudah diperluas.
:::

## Kapan memakai yang mana

- Butuh jawaban seketika untuk melanjutkan → **sinkron**.
- Menyangga lonjakan beban, kerja latar, integrasi antar-sistem → **asinkron**.
- Banyak konsumen yang bereaksi atas fakta yang sama, perlu mudah diperluas → **event-driven**.
- Aliran data terus-menerus dan real-time (log, telemetri) → **streaming**.

:::expert
**Lebih dalam.** Kopling sinkron itu *temporal*: latensi dan kegagalan menumpuk sepanjang rantai
panggilan — pasang timeout, retry idempoten, dan circuit breaker. Gaya asinkron menuntut memikirkan
semantik pengiriman (at-least-once), idempotensi, dan pengurutan; *Enterprise Integration Patterns*
adalah katalog kanoniknya, sementara Kleppmann memberi fondasi konsistensi/pengurutan. Rancang untuk
**konsistensi eventual** secara sengaja, bukan sebagai kejutan.
:::

## Coba di Advisor

Di **Advisor**, faktor seperti *real-time* dan *async* menggeser rekomendasi **D2** — lihat radar
trade-off untuk membandingkan gaya komunikasi pada skenariomu.
