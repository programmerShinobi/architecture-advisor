---
title_id: "Checklist Review Arsitektur ala ATAM"
title_en: "An ATAM-style Architecture Review Checklist"
slug: atam-review-checklist
section: review
audience: [awam, expert]
summary_tldr_id: "ATAM (Architecture Tradeoff Analysis Method) mengevaluasi arsitektur lewat atribut kualitas: susun prioritas jadi pohon utilitas, uji dengan skenario, lalu temukan titik sensitif dan trade-off. Hasilnya bukan nilai lulus/gagal, melainkan pemahaman bersama atas risikonya."
summary_tldr_en: "ATAM (Architecture Tradeoff Analysis Method) evaluates an architecture through quality attributes: turn priorities into a utility tree, probe them with scenarios, then surface sensitivity points and trade-offs. The output isn't pass/fail — it's a shared understanding of the risks."
evidence_strength: strong
last_reviewed: 2026-07-02
review_due: 2027-07-02
translation_status: id
related_advisor:
  dimensions: [D1, D2, D3, D4, D5]
  options: []
sources:
  - { label: "Kazman, Klein & Clements — ATAM: Method for Architecture Evaluation", venue: "SEI, CMU/SEI-2000-TR-004", year: 2000, url: "https://insights.sei.cmu.edu/library/atam-method-for-architecture-evaluation/" }
  - { label: "Bass, Clements & Kazman — Software Architecture in Practice, 4th ed.", venue: "Addison-Wesley (SEI)", year: 2021, url: "https://www.oreilly.com/library/view/software-architecture-in/9780136885979/" }
  - { label: "ISO/IEC 25010:2023 — Product quality model", venue: "ISO", year: 2023, url: "https://www.iso.org/standard/78176.html" }
status: published
author: Architecture Advisor
---

## Untuk siapa halaman ini

Untuk **kamu yang akan menilai sebuah arsitektur** — baik pemula yang butuh langkah jelas maupun
arsitek yang ingin review yang terstruktur dan jujur. Advisor memakai gagasan inti ATAM: **pohon
utilitas** dan **analisis trade-off**.

## Ide inti ATAM

ATAM tidak bertanya *"apakah arsitektur ini bagus?"* melainkan *"seberapa baik ia memenuhi atribut
kualitas yang paling penting bagi pemangku kepentingan — dan apa yang dikorbankan untuk itu?"*
Keputusan yang menaikkan satu kualitas hampir selalu menurunkan yang lain; tugas review adalah
**membuat trade-off itu terlihat**, bukan menyembunyikannya.

## Checklist ringkas

1. **Sepakati atribut kualitas yang diprioritaskan** (mis. performa, skalabilitas, keamanan,
   ketersediaan) — pakai kosakata bersama seperti ISO/IEC 25010.
2. **Bangun pohon utilitas**: pecah tiap atribut jadi skenario konkret yang bisa diuji, lalu beri
   bobot *penting* dan *sulit*.
3. **Presentasikan pendekatan arsitektur** yang dipakai untuk memenuhi skenario itu.
4. **Analisis tiap skenario** dan tandai tiga hal: *risiko*, *titik sensitif* (keputusan yang sangat
   memengaruhi satu atribut), dan *titik trade-off* (keputusan yang memengaruhi beberapa atribut
   berlawanan arah).
5. **Kelompokkan risiko jadi tema** (mis. "semua risiko konsistensi data berasal dari satu basis data
   bersama").
6. **Rangkum**: bukan skor lulus/gagal, melainkan daftar risiko + pemahaman bersama untuk ditindak.

## Lebih dalam

:::expert
Kekuatan ATAM adalah **menemukan risiko lebih awal**, saat mengubah arsitektur masih murah. Titik
sensitif layak diberi *fitness function* agar terjaga saat sistem berevolusi. Waspadai **non-risk**
yang menyamar jadi keputusan — dan ingat bahwa review yang baik menghasilkan *pertanyaan yang lebih
tajam*, bukan kepastian palsu. Untuk sistem kecil, versi ringan (Lightweight ATAM) sudah memadai.
:::

## Coba di Advisor

**Advisor** menurunkan prioritas atribut kualitas dari faktor proyekmu (mirip pohon utilitas), lalu
menampilkan **radar trade-off**, **kartu sensitivitas**, dan **peringatan anti-pattern** — bahan
mentah yang berguna untuk sesi review bergaya ATAM.
