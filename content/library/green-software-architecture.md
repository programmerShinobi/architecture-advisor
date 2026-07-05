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
translation_status: id
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

## Kenapa arsitek perlu peduli

Server yang menganggur tetap menyedot listrik. Keputusan arsitektur — berapa banyak layanan, kapan
mereka berjalan, di mana — menentukan seberapa banyak energi terpakai per unit kerja.

:::guided
**Analogi:** lampu di rumah. Hemat bukan berarti gelap-gelapan, tapi mematikan lampu di ruangan
kosong. *Scale-to-zero* = lampu dengan sensor gerak untuk software-mu.
:::

## Tuas arsitektural yang terbukti

- **Utilisasi > jumlah mesin.** Banyak layanan kecil dengan utilisasi 5% lebih boros daripada satu
  layanan dengan utilisasi 60%. Monolith yang padat bisa lebih "hijau" daripada microservices yang
  jarang dipakai.
- **Skala-ke-nol** untuk beban jarang/bergelombang (serverless) — tidak ada kerja, tidak ada watt.
- **Right-sizing & pilih wilayah/jam** dengan listrik lebih bersih (carbon-aware scheduling untuk
  kerja batch yang bisa digeser).
- **Efisiensi kode & data**: lebih sedikit byte yang dipindah dan disimpan = lebih sedikit energi.

## Mengukurnya (bukan menebak)

**SCI = ((E × I) + M) / R** — energi (E) × intensitas karbon listrik (I) + emisi *embodied*
perangkat keras (M), dibagi unit fungsional (R, mis. per permintaan). Kini standar **ISO/IEC
21031:2024** — sehingga target "hijau" bisa masuk *fitness function*.

:::expert
**Lebih dalam.** SCI adalah *rate*, bukan total — mendorong desain yang efisien per unit kerja,
bukan sekadar membeli offset. Pilihan **D1** paling berdampak: serverless unggul saat trafik
bergelombang (utilisasi ~0 saat sepi), tetapi pada volume tinggi dan stabil, layanan yang padat dan
right-sized biasanya menang. Perhatikan juga *embodied carbon* (M): memperpanjang umur perangkat
keras dan mengurangi over-provisioning sering kali tuas terbesar. Untuk beban AI, Patterson et al.
menunjukkan pemilihan wilayah + arsitektur model bisa mengubah emisi puluhan kali lipat — pola pikir
yang sama berlaku untuk beban aplikasi biasa.
:::

## Coba di Advisor

Faktor *scale* dan *budget* di **Advisor** menggeser D1 antara monolith padat, microservices, dan
serverless — pertimbangkan utilisasi sebagai lensa "hijau" saat membaca trade-off biayanya.
