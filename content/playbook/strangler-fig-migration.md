---
title_id: "Strangler Fig: Migrasi Monolith ke Microservices Tanpa Big Bang"
title_en: "Strangler Fig: Migrating a Monolith to Microservices Without a Big Bang"
slug: strangler-fig-migration
section: playbook
audience: [awam, expert]
summary_tldr_id: "Jangan menulis ulang sistem sekaligus. Pola Strangler Fig mengekstrak satu kemampuan pada satu waktu ke layanan baru, mengalihkan trafik bertahap, sampai monolith lama 'tercekik' dan bisa dipensiunkan — risiko kecil, nilai lebih cepat."
summary_tldr_en: "Don't rewrite the whole system at once. The Strangler Fig pattern extracts one capability at a time into a new service, shifts traffic gradually, until the old monolith is 'strangled' and can be retired — low risk, earlier value."
evidence_strength: strong
last_reviewed: 2026-07-02
review_due: 2027-07-02
translation_status: en
related_advisor:
  dimensions: [D1]
  options: [monolith, modular-monolith, microservices]
sources:
  - { label: "Fowler — StranglerFigApplication", venue: "martinfowler.com", year: 2004, url: "https://martinfowler.com/bliki/StranglerFigApplication.html" }
  - { label: "Newman — Monolith to Microservices", venue: "O'Reilly", year: 2019, url: "https://www.oreilly.com/library/view/monolith-to-microservices/9781492047834/" }
  - { label: "Fritzsch et al. — From Monolith to Microservices: A Classification of Refactoring Approaches", venue: "Springer", year: 2019, url: "https://doi.org/10.1007/978-3-030-06019-0_10" }
status: published
author: Architecture Advisor
---

## The problem

Rewriting a large system in one go (the "big bang rewrite") is one of the most famous ways to fail:
expensive, slow, and high-risk, because no value ships until everything is finished.

:::guided
**The simple idea:** picture a strangler fig slowly growing around its host tree. Instead of cutting
the old tree down, we grow the new one **piece by piece** around it, until the old tree is no longer
needed.
:::

## The Strangler Fig steps

1. **Put a facade/proxy** in front of the monolith so traffic can be redirected route by route.
2. **Pick one capability** that is valuable and clearly bounded to extract first.
3. **Build the new service** for that capability; route its traffic through the facade.
4. **Repeat**, capability by capability — always able to roll back if something goes wrong.
5. **Retire** the parts of the monolith that have been replaced.

:::expert
**Deeper.** The prerequisite is **correct boundaries** — extract along *bounded contexts*, not along
technical layers; getting out of a shared database is usually the hardest part (it needs patterns
like the *transactional outbox* and *sagas*). Often a **modular monolith** is the wise intermediate
step: enforce module boundaries inside one process first, prove them, then extract only what truly
needs independent scaling or deployment. The refactoring-classification study (Fritzsch et al.)
shows incremental approaches are far safer than rewrites.
:::

## Try it in the Advisor

Run the **Advisor** for your existing system (pick the "existing system" profile) — look at the D1
recommendation and the **migration-path card**, which suggests a gradual route rather than a big
leap.
