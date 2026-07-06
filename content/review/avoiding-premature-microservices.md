---
title_id: "Menghindari Microservices Prematur"
title_en: "Avoiding Premature Microservices"
slug: avoiding-premature-microservices
section: review
audience: [awam, expert]
summary_tldr_id: "Memecah menjadi microservices terlalu dini — sebelum domain dan tim matang — menambah biaya distribusi tanpa manfaatnya. Tandanya: batas layanan berubah-ubah, banyak koordinasi antar-tim, dan 'nano-services' yang kelewat halus. Sering kali obatnya adalah modular monolith dulu."
summary_tldr_en: "Splitting into microservices too early — before the domain and teams are mature — adds distribution's cost without its benefits. Signs: churning service boundaries, heavy cross-team coordination, and over-fine 'nano-services'. Often the cure is a modular monolith first."
evidence_strength: strong
last_reviewed: 2026-07-02
review_due: 2027-07-02
translation_status: en
related_advisor:
  dimensions: [D1]
  options: [monolith, modular-monolith, microservices]
sources:
  - { label: "Fowler — MonolithFirst", venue: "martinfowler.com", year: 2015, url: "https://martinfowler.com/bliki/MonolithFirst.html" }
  - { label: "Taibi & Lenarduzzi — On the Definition of Microservice Bad Smells", venue: "IEEE Software", year: 2018, url: "https://doi.org/10.1109/MS.2018.2141031" }
  - { label: "Newman — Building Microservices, 2nd ed.", venue: "O'Reilly", year: 2021, url: "https://www.oreilly.com/library/view/building-microservices-2nd/9781492034018/" }
  - { label: "Fritzsch et al. — From Monolith to Microservices", venue: "Springer", year: 2019, url: "https://doi.org/10.1007/978-3-030-06019-0_10" }
status: published
author: Architecture Advisor
---

## Why this keeps happening

Microservices are seen as "the professional way to build". Yet splitting **before** understanding
the domain and preparing the operations actually slows teams down.

:::guided
**An analogy:** splitting a team into many small departments before anyone knows who does what —
everyone ends up spending their time in coordination meetings instead of working.
:::

## Checklist: signs you split too early

- [ ] **Service boundaries keep changing** (the domain isn't stable yet).
- [ ] Small changes require **touching many services** at once.
- [ ] Heavy **cross-team coordination** for almost every feature.
- [ ] **"Nano-services"** — services so fine-grained that overhead exceeds value.
- [ ] Operations (CI/CD, observability, tracing) are **not mature yet**.
- [ ] A **shared database** appears (a distributed-monolith symptom).

## The safer path

1. **Monolith / modular monolith** first; enforce module boundaries in CI.
2. Discover the stable *bounded contexts*.
3. **Extract** only the parts with proven need for independent scaling/deploys/teams (Strangler
   Fig).

:::expert
**Deeper.** Fowler ("MonolithFirst") and Newman advise deferring distribution until boundaries are
proven; Taibi & Lenarduzzi define testable *bad smells* (including the distributed monolith and
nano-services). The refactoring-classification study (Fritzsch et al.) confirms incremental
approaches are safer than splitting outright.
:::

## Try it in the Advisor

The Advisor raises a **"premature microservices"** warning when the team/scale/DevOps factors don't
support the split — use it as a sanity check before you distribute.
