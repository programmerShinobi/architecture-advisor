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
translation_status: en
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

## What decides the choice

Frontend architecture is a trade-off between **first paint & SEO** versus **interactivity** and
**team autonomy**.

:::guided
- **SPA (Single-Page App):** one rich client application; page changes without reloads. Highly
  interactive, but first paint & SEO need attention (this app is itself a SPA).
- **SSR/SSG (server/static):** render on the server or at build time → fast first paint & strong
  SEO, great for content sites.
- **Micro-frontends:** UI pieces owned by different teams, deployed independently — team autonomy at
  large scale.
:::

## A short guide

- Highly interactive internal app, SEO irrelevant → **SPA**.
- Content/marketing site, SEO & time-to-content matter → **SSR/SSG** (prefer static/incremental).
- Large organisation with many UI teams on one product → **micro-frontends**.

:::expert
**Deeper.** The trade-off follows **Core Web Vitals**: SSR/SSG win first-contentful-paint and SEO;
SPAs win rich interactivity (pair them with code-splitting + prefetching to soften the first load).
Micro-frontends buy team independence that is only needed above a certain organisation size — below
it, the integration & consistency overhead dominates.
:::

## Try it in the Advisor

In the Advisor, D5 is scored independently — factors such as *scale* and *team* decide whether
micro-frontend autonomy is worth its weight.
