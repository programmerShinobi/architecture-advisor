---
title_id: "Menulis ADR yang Baik: MADR vs Nygard vs Y-statements vs arc42"
title_en: "Writing Good ADRs: MADR vs Nygard vs Y-statements vs arc42"
slug: writing-good-adrs
section: playbook
audience: [awam, expert]
summary_tldr_id: "ADR (Architecture Decision Record) mencatat keputusan penting beserta alasan dan konsekuensinya. Empat format populer — Nygard, MADR, Y-statements, arc42 — punya trade-off berbeda. Pilih yang paling ringan yang tetap merekam konteks, opsi, keputusan, dan konsekuensi."
summary_tldr_en: "An ADR (Architecture Decision Record) captures an important decision with its rationale and consequences. Four popular formats — Nygard, MADR, Y-statements, arc42 — trade off differently. Pick the lightest one that still records context, options, decision, and consequences."
evidence_strength: strong
last_reviewed: 2026-07-02
review_due: 2027-07-02
translation_status: id
related_advisor:
  dimensions: [D1, D2, D3, D4, D5]
  options: []
sources:
  - { label: "Nygard — Documenting Architecture Decisions", venue: "cognitect.com", year: 2011, url: "https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions" }
  - { label: "MADR — Markdown Architectural Decision Records", venue: "adr.github.io/madr", year: 2024, url: "https://adr.github.io/madr/" }
  - { label: "arc42 — Architecture Decisions (Section 9)", venue: "arc42.org", year: 2024, url: "https://docs.arc42.org/section-9/" }
  - { label: "Zimmermann et al. — Sustainable Architectural Decisions (Y-statements)", venue: "IEEE Software", year: 2013, url: "https://doi.org/10.1109/MS.2013.129" }
status: published
author: Architecture Advisor
---

## Untuk siapa halaman ini

Untuk **kamu yang baru mengenal ADR** maupun **arsitek** yang ingin menstandарkan cara timnya
mencatat keputusan. Advisor sendiri mengekspor rekomendasi sebagai **ADR berformat MADR**.

## Apa itu ADR

**Architecture Decision Record** adalah catatan singkat satu keputusan arsitektur: *konteksnya apa,
opsi apa saja yang dipertimbangkan, apa yang diputuskan, dan konsekuensinya apa.* Nilainya bukan
dokumen tebal — melainkan **jejak alasan** agar tim di masa depan tahu *mengapa* sesuatu dipilih,
bukan sekadar *apa* yang dipilih.

## Empat format, singkat

- **Nygard (2011)** — format asli yang sangat ringan: *Title, Status, Context, Decision,
  Consequences*. Cocok untuk memulai; nyaris tanpa friksi.
- **MADR** — *Markdown Architectural Decision Records*. Menambah **daftar opsi yang dipertimbangkan**
  beserta pro/kontra, sehingga trade-off terekam eksplisit. Ini format yang diekspor Advisor.
- **Y-statements** — satu kalimat terstruktur: *"Dalam konteks X, menghadapi Y, kami memutuskan Z,
  untuk mencapai A, menerima konsekuensi B."* Sangat padat; bagus untuk keputusan kecil.
- **arc42 (Bagian 9)** — bukan format ADR tersendiri, melainkan tempat menaruh kumpulan ADR di dalam
  templат dokumentasi arsitektur yang lebih besar.

## Lebih dalam

:::expert
Pilih **format teringan yang tetap merekam konsekuensi**. Kesalahan umum bukan memilih format yang
salah, melainkan **tidak mencatat sama sekali** atau mencatat keputusan tanpa *alasan* dan *opsi yang
ditolak*. ADR bersifat **immutable**: bila keputusan berubah, buat ADR baru yang *menggantikan* (bukan
mengedit) yang lama — statusnya menjadi *superseded*. Simpan ADR **di dalam repo**, dekat kode, agar
ikut ditinjau lewat pull request.
:::

## Coba di Advisor

Setelah menjalankan **Advisor**, ekspor hasilnya sebagai **ADR (MADR)** dari toolbar — lengkap dengan
faktor, prioritas kualitas, dan rekomendasi lima dimensi sebagai konteks keputusanmu.
