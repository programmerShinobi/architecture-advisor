---
title_id: "GenAI & Arsitektur Perangkat Lunak: Apa yang Benar-benar Berubah?"
title_en: "GenAI & Software Architecture: What Actually Changes?"
slug: genai-and-architecture
section: library
audience: [awam, expert]
summary_tldr_id: "AI generatif mempercepat menulis kode, tetapi tidak mengubah hukum dasar arsitektur: batas yang jelas, kopling rendah, dan keterujian justru makin penting — karena kode kini lebih murah ditulis dan lebih mahal dipahami. Bukti manfaatnya masih tahap awal; klaim besar patut diuji."
summary_tldr_en: "Generative AI speeds up writing code, but it doesn't change architecture's fundamentals: clear boundaries, low coupling, and testability matter more — because code is now cheaper to write and costlier to understand. Evidence of benefit is still early; big claims deserve testing."
evidence_strength: emerging
last_reviewed: 2026-07-05
review_due: 2027-07-05
translation_status: id
related_advisor:
  dimensions: [D1, D4]
  options: [hexagonal, clean, modular-monolith]
sources:
  - { label: "Peng et al. — The Impact of AI on Developer Productivity: Evidence from GitHub Copilot", venue: "arXiv", year: 2023, url: "https://arxiv.org/abs/2302.06590" }
  - { label: "DORA — Accelerate State of DevOps Report (AI section)", venue: "Google Cloud / DORA", year: 2024, url: "https://dora.dev/research/" }
  - { label: "Böckeler — Exploring Generative AI (memo series)", venue: "martinfowler.com", year: 2024, url: "https://martinfowler.com/articles/exploring-gen-ai.html" }
  - { label: "ThoughtWorks — Technology Radar (AI-assisted software development)", venue: "ThoughtWorks", year: 2025, url: "https://www.thoughtworks.com/radar" }
status: published
author: Architecture Advisor
---

## Pertanyaan yang sebenarnya

Bukan *"apakah AI akan menulis arsitektur kita?"*, melainkan *"desain seperti apa yang tetap sehat
ketika sebagian besar kode ditulis (atau diubah) dengan bantuan AI?"*

:::guided
**Analogi:** AI seperti tukang bangunan super cepat. Kecepatan itu berkah kalau denah rumahnya
jelas — dan bencana kalau denahnya berantakan, karena tembok yang salah pun berdiri lebih cepat.
:::

## Yang berubah — dan yang tidak

- **Berubah:** kecepatan menulis/mengubah kode; eksperimen makin murah; studi terkontrol awal
  (Copilot) mencatat penyelesaian tugas ~55% lebih cepat pada tugas tertentu.
- **Tidak berubah:** biaya *memahami* sistem. Kode yang lebih banyak dan lebih cepat berarti batas
  modul, konvensi, dan tes justru menjadi rem pengaman utama.
- **Risiko baru:** perubahan besar yang "kelihatan benar" — tanpa arsitektur yang menegakkan batas
  (module boundary, dependency rule), erosi terjadi lebih cepat dari sebelumnya.

## Implikasi praktis untuk keputusan Advisor

- **D4 (struktur kode)** naik nilainya: inti yang teruji dan bebas-framework (Hexagonal/Clean)
  membuat perubahan berbantuan AI lebih aman diverifikasi.
- **Modular monolith** (D1) memberi "pagar" yang murah: batas modul yang ditegakkan CI membatasi
  radius ledakan dari perubahan otomatis.
- **Fitness functions** makin relevan: sifat arsitektur dijaga mesin, bukan kesadaran manusia.

:::expert
**Lebih dalam.** Bukti kuantitatif masih *emerging*: studi Copilot (Peng et al.) mengukur tugas
sempit; DORA 2024 mencatat adopsi AI meluas namun dampaknya pada *delivery performance* bervariasi
dan bergantung pada praktik dasar (ukuran batch kecil, tes otomatis). Memo Thoughtworks/Fowler
menekankan pola yang sama: AI memperbesar kecepatan umpan balik di dalam *guardrail* yang sudah
baik — dan memperbesar kekacauan di sistem tanpa batas yang jelas. Perlakukan klaim produktivitas
sebagai hipotesis untuk diukur di konteksmu, bukan fakta universal.
:::

## Coba di Advisor

Di **Advisor**, naikkan faktor *maintainability/testability* dan lihat bagaimana D4 mengarah ke
Hexagonal/Clean — struktur yang paling "ramah AI" karena perubahannya mudah diuji.
