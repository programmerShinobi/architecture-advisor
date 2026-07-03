---
title_id: "Fitness Functions: Menjaga Arsitektur Saat Berevolusi"
title_en: "Fitness Functions: Guarding Architecture as It Evolves"
slug: fitness-functions-guarding
section: review
audience: [awam, expert]
summary_tldr_id: "Arsitektur bukan dokumen sekali jadi — ia terus berubah. Fitness function adalah tes otomatis untuk kualitas arsitektur (mis. 'lib tidak boleh impor UI', 'latensi p95 < 200ms') yang dijalankan di CI, sehingga sifat penting terjaga saat kode berevolusi. Ubah niat arsitektur menjadi pengujian yang bisa gagal."
summary_tldr_en: "Architecture isn't a one-off document — it keeps changing. A fitness function is an automated test for an architectural quality (e.g. 'lib must not import UI', 'p95 latency < 200ms') run in CI, so important properties are protected as the code evolves. Turn architectural intent into failing tests."
evidence_strength: strong
last_reviewed: 2026-07-02
review_due: 2027-07-02
translation_status: id
related_advisor:
  dimensions: [D1, D2, D3, D4, D5]
  options: []
sources:
  - { label: "Ford, Parsons & Kua — Building Evolutionary Architectures, 2nd ed.", venue: "O'Reilly", year: 2022, url: "https://evolutionaryarchitecture.com/" }
  - { label: "Kazman, Klein & Clements — ATAM", venue: "SEI, CMU/SEI-2000-TR-004", year: 2000, url: "https://insights.sei.cmu.edu/library/atam-method-for-architecture-evaluation/" }
  - { label: "Bass, Clements & Kazman — Software Architecture in Practice, 4th ed.", venue: "Addison-Wesley (SEI)", year: 2021, url: "https://www.oreilly.com/library/view/software-architecture-in/9780136885979/" }
status: published
author: Architecture Advisor
---

## Masalah yang dipecahkan

Keputusan arsitektur yang bagus perlahan tererosi: seseorang menambah impor "sekali ini saja",
latensi merayak naik, batas modul bocor. Tanpa penjaga, arsitektur menyimpang dari niatnya.

:::guided
**Ide sederhananya:** sama seperti tes unit menjaga *perilaku*, **fitness function** menjaga
*sifat arsitektur*. Tulis sebagai pemeriksaan otomatis yang **gagal** bila sifat penting dilanggar,
lalu jalankan di CI.
:::

## Checklist penerapan

- [ ] Ambil **sifat sensitif** dari review (mis. hasil sesi ATAM) — yang paling memengaruhi kualitas.
- [ ] Ubah tiap sifat jadi **pemeriksaan objektif**: uji ketergantungan, batas latensi, ukuran bundel,
      cakupan tes, pemeriksaan keamanan.
- [ ] **Jalankan di CI** agar pelanggaran menghentikan merge, bukan ditemukan di produksi.
- [ ] Jaga jumlahnya sedikit tapi bermakna; tinjau ulang berkala.

## Contoh di repo ini

Proyek Architecture Advisor sendiri memakainya: **anggaran ukuran bundel**, **guard model** yang
menjaga docs↔config tidak menyimpang, dan **guard konten** yang memastikan tiap artikel terikat ke
model beku. Semuanya adalah fitness function.

:::expert
**Lebih dalam.** *Building Evolutionary Architectures* memformalkan gagasan ini; fitness function bisa
*atomik* (satu sifat) atau *holistik* (beberapa sifat bersamaan), dan *dipicu* (di CI) atau *kontinu*
(monitoring). Pasangkan dengan ATAM: titik sensitif dan trade-off yang ditemukan dalam review adalah
kandidat terbaik untuk dijadikan fitness function.
:::

## Coba di Advisor

Advisor menampilkan **template fitness function per atribut kualitas** di mode Ahli — pakai sebagai
titik awal untuk skenariomu.
