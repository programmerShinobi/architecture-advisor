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
translation_status: en
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

## The problem it solves

Good architectural decisions slowly erode: someone adds an import "just this once", latency creeps
up, module boundaries leak. Without a guard, the architecture drifts away from its intent.

:::guided
**The simple idea:** just as unit tests protect *behaviour*, a **fitness function** protects an
*architectural property*. Write it as an automated check that **fails** when an important property
is violated, then run it in CI.
:::

## Adoption checklist

- [ ] Take the **sensitive properties** from a review (e.g. an ATAM session) — the ones that most
      affect quality.
- [ ] Turn each property into an **objective check**: dependency tests, latency budgets, bundle-size
      budgets, test coverage, security checks.
- [ ] **Run them in CI** so a violation blocks the merge instead of being discovered in production.
- [ ] Keep the set small but meaningful; revisit it periodically.

## Examples in this repo

The Architecture Advisor project uses them itself: **bundle-size budgets**, a **model guard** that
keeps docs↔config from drifting, and a **content guard** that ensures every article is bound to the
frozen model. All of these are fitness functions.

:::expert
**Deeper.** *Building Evolutionary Architectures* formalises the idea; fitness functions can be
*atomic* (one property) or *holistic* (several properties together), and *triggered* (in CI) or
*continuous* (monitoring). Pair them with ATAM: the sensitivity and trade-off points found in a
review are the best candidates to turn into fitness functions.
:::

## Try it in the Advisor

The Advisor shows **fitness-function templates per quality attribute** in Expert mode — use them as
a starting point for your scenario.
