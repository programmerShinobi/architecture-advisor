---
title_id: "Memilih Arsitektur Frontend (D5): SPA, SSR/SSG, atau Micro-frontend"
title_en: "Choosing Frontend Architecture (D5): SPA, SSR/SSG, or Micro-frontends"
slug: choosing-frontend-architecture
section: playbook
audience: [awam, expert]
summary_tldr_id: "SPA unggul di interaktivitas tapi lemah di render pertama & SEO tanpa mitigasi. SSR/SSG menang di render pertama dan SEO. Micro-frontend memberi otonomi tim UI dengan biaya berat & konsistensi. Pilih berdasarkan yang paling penting: interaktivitas, SEO, atau skala tim."
summary_tldr_en: "SPAs win interactivity but are weak on first paint & SEO unless mitigated. SSR/SSG win first paint and SEO. Micro-frontends buy UI-team autonomy at the cost of weight & consistency. Choose by what matters most: interactivity, SEO, or team scale."
evidence_strength: moderate
last_reviewed: 2026-07-02
review_due: 2027-07-02
translation_status: id
related_advisor:
  dimensions: [D5]
  options: [spa, ssr, micro-frontends]
sources:
  - { label: "Miller & Osmani — Rendering on the Web", venue: "web.dev (Google)", year: 2019, url: "https://web.dev/articles/rendering-on-the-web" }
  - { label: "Google — Web Vitals", venue: "web.dev", year: 2020, url: "https://web.dev/articles/vitals" }
  - { label: "Geers — Micro Frontends in Action", venue: "Manning", year: 2020, url: "https://www.manning.com/books/micro-frontends-in-action" }
  - { label: "Jackson — Micro Frontends", venue: "martinfowler.com", year: 2019, url: "https://martinfowler.com/articles/micro-frontends.html" }
  - { label: "Mikowski & Powell — Single Page Web Applications", venue: "Manning", year: 2013, url: "https://www.manning.com/books/single-page-web-applications" }
status: published
author: Architecture Advisor
---

## Apa yang menentukan pilihan

Frontend adalah trade-off antara **render pertama & SEO** melawan **interaktivitas** dan **otonomi
tim**.

:::guided
- **SPA (Single-Page App):** satu aplikasi klien yang kaya; berpindah halaman tanpa muat-ulang. Sangat
  interaktif, tapi render pertama & SEO perlu diperhatikan (aplikasi ini sendiri sebuah SPA).
- **SSR/SSG (server/statis):** render di server atau saat build → render pertama cepat & SEO kuat,
  cocok untuk situs konten.
- **Micro-frontend:** potongan UI milik tim berbeda yang dideploy mandiri — otonomi tim di skala besar.
:::

## Panduan singkat

- Aplikasi internal yang sangat interaktif, SEO tak penting → **SPA**.
- Situs konten/pemasaran, SEO & kecepatan tampil penting → **SSR/SSG** (utamakan statis/inkremental).
- Organisasi besar dengan banyak tim UI di satu produk → **micro-frontend**.

:::expert
**Lebih dalam.** Trade-off ini mengikuti **Core Web Vitals**: SSR/SSG menang di first-contentful-paint
dan SEO; SPA menang di interaktivitas kaya (pasangkan dengan code-splitting + prefetch untuk melunakkan
muat-pertama). Micro-frontend membeli independensi tim yang baru dibutuhkan di atas ukuran organisasi
tertentu — di bawahnya, beban integrasi & konsistensi mendominasi.
:::

## Coba di Advisor

Di Advisor, D5 dinilai independen — faktor seperti *scale* dan *team* memengaruhi apakah otonomi
micro-frontend sepadan dengan bebannya.
