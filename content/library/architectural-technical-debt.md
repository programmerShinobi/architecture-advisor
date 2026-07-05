---
title_id: "Utang Teknis Arsitektural: Metafora yang Sering Disalahpahami"
title_en: "Architectural Technical Debt: The Often-Misunderstood Metaphor"
slug: architectural-technical-debt
section: library
audience: [awam, expert]
summary_tldr_id: "Utang teknis bukan sekadar 'kode jelek' — pada level arsitektur, ia adalah kompromi struktural yang disengaja (atau tidak) yang bunga-nya dibayar setiap kali kamu mengubah sistem. Yang penting bukan nol utang, melainkan utang yang terlihat, tercatat, dan dikelola — persis seperti pinjaman finansial."
summary_tldr_en: "Technical debt isn't just 'bad code' — at the architecture level it's a structural compromise (deliberate or not) whose interest you pay on every change. The goal isn't zero debt but debt that is visible, recorded, and managed — exactly like a financial loan."
evidence_strength: strong
last_reviewed: 2026-07-05
review_due: 2027-07-05
translation_status: id
related_advisor:
  dimensions: [D1, D4]
  options: [layered, modular-monolith, monolith]
sources:
  - { label: "Cunningham — The WyCash Portfolio Management System (asal metafora 'debt')", venue: "OOPSLA / ACM", year: 1992, url: "https://doi.org/10.1145/157710.157715" }
  - { label: "Kruchten, Nord & Ozkaya — Technical Debt: From Metaphor to Theory and Practice", venue: "IEEE Software", year: 2012, url: "https://doi.org/10.1109/MS.2012.167" }
  - { label: "Kruchten, Nord & Ozkaya — Managing Technical Debt: Reducing Friction in Software Development", venue: "Addison-Wesley (SEI)", year: 2019, url: "https://www.oreilly.com/library/view/managing-technical-debt/9780135646052/" }
  - { label: "Avgeriou et al. — Managing Technical Debt in Software Engineering (Dagstuhl Seminar 16162)", venue: "Dagstuhl Reports", year: 2016, url: "https://doi.org/10.4230/DagRep.6.4.110" }
status: published
author: Architecture Advisor
---

## Metafora aslinya

Ward Cunningham (1992): mengirim lebih cepat dengan kompromi itu seperti **berutang** — sah dan
kadang cerdas, asal kamu **membayar bunganya** (kerja ekstra di setiap perubahan) dan suatu saat
**melunasi pokoknya** (refactor). Masalah muncul saat utang tak terlihat dan bunganya diam-diam
memakan kecepatan tim.

:::guided
**Analogi:** cicilan rumah itu wajar; kartu kredit yang lupa dicatat itu bahaya. Utang teknis yang
tercatat = cicilan terencana. Yang tak tercatat = tagihan kejutan tiap bulan.
:::

## Utang arsitektural ≠ kode kotor

- **Level kode:** duplikasi, penamaan buruk — murah diperbaiki setempat.
- **Level arsitektur:** batas modul yang bocor, lapisan yang saling menembus, basis data bersama,
  kerangka usang — **mahal**, karena perbaikannya menyentuh banyak bagian sekaligus. Inilah utang
  yang riset (Kruchten dkk.) tunjukkan paling menggerus produktivitas jangka panjang.

## Mengelolanya seperti orang keuangan

1. **Buat terlihat**: daftar utang arsitektural sebagai item backlog dengan *bunga* yang ditaksir
   (waktu ekstra per perubahan yang terdampak).
2. **Catat keputusannya**: kompromi yang disengaja masuk **ADR** — "kami tahu, ini alasannya, ini
   pemicunya untuk dilunasi".
3. **Bayar bertahap**: alokasi rutin (mis. tiap sprint) untuk pelunasan; hindari "big-bang rewrite".
4. **Cegah bunga baru**: batas modul ditegakkan CI + *fitness functions*.

:::expert
**Lebih dalam.** Kruchten–Nord–Ozkaya memformalkan spektrum *deliberate/inadvertent ×
prudent/reckless*: utang bijak yang disengaja adalah alat strategi; utang sembrono yang tak sadar
adalah erosi. Dagstuhl 16162 menyatukan definisi riset: utang teknis = artefak desain/implementasi
yang menguntungkan jangka pendek namun membebani evolusi. Sinyal arsitektural yang paling prediktif:
*change amplification* (satu kebutuhan menyentuh banyak modul) — persis kelemahan lapisan teknis
murni (lihat Layered di Katalog), dan alasan modular monolith dengan batas yang ditegakkan sering
jadi pelunasan terbaik pertama.
:::

## Coba di Advisor

Peringatan **anti-pattern** dan kartu **risiko** di Advisor adalah radar utang: kombinasi seperti
microservices + basis data bersama pada dasarnya utang berbunga tinggi yang sudah dikenali literatur.
