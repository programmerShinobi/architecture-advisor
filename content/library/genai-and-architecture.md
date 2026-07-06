---
title_id: "GenAI & Arsitektur Perangkat Lunak: Apa yang Benar-benar Berubah?"
title_en: "GenAI & Software Architecture: What Actually Changes?"
slug: genai-and-architecture
section: library
audience: [awam, expert]
summary_tldr_id: "AI generatif mempercepat menulis kode, tetapi tidak mengubah hukum dasar arsitektur: batas yang jelas, kopling rendah, dan keterujian justru makin penting — karena kode kini lebih murah ditulis dan lebih mahal dipahami. Bukti manfaatnya masih tahap awal; klaim besar patut diuji."
summary_tldr_en: "Generative AI speeds up writing code, but it doesn't change architecture's fundamentals: clear boundaries, low coupling, and testability matter more — because code is now cheaper to write and costlier to understand. Evidence of benefit is still early; big claims deserve testing."
evidence_strength: emerging
last_reviewed: 2026-07-05
review_due: 2027-07-05
translation_status: en
related_advisor:
  dimensions: [D1, D4]
  options: [hexagonal, clean, modular-monolith]
sources:
  - { label: "Peng et al. — The Impact of AI on Developer Productivity: Evidence from GitHub Copilot", venue: "arXiv", year: 2023, url: "https://arxiv.org/abs/2302.06590" }
  - { label: "DORA — Accelerate State of DevOps Report (AI section)", venue: "Google Cloud / DORA", year: 2024, url: "https://dora.dev/research/" }
  - { label: "Böckeler — Exploring Generative AI (memo series)", venue: "martinfowler.com", year: 2024, url: "https://martinfowler.com/articles/exploring-gen-ai.html" }
  - { label: "ThoughtWorks — Technology Radar (AI-assisted software development)", venue: "ThoughtWorks", year: 2025, url: "https://www.thoughtworks.com/radar" }
status: published
author: Architecture Advisor
---

## The real question

Not *"will AI write our architecture?"* but *"what kind of design stays healthy when most code is
written (or changed) with AI assistance?"*

:::guided
**An analogy:** AI is like a super-fast builder. That speed is a blessing when the house plan is
clear — and a disaster when the plan is a mess, because the wrong walls go up faster too.
:::

## What changes — and what doesn't

- **Changes:** the speed of writing/changing code; experiments get cheaper; early controlled studies
  (Copilot) record ~55% faster completion on certain tasks.
- **Doesn't change:** the cost of *understanding* the system. More code, produced faster, means
  module boundaries, conventions, and tests become the primary safety brakes.
- **New risk:** large changes that "look right" — without an architecture that enforces boundaries
  (module boundaries, the dependency rule), erosion happens faster than before.

## Practical implications for Advisor decisions

- **D4 (code structure)** gains value: a tested, framework-free core (Hexagonal/Clean) makes
  AI-assisted changes safer to verify.
- A **modular monolith** (D1) provides cheap "fences": CI-enforced module boundaries limit the blast
  radius of automated changes.
- **Fitness functions** become more relevant: architectural properties guarded by machines, not by
  human vigilance.

:::expert
**Deeper.** The quantitative evidence is still *emerging*: the Copilot study (Peng et al.) measures
a narrow task; DORA 2024 records broad AI adoption but varied impact on *delivery performance*,
dependent on the underlying practices (small batch sizes, automated tests). The
Thoughtworks/Fowler memos stress the same pattern: AI amplifies feedback speed inside good
*guardrails* — and amplifies chaos in systems without clear boundaries. Treat productivity claims as
hypotheses to measure in your context, not universal facts.
:::

## Try it in the Advisor

In the **Advisor**, raise the *maintainability/testability* factors and watch D4 point towards
Hexagonal/Clean — the most "AI-friendly" structures, because their changes are easy to test.
