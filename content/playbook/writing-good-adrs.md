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
translation_status: id+en
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

## Who this page is for

For **readers new to ADRs** as well as **architects** who want to standardise how their team records
decisions. The Advisor itself exports its recommendation as a **MADR-formatted ADR**.

## What an ADR is

An **Architecture Decision Record** is a short note about one architectural decision: *what the
context was, which options were considered, what was decided, and what the consequences are.* Its
value is not a thick document — it is a **trail of reasoning**, so that a future team knows *why*
something was chosen, not merely *what* was chosen.

## Four formats, briefly

- **Nygard (2011)** — the original, very lightweight format: *Title, Status, Context, Decision,
  Consequences*. Great for getting started; almost zero friction.
- **MADR** — *Markdown Architectural Decision Records*. Adds an explicit **list of considered
  options** with pros/cons, so the trade-off is recorded. This is the format the Advisor exports.
- **Y-statements** — one structured sentence: *"In the context of X, facing Y, we decided Z, to
  achieve A, accepting consequence B."* Extremely compact; good for small decisions.
- **arc42 (Section 9)** — not a standalone ADR format, but the place to keep your collection of ADRs
  inside a larger architecture-documentation template.

## Going deeper

:::expert
Choose **the lightest format that still records consequences**. The common failure is not picking
the wrong format — it is **not recording at all**, or recording the decision without the *rationale*
and the *rejected options*. ADRs are **immutable**: when a decision changes, write a new ADR that
*supersedes* (rather than edits) the old one — its status becomes *superseded*. Keep ADRs **in the
repo**, close to the code, so they are reviewed through pull requests.
:::

## Try it in the Advisor

After running the **Advisor**, export the result as an **ADR (MADR)** from the toolbar — complete
with your factors, quality priorities, and the five-dimension recommendation as the context of your
decision.

<!-- lang:id -->

## Untuk siapa halaman ini

Untuk **pembaca yang baru mengenal ADR** maupun **arsitek** yang ingin menstandarkan cara timnya mencatat
keputusan. Advisor sendiri mengekspor rekomendasinya sebagai **ADR berformat MADR**.

## Apa itu ADR

**Architecture Decision Record** adalah catatan singkat tentang satu keputusan arsitektur: *apa konteksnya,
opsi apa yang dipertimbangkan, apa yang diputuskan, dan apa konsekuensinya.* Nilainya bukan dokumen tebal —
melainkan **jejak penalaran**, agar tim di masa depan tahu *mengapa* sesuatu dipilih, bukan sekadar *apa*
yang dipilih.

## Empat format, secara ringkas

- **Nygard (2011)** — format asli yang sangat ringan: *Judul, Status, Konteks, Keputusan, Konsekuensi*.
  Bagus untuk memulai; nyaris tanpa hambatan.
- **MADR** — *Markdown Architectural Decision Records*. Menambahkan **daftar opsi yang dipertimbangkan**
  secara eksplisit dengan pro/kontra, sehingga trade-off-nya tercatat. Ini format yang diekspor Advisor.
- **Y-statement** — satu kalimat terstruktur: *"Dalam konteks X, menghadapi Y, kami memutuskan Z, untuk
  mencapai A, menerima konsekuensi B."* Sangat ringkas; bagus untuk keputusan kecil.
- **arc42 (Bagian 9)** — bukan format ADR mandiri, tapi tempat menyimpan koleksi ADR-mu di dalam template
  dokumentasi arsitektur yang lebih besar.

## Menyelam lebih dalam

:::expert
Pilih **format teringan yang tetap mencatat konsekuensi**. Kegagalan umum bukanlah memilih format yang
salah — melainkan **tidak mencatat sama sekali**, atau mencatat keputusan tanpa *rasional* dan *opsi yang
ditolak*. ADR bersifat **tak-berubah**: saat keputusan berubah, tulis ADR baru yang *menggantikan* (bukan
menyunting) yang lama — statusnya menjadi *superseded*. Simpan ADR **di dalam repo**, dekat dengan kode,
agar ditinjau lewat pull request.
:::

## Coba di Advisor

Setelah menjalankan **Advisor**, ekspor hasilnya sebagai **ADR (MADR)** dari toolbar — lengkap dengan
faktormu, prioritas kualitas, dan rekomendasi lima-dimensi sebagai konteks keputusanmu.
