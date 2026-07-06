---
title_id: "Kapan (dan Kapan Tidak) Memakai Microservices"
title_en: "When (and When Not) to Use Microservices"
slug: when-to-use-microservices
section: playbook
audience: [awam, expert]
summary_tldr_id: "Microservices membayar dividen pada organisasi besar dengan bagian yang skalanya benar-benar berbeda dan DevOps yang matang. Untuk kebanyakan tim, mulailah dengan monolith (atau modular monolith) dan ekstrak layanan hanya saat batasnya terbukti. Distribusi dini adalah kesalahan yang mahal."
summary_tldr_en: "Microservices pay off for large organisations with parts that genuinely scale differently and mature DevOps. For most teams, start monolithic (or modular-monolith) and extract services only once boundaries are proven. Premature distribution is a costly mistake."
evidence_strength: strong
last_reviewed: 2026-07-02
review_due: 2027-07-02
translation_status: en
related_advisor:
  dimensions: [D1]
  options: [monolith, modular-monolith, microservices, serverless]
sources:
  - { label: "Fowler — MonolithFirst", venue: "martinfowler.com", year: 2015, url: "https://martinfowler.com/bliki/MonolithFirst.html" }
  - { label: "Newman — Building Microservices, 2nd ed.", venue: "O'Reilly", year: 2021, url: "https://www.oreilly.com/library/view/building-microservices-2nd/9781492034018/" }
  - { label: "Dragoni et al. — Microservices: Yesterday, Today, and Tomorrow", venue: "Springer", year: 2017, url: "https://doi.org/10.1007/978-3-319-67425-4_12" }
  - { label: "Soldani et al. — The pains and gains of microservices", venue: "Journal of Systems and Software", year: 2018, url: "https://doi.org/10.1016/j.jss.2018.09.082" }
  - { label: "Bogner et al. — Microservices in Industry", venue: "IEEE ICSA-C", year: 2019, url: "https://doi.org/10.1109/ICSA-C.2019.00041" }
status: published
author: Architecture Advisor
---

## The temptation and the trap

Microservices are often chosen because of the trend, not the need. Yet their benefits are
**conditional** — and the costs are real from day one.

:::guided
**When they fit:** a large or distributed organisation; parts of the system that genuinely need to
scale differently; teams that already have automation, observability, and mature DevOps.

**When to hold off:** an early product, a small team, an unstable domain. There, a monolith or a
**modular monolith** is usually faster and cheaper.
:::

## Rules of thumb

1. **Start monolithic.** Prove the product and discover the domain boundaries first.
2. **Enforce module boundaries** (modular monolith) inside a single process.
3. **Extract services** only when there is a real need: independent scaling, independent deploys, or
   independent teams — along *bounded contexts*, using the Strangler Fig.
4. **Measure the cost:** network hops, eventual consistency, tracing, and operations.

:::expert
**Deeper.** Surveys (Dragoni et al.) and systematic reviews (Soldani et al.) show that microservice
benefits depend on organisational maturity; the top complaints are consistent: operational
complexity and data consistency. Industry studies (Bogner et al.) record mixed effects on
maintainability. Conway's Law applies: service boundaries tend to follow team boundaries — design
both together.
:::

## Try it in the Advisor

The *scale*, *team*, and *devops* factors shift D1 in the Advisor — see whether microservices truly
win for your scenario, or whether a modular monolith does.
