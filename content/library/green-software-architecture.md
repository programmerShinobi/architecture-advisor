---
title_id: "Arsitektur Hijau: Merancang Perangkat Lunak yang Hemat Karbon"
title_en: "Green Architecture: Designing Carbon-Efficient Software"
slug: green-software-architecture
section: library
audience: [awam, expert]
summary_tldr_id: "Perangkat lunak memakai listrik, dan listrik punya jejak karbon. Arsitektur memengaruhinya lewat utilisasi: skala-ke-nol saat sepi, right-sizing, dan wilayah/jam listrik bersih. Kini ada standar resminya — Software Carbon Intensity (ISO/IEC 21031) — jadi 'hijau' bisa diukur, bukan sekadar slogan."
summary_tldr_en: "Software consumes electricity, and electricity has a carbon footprint. Architecture shapes it through utilization: scale-to-zero when idle, right-sizing, and clean-energy regions/hours. There's now a formal standard — Software Carbon Intensity (ISO/IEC 21031) — so 'green' is measurable, not a slogan."
evidence_strength: moderate
last_reviewed: 2026-07-05
review_due: 2027-07-05
translation_status: en
related_advisor:
  dimensions: [D1]
  options: [serverless, monolith, microservices]
sources:
  - { label: "ISO/IEC 21031:2024 — Software Carbon Intensity (SCI) specification", venue: "ISO", year: 2024, url: "https://www.iso.org/standard/86612.html" }
  - { label: "Green Software Foundation — SCI & patterns", venue: "greensoftware.foundation", year: 2024, url: "https://sci.greensoftware.foundation/" }
  - { label: "AWS Well-Architected — Sustainability Pillar", venue: "AWS", year: 2024, url: "https://docs.aws.amazon.com/wellarchitected/latest/sustainability-pillar/sustainability-pillar.html" }
  - { label: "Patterson et al. — Carbon Emissions and Large Neural Network Training", venue: "arXiv", year: 2021, url: "https://arxiv.org/abs/2104.10350" }
status: published
author: Architecture Advisor
---

## Why architects should care

An idle server still draws electricity. Architectural decisions — how many services, when they run,
where — determine how much energy is used per unit of work.

:::guided
**An analogy:** the lights in a house. Saving energy doesn't mean sitting in the dark; it means
turning off lights in empty rooms. *Scale-to-zero* = motion-sensor lights for your software.
:::

## Proven architectural levers

- **Utilization > machine count.** Many small services at 5% utilization waste more than one service
  at 60%. A well-packed monolith can be "greener" than rarely-used microservices.
- **Scale-to-zero** for rare/spiky workloads (serverless) — no work, no watts.
- **Right-sizing & choosing regions/hours** with cleaner electricity (carbon-aware scheduling for
  batch work that can be shifted).
- **Code & data efficiency**: fewer bytes moved and stored = less energy.

## Measure it (don't guess)

**SCI = ((E × I) + M) / R** — energy (E) × the electricity's carbon intensity (I) + the hardware's
*embodied* emissions (M), divided by a functional unit (R, e.g. per request). Now the **ISO/IEC
21031:2024** standard — so a "green" target can become a *fitness function*.

:::expert
**Deeper.** SCI is a *rate*, not a total — it rewards designs that are efficient per unit of work,
not merely buying offsets. The **D1** choice matters most: serverless wins for spiky traffic
(utilization ~0 when idle), but at high, steady volume, dense right-sized services usually win. Also
watch *embodied carbon* (M): extending hardware life and reducing over-provisioning are often the
biggest levers. For AI workloads, Patterson et al. show region choice + model architecture can
change emissions by an order of magnitude — the same mindset applies to ordinary application
workloads.
:::

## Try it in the Advisor

The *scale* and *budget* factors shift D1 between a dense monolith, microservices, and serverless in
the **Advisor** — treat utilization as the "green" lens when reading the cost trade-offs.
