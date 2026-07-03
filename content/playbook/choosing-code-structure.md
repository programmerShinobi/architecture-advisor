---
title_id: "Memilih Struktur Kode (D4): Hexagonal, Clean, atau Vertical Slice"
title_en: "Choosing Code Structure (D4): Hexagonal, Clean, or Vertical Slice"
slug: choosing-code-structure
section: playbook
audience: [awam, expert]
summary_tldr_id: "Terlepas dari cara deploy, struktur internal menentukan seberapa mudah kode diuji dan diubah. Hexagonal dan Clean menjaga logika bisnis bebas dari framework/IO. Vertical Slice menata per fitur agar perubahan terlokalisasi. Berlapis itu cepat tapi bisa kusut. Pilih yang menjaga inti tetap dapat diuji tanpa seremoni berlebih."
summary_tldr_en: "Independent of deployment, internal structure governs how easily code is tested and changed. Hexagonal and Clean keep business logic free of frameworks/IO. Vertical Slice organises by feature for change locality. Layered is quick but can tangle. Pick the one that keeps the core testable without excess ceremony."
evidence_strength: strong
last_reviewed: 2026-07-02
review_due: 2027-07-02
translation_status: id
related_advisor:
  dimensions: [D4]
  options: [hexagonal, clean, vertical-slice, layered]
sources:
  - { label: "Cockburn — Hexagonal Architecture (Ports & Adapters)", venue: "alistair.cockburn.us", year: 2005, url: "https://alistair.cockburn.us/hexagonal-architecture/" }
  - { label: "Martin — Clean Architecture", venue: "Prentice Hall", year: 2017, url: "https://www.oreilly.com/library/view/clean-architecture-a/9780134494272/" }
  - { label: "Evans — Domain-Driven Design", venue: "Addison-Wesley", year: 2003, url: "https://www.domainlanguage.com/ddd/" }
  - { label: "Bogard — Vertical Slice Architecture", venue: "jimmybogard.com", year: 2018, url: "https://www.jimmybogard.com/vertical-slice-architecture/" }
  - { label: "Fowler — Patterns of Enterprise Application Architecture", venue: "Addison-Wesley", year: 2002, url: "https://martinfowler.com/books/eaa.html" }
status: published
author: Architecture Advisor
---

## Yang sebenarnya diatur D4

D4 bukan soal berapa aplikasi yang kamu deploy, melainkan **bagaimana kode ditata di dalam** satu
aplikasi — dan itu menentukan biaya perubahan serta keterujian.

:::guided
- **Hexagonal (Ports & Adapters):** kurung logika inti; framework & database jadi "colokan" di tepi.
  Inti sangat mudah diuji.
- **Clean Architecture:** lapisan konsentris dengan aturan "ketergantungan mengarah ke dalam". Niat
  sama dengan hexagonal, lebih preskriptif.
- **Vertical Slice:** tata per **fitur**, bukan per lapisan teknis — satu fitur hidup di satu tempat.
- **Berlapis:** klasik dan akrab; bisa kusut saat domain tumbuh.
:::

## Panduan singkat

- Butuh inti bebas-framework yang awet & teruji → **Hexagonal** atau **Clean**.
- Tim kecil, ingin perubahan terlokalisasi per fitur → **Vertical Slice**.
- Domain kecil/stabil, ingin cepat → **Berlapis** (waspadai erosi).

:::expert
**Lebih dalam.** Hexagonal dan Clean sama-sama menegakkan bahwa **aturan bisnis tidak bergantung pada
IO/framework** — itulah yang membuat inti dapat diuji-unit dan tahan lama; DDD menyediakan *bounded
context* yang dilindungi struktur ini. Vertical Slice mengoptimalkan cara perangkat lunak benar-benar
berubah (per fitur), kebalikan dari kelemahan berlapis. Jangan memaksakan seremoni Clean pada aplikasi
kecil — biayanya bisa melebihi manfaat.
:::

## Coba di Advisor

Di Advisor, D4 dinilai independen dari D1 — lihat bagaimana faktor seperti *maintainability* dan
*testability* menaikkan pilihan yang menjaga inti tetap bersih.
