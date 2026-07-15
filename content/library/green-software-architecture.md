---
title_id: "Arsitektur Hijau: Merancang Perangkat Lunak yang Hemat Karbon"
title_en: "Green Architecture: Designing Carbon-Efficient Software"
slug: green-software-architecture
section: library
audience: [awam, expert]
summary_tldr_id: "Perangkat lunak memakai listrik, dan listrik punya jejak karbon. Arsitektur memengaruhinya lewat utilisasi: skala-ke-nol saat sepi, right-sizing, dan wilayah/jam listrik bersih. Kini ada standar resminya — Software Carbon Intensity (ISO/IEC 21031) — jadi 'hijau' bisa diukur, bukan sekadar slogan."
summary_tldr_en: "Software consumes electricity, and electricity has a carbon footprint. Architecture shapes it through utilization: scale-to-zero when idle, right-sizing, and clean-energy regions/hours. There's now a formal standard — Software Carbon Intensity (ISO/IEC 21031) — so 'green' is measurable, not a slogan."
evidence_strength: moderate
last_reviewed: 2026-07-05
review_due: 2027-07-05
translation_status: id+en
related_advisor:
  dimensions: [D1]
  options: [serverless, monolith, microservices]
sources:
  - { label: "ISO/IEC 21031:2024 — Software Carbon Intensity (SCI) specification", venue: "ISO", year: 2024, url: "https://www.iso.org/standard/86612.html" }
  - { label: "Green Software Foundation — SCI & patterns", venue: "greensoftware.foundation", year: 2024, url: "https://sci.greensoftware.foundation/" }
  - { label: "AWS Well-Architected — Sustainability Pillar", venue: "AWS", year: 2024, url: "https://docs.aws.amazon.com/wellarchitected/latest/sustainability-pillar/sustainability-pillar.html" }
  - { label: "Patterson et al. — Carbon Emissions and Large Neural Network Training", venue: "arXiv", year: 2021, url: "https://arxiv.org/abs/2104.10350" }
status: published
author: Architecture Advisor
---

## Why architects should care

An idle server still draws electricity. Architectural decisions — how many services, when they run,
where — determine how much energy is used per unit of work.

:::guided
**An analogy:** the lights in a house. Saving energy doesn't mean sitting in the dark; it means
turning off lights in empty rooms. *Scale-to-zero* = motion-sensor lights for your software.
:::

## Proven architectural levers

- **Utilization > machine count.** Many small services at 5% utilization waste more than one service
  at 60%. A well-packed monolith can be "greener" than rarely-used microservices.
- **Scale-to-zero** for rare/spiky workloads (serverless) — no work, no watts.
- **Right-sizing & choosing regions/hours** with cleaner electricity (carbon-aware scheduling for
  batch work that can be shifted).
- **Code & data efficiency**: fewer bytes moved and stored = less energy.

## Measure it (don't guess)

**SCI = ((E × I) + M) / R** — energy (E) × the electricity's carbon intensity (I) + the hardware's
*embodied* emissions (M), divided by a functional unit (R, e.g. per request). Now the **ISO/IEC
21031:2024** standard — so a "green" target can become a *fitness function*.

:::expert
**Deeper.** SCI is a *rate*, not a total — it rewards designs that are efficient per unit of work,
not merely buying offsets. The **D1** choice matters most: serverless wins for spiky traffic
(utilization ~0 when idle), but at high, steady volume, dense right-sized services usually win. Also
watch *embodied carbon* (M): extending hardware life and reducing over-provisioning are often the
biggest levers. For AI workloads, Patterson et al. show region choice + model architecture can
change emissions by an order of magnitude — the same mindset applies to ordinary application
workloads.
:::

## Try it in the Advisor

The *scale* and *budget* factors shift D1 between a dense monolith, microservices, and serverless in
the **Advisor** — treat utilization as the "green" lens when reading the cost trade-offs.

<!-- lang:id -->

## Mengapa arsitek perlu peduli

Server yang menganggur pun tetap menyedot listrik. Keputusan arsitektur — berapa banyak layanan, kapan
berjalan, di mana — menentukan berapa banyak energi terpakai per unit kerja.

:::guided
**Sebuah analogi:** lampu di rumah. Menghemat energi bukan berarti duduk dalam gelap; artinya mematikan
lampu di ruangan kosong. *Scale-to-zero* = lampu sensor gerak untuk perangkat lunakmu.
:::

## Tuas arsitektur yang terbukti

- **Utilisasi > jumlah mesin.** Banyak layanan kecil pada utilisasi 5% lebih boros daripada satu layanan
  pada 60%. Monolith yang terkemas rapat bisa lebih "hijau" daripada microservices yang jarang dipakai.
- **Scale-to-zero** untuk beban kerja langka/berlonjak (serverless) — tak ada kerja, tak ada watt.
- **Penyesuaian ukuran & memilih region/jam** dengan listrik yang lebih bersih (penjadwalan sadar-karbon
  untuk kerja batch yang bisa digeser).
- **Efisiensi kode & data**: makin sedikit byte yang dipindah dan disimpan = makin sedikit energi.

## Ukur (jangan menebak)

**SCI = ((E × I) + M) / R** — energi (E) × intensitas karbon listrik (I) + emisi *terkandung* perangkat
keras (M), dibagi unit fungsional (R, mis. per permintaan). Kini menjadi standar **ISO/IEC 21031:2024** —
sehingga target "hijau" bisa menjadi *fitness function*.

:::expert
**Lebih dalam.** SCI adalah *laju*, bukan total — ia menghargai desain yang efisien per unit kerja, bukan
sekadar membeli offset. Pilihan **D1** paling berpengaruh: serverless menang untuk trafik berlonjak
(utilisasi ~0 saat menganggur), tapi pada volume tinggi dan mantap, layanan padat yang tepat-ukuran
biasanya menang. Perhatikan juga *karbon terkandung* (M): memperpanjang umur perangkat keras dan mengurangi
over-provisioning sering menjadi tuas terbesar. Untuk beban kerja AI, Patterson dkk. menunjukkan pilihan
region + arsitektur model bisa mengubah emisi sebesar satu orde besaran — pola pikir yang sama berlaku
untuk beban kerja aplikasi biasa.
:::

## Coba di Advisor

Faktor *scale* dan *budget* menggeser D1 antara monolith padat, microservices, dan serverless di
**Advisor** — perlakukan utilisasi sebagai lensa "hijau" saat membaca trade-off biaya.
