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
translation_status: en
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

## Who this page is for

For **anyone about to evaluate an architecture** — from beginners who need clear steps to architects
who want a structured, honest review. The Advisor uses ATAM's core ideas: the **utility tree** and
**trade-off analysis**.

## ATAM's core idea

ATAM does not ask *"is this architecture good?"* but *"how well does it satisfy the quality
attributes that matter most to the stakeholders — and what is sacrificed for that?"* A decision that
raises one quality almost always lowers another; the review's job is to **make that trade-off
visible**, not to hide it.

## The checklist, briefly

1. **Agree on the prioritised quality attributes** (e.g. performance, scalability, security,
   availability) — use a shared vocabulary such as ISO/IEC 25010.
2. **Build a utility tree**: break each attribute into concrete, testable scenarios, then weight
   them by *importance* and *difficulty*.
3. **Present the architectural approaches** used to satisfy those scenarios.
4. **Analyse each scenario** and mark three things: *risks*, *sensitivity points* (decisions that
   strongly affect one attribute), and *trade-off points* (decisions that push several attributes in
   opposite directions).
5. **Group risks into themes** (e.g. "all data-consistency risks stem from one shared database").
6. **Summarise**: not a pass/fail score, but a list of risks plus a shared understanding to act on.

## Going deeper

:::expert
ATAM's strength is **finding risks early**, while changing the architecture is still cheap.
Sensitivity points deserve *fitness functions* so they stay protected as the system evolves. Watch
for **non-risks** masquerading as decisions — and remember that a good review produces *sharper
questions*, not false certainty. For small systems, a light version (Lightweight ATAM) is enough.
:::

## Try it in the Advisor

The **Advisor** derives quality-attribute priorities from your project factors (much like a utility
tree), then shows the **trade-off radar**, **sensitivity cards**, and **anti-pattern warnings** —
useful raw material for an ATAM-style review session.
