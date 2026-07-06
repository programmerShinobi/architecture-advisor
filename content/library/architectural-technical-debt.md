---
title_id: "Utang Teknis Arsitektural: Metafora yang Sering Disalahpahami"
title_en: "Architectural Technical Debt: The Often-Misunderstood Metaphor"
slug: architectural-technical-debt
section: library
audience: [awam, expert]
summary_tldr_id: "Utang teknis bukan sekadar 'kode jelek' — pada level arsitektur, ia adalah kompromi struktural yang disengaja (atau tidak) yang bunga-nya dibayar setiap kali kamu mengubah sistem. Yang penting bukan nol utang, melainkan utang yang terlihat, tercatat, dan dikelola — persis seperti pinjaman finansial."
summary_tldr_en: "Technical debt isn't just 'bad code' — at the architecture level it's a structural compromise (deliberate or not) whose interest you pay on every change. The goal isn't zero debt but debt that is visible, recorded, and managed — exactly like a financial loan."
evidence_strength: strong
last_reviewed: 2026-07-05
review_due: 2027-07-05
translation_status: en
related_advisor:
  dimensions: [D1, D4]
  options: [layered, modular-monolith, monolith]
sources:
  - { label: "Cunningham — The WyCash Portfolio Management System (origin of the 'debt' metaphor)", venue: "OOPSLA / ACM", year: 1992, url: "https://doi.org/10.1145/157710.157715" }
  - { label: "Kruchten, Nord & Ozkaya — Technical Debt: From Metaphor to Theory and Practice", venue: "IEEE Software", year: 2012, url: "https://doi.org/10.1109/MS.2012.167" }
  - { label: "Kruchten, Nord & Ozkaya — Managing Technical Debt: Reducing Friction in Software Development", venue: "Addison-Wesley (SEI)", year: 2019, url: "https://www.oreilly.com/library/view/managing-technical-debt/9780135646052/" }
  - { label: "Avgeriou et al. — Managing Technical Debt in Software Engineering (Dagstuhl Seminar 16162)", venue: "Dagstuhl Reports", year: 2016, url: "https://doi.org/10.4230/DagRep.6.4.110" }
status: published
author: Architecture Advisor
---

## The original metaphor

Ward Cunningham (1992): shipping faster by compromising is like **taking a loan** — legitimate and
sometimes smart, as long as you **pay the interest** (extra work on every change) and eventually
**repay the principal** (refactor). Trouble starts when the debt is invisible and its interest
quietly eats the team's velocity.

:::guided
**An analogy:** a mortgage is fine; a forgotten credit card is dangerous. Recorded technical debt =
a planned instalment. Unrecorded debt = a surprise bill every month.
:::

## Architectural debt ≠ messy code

- **Code level:** duplication, poor naming — cheap to fix locally.
- **Architecture level:** leaking module boundaries, layers piercing each other, a shared database,
  an obsolete framework — **expensive**, because the fix touches many parts at once. This is the
  debt that research (Kruchten et al.) shows erodes long-term productivity the most.

## Manage it like a finance person

1. **Make it visible**: list architectural debt as backlog items with estimated *interest* (extra
   time per affected change).
2. **Record the decision**: a deliberate compromise goes into an **ADR** — "we know, here's why,
   here's the trigger to repay it".
3. **Repay incrementally**: a regular allocation (e.g. each sprint) for repayment; avoid the
   "big-bang rewrite".
4. **Prevent new interest**: CI-enforced module boundaries + *fitness functions*.

:::expert
**Deeper.** Kruchten–Nord–Ozkaya formalise the *deliberate/inadvertent × prudent/reckless*
spectrum: deliberate, prudent debt is a strategic tool; inadvertent, reckless debt is erosion.
Dagstuhl 16162 unified the research definition: technical debt = design/implementation artefacts
that pay off short-term but tax evolution. The most predictive architectural signal is *change
amplification* (one requirement touching many modules) — precisely the weakness of purely technical
layering (see Layered in the Catalog), and the reason a modular monolith with enforced boundaries is
often the best first repayment.
:::

## Try it in the Advisor

The Advisor's **anti-pattern** warnings and **risk** cards are a debt radar: combinations like
microservices + a shared database are exactly the high-interest debt the literature has already
identified.
