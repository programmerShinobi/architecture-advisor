# Architecture Advisor — Project Charter

**Discovery & Planning Phase · Product Vision Document**

| Field | Detail |
|---|---|
| **Document type** | Project Charter / Product Vision |
| **Version** | 1.8 |
| **Date** | 2026-06-12 |
| **Status** | Approved — execution baseline |
| **Author / Owner** | Faqih Pratama Muhti, B.Sc. Computer Science |
| **Audience** | Academic/IEEE & industry |
| **License** | [CC BY 4.0](../../LICENSE-docs.md) |

**Document history**

| Version | Date | Summary |
|---|---|---|
| 1.0 | — | Initial Discovery & Planning draft |
| 1.1 | — | Charter baseline established |
| 1.2 | 2026-06-10 | Closing package added; approved as the execution baseline |
| 1.3 | 2026-06-11 | Editorial clarification (no scope change, no re-approval): designated the Section 22 solo-stage KPI table as the operative v1.0 target set (Section 4 = aspirational); aligned the sign-off date with the v1.2 baseline |
| 1.4 | 2026-06-11 | Scope clarification: a basic custom-configuration import/export (JSON) is in the MVP (matching Build Spec v3); the richer organization-level config import/export remains deferred to v2.0. Resolves a charter↔Build Spec↔SRS mismatch |
| 1.5 | 2026-06-12 | Reference hardening (editorial, no scope change): added peer-reviewed and SEI sources [16]–[24] (ADD technical report, SUS and its acceptability threshold, architectural design decisions, technical debt, GQM, Strangler Fig, MADR) and cited them inline where claims rely on them |
| 1.6 | 2026-06-13 | Editorial: clarified the ADR decision-log path to `docs/adr/` (Section 14.5), where the model-decision records now live |
| 1.7 | 2026-06-13 | Scope clarification (resolves OI-3): a basic C4-style Mermaid diagram stub is in the MVP (matching Build Spec v3); richer auto-generated C4 diagrams remain deferred to v2.x |
| 1.8 | 2026-06-14 | Editorial (no scope change): noted that the ≥12-factor MVP floor is met by the 14-factor v1.0 model, removing any ambiguity against the other docs |

---

## Table of Contents

- [Preface](#preface)
- [1. Executive Summary](#1-executive-summary)
- [2. Problem Statement & Background](#2-problem-statement--background)
- [3. Product Vision](#3-product-vision)
- [4. Business Objectives & Success Metrics (KPIs)](#4-business-objectives--success-metrics-kpis)
- [5. Scope](#5-scope)
- [6. Stakeholders](#6-stakeholders)
- [7. User Personas](#7-user-personas)
- [8. Feasibility Study](#8-feasibility-study)
- [9. Assumptions, Constraints & Dependencies](#9-assumptions-constraints--dependencies)
- [10. Initial Risks & Mitigations](#10-initial-risks--mitigations)
- [11. Success Criteria & Project-Level Definition of Done](#11-success-criteria--project-level-definition-of-done)
- [12. High-Level Timeline & Milestones](#12-high-level-timeline--milestones)
- [13. References (IEEE style)](#13-references-ieee-style)
- [14. Governance & Contribution](#14-governance--contribution)
- [15. Versioning Policy & Evolution Roadmap](#15-versioning-policy--evolution-roadmap)
- [16. Resources & Budget](#16-resources--budget)
- [17. Privacy & Data Handling](#17-privacy--data-handling)
- [18. Security Considerations](#18-security-considerations)
- [19. Communication Plan](#19-communication-plan)
- [20. Sustainability](#20-sustainability)
- [21. Responsible Use](#21-responsible-use)
- [22. Pre-Sign-Off Decision Log](#22-pre-sign-off-decision-log)
- [23. Approval / Sign-Off](#23-approval--sign-off)

---

## Preface

Imagine you are about to build an application and must decide on the "skeleton" of how to build
it — like choosing the foundation and floor plan of a house before construction. That decision
is hard to change later and highly consequential. **Architecture Advisor** is a website that
helps with exactly this decision: you answer a few simple questions about your project (team
size, how busy the user base is, and so on), and the tool suggests the most suitable way to
build it — **and always explains why**, in language anyone can understand. Experts get numbers
and checkable details; newcomers get plain explanations. The tool is free, runs in the browser,
and will keep improving collaboratively year over year.

### How to read this document (by who you are)

- **General reader / want a quick picture:** read the **Preface** above, then Sections 1 and 3.
- **Product owner / manager:** Sections 3–6, 10, 12, and 15.
- **Engineer / architect / analyst:** Sections 5, 8, 11, and 13.
- **Prospective contributor:** Section 14 (Governance & Contribution) and Section 15 (Versioning & Evolution).
- **Academics / reviewers:** Sections 8, 11, and 13 (references).

---

## 1. Executive Summary

Software architecture decisions are made early in the lifecycle, are hard to reverse, and have a
large impact on a system's quality attributes [3]. In practice, these decisions are often made
by trend rather than by an explicit quality-attribute trade-off analysis. **Architecture
Advisor** is a client-side web application that structures that decision as a transparent
pipeline: project factors → quality-attribute priorities (grounded in ISO/IEC 25010:2023 [1]) →
architecture fit across five dimensions → analysis of trade-offs, sensitivity, risk, and
decision documentation (Architecture Decision Records, ADRs). The approach adapts established
architecture-evaluation methods — ATAM (Architecture Tradeoff Analysis Method) [2] and
Attribute-Driven Design [3], [16] — into an interactive tool for engineers, architects,
analysts, and newcomers alike. Being client-side, it can be hosted for free with no data risk,
offers two modes (Guided/Expert), and is designed as an open project that evolves across many
versions.

> **In plain language:** a free web tool that helps you choose the right "way to build an
> application" and explains the reasoning, for every skill level, built together with a
> community so it keeps getting better over time.

---

## 2. Problem Statement & Background

**Core problem.** Teams often pick an architectural style because it is popular, not because it
fits their quality needs and constraints — leading to excess complexity or scaling barriers. The
root cause: functionality does not determine architecture; what determines it is the quality
attributes and the trade-offs among them [3], and this analysis is rarely done explicitly and
documented.

**Who experiences it.** Architects/engineers who set the architecture for a new project or the
evolution of a legacy system; analysts who trace decisions back to requirements; and
practitioners/students without a formal framework.

**Status quo.** Formal methods (ATAM) are effective but heavy — multi-day workshops [2]. Existing
lightweight tools generally help only to *document* (diagrams, ADR tools), not to *decide*.

**Impact if left unaddressed.** Architectural debt is expensive and only surfaces months later
[20], [21]; the absence of rationale complicates auditing and onboarding [6], [19].

**Why now.** (a) The quality model has been updated (ISO/IEC 25010:2023 [1]); (b) free static
hosting enables client-side distribution at no cost; (c) interest in *evolutionary architecture*
and fitness functions is rising [5].

> **In plain language:** many teams pick the wrong application "skeleton" by following trends,
> and only realize it after it is expensive to fix. No lightweight tool yet helps you *decide*
> while explaining the reasoning.

---

## 3. Product Vision

> **For** software engineers, architects, and analysts (and newcomers who want to learn) **who**
> must choose the right architecture for a project, **Architecture Advisor is** a web-based
> decision-support tool **that** translates project needs into transparent, quality-attribute-
> driven, documented architecture recommendations — **unlike** naive architecture pickers or
> static diagrams, **this product** shows *why* a choice wins, *what* its trade-offs are, and
> *how robust* the decision is, without ever hiding its calculations.

**Product principles:** (1) intellectual honesty; (2) full transparency; (3) cited methodological
grounding; (4) accessible across skill levels; (5) actionable and tunable; (6) **open and
evolving** — community-built, improving across versions.

---

## 4. Business Objectives & Success Metrics (KPIs)

**Business objectives** *(model: open-source + education/consulting tool — **ASSUMPTION**)*: (1)
become a credible and widely used architecture decision tool; (2) reduce time and improve the
quality of early decisions; (3) serve as an educational resource; (4) **grow a healthy community
of contributors**.

**Measurable KPIs (Key Performance Indicators)** *(numbers are **ASSUMPTIONS** — the first validation point; metric structure follows the Goal-Question-Metric approach [22])*

| # | KPI | Target | Deadline |
|---|---|---|---|
| K1 | Monthly active users (MAU) | ≥ 500 | 6 months post-release |
| K2 | Full-assessment completion | ≥ 60% | continuous |
| K3 | Median time to recommendation | ≤ 5 minutes | from MVP |
| K4 | Export usage (ADR/report/CSV-JSON) | ≥ 30% of sessions | continuous |
| K5 | Usability (System Usability Scale, SUS [17]) | ≥ 75 | beta test |
| K6 | Technical-user satisfaction | ≥ 70% | quarterly survey |
| K7 | **Community health** (active contributors/quarter) | ≥ 5 *(ASSUMPTION)* | first year |

> **Which targets govern?** The table above is the **full/aspirational** set, intended for the
> team stage. For **v1.0 (solo stage)**, the **operative** targets are the moderated set in
> [Section 22](#22-pre-sign-off-decision-log) — these are what acceptance and the release gate
> (Section 11) are measured against. The numbers here apply once the project has a dedicated team.

---

## 5. Scope

**In the MVP (Minimum Viable Product, v1.0):** the 4-step flow (factors → priorities →
recommendation → export), Guided & Expert modes; ≥12 factors (the v1.0 model defines 14); 12 quality attributes
(ISO/IEC 25010:2023 [1]); recommendations across five dimensions with weighted composite scores;
an interactive trade-off radar + ranking; *close-call* detection; sensitivity analysis; a risk
register; fitness functions; anti-pattern detection; a migration path (brownfield, Strangler Fig [23]); presets; a
glossary; a "How scoring works" panel; ADR export (MADR — Markdown ADR — format [24]) & reports;
share-via-URL; a **basic custom-configuration import/export (JSON)** for extensibility; a
**basic C4-style architecture diagram stub** (Mermaid) reflecting the chosen deployment style; ID/EN
internationalization (i18n); dark mode; WCAG (Web Content Accessibility Guidelines) AA [11];
mature UI states (skeleton, 3-layer error + retry, undo, save-state, empty state).

**The five architecture dimensions.** A recommendation is not a single label; it spans five
**orthogonal** dimensions, chosen *together* rather than one instead of another:

1. **Deployment Granularity** — how the system is split into deployable units (e.g. monolith, modular monolith, microservices, serverless).
2. **Communication Style** — how the parts talk (e.g. synchronous, async messaging, event-driven, streaming).
3. **Data Management** — where and how data lives (e.g. shared database, database-per-service, CQRS, event sourcing).
4. **Code Structure** — how each unit is organized inside (e.g. layered, hexagonal, clean architecture, vertical slice).
5. **Frontend Architecture** — how the UI is built (e.g. single-page app, server-side rendering, micro-frontends).

All five are derived from the same factor answers through the shared quality-attribute priority
layer, and the chosen combination is then checked for anti-patterns.

> **In plain language:** the tool does not just say "use microservices". It answers five questions
> about your app at once — how to split it, how the parts talk, where data lives, how each part is
> organized inside, and how the screens are built — and warns you when the combined choices clash.

**Deferred (see the evolution roadmap, Section 15):** multi-stakeholder collaboration; saved
multi-project comparison; **organization-level** configuration import/export (the richer,
shareable org config — the basic per-user JSON is in the MVP above); **richer auto-generated C4
diagrams** (the basic stub is in the MVP above); an
empirical validation study.

**Non-goals:** a replacement for human judgment / full ATAM; a code / Infrastructure-as-Code
(IaC) generator; storage of sensitive data.

---

## 6. Stakeholders

| Party | Role | Interest | Influence |
|---|---|---|---|
| Product Owner | Sponsor & decision-maker | Vision, priorities, feasibility | High |
| Maintainer/Engineer | Builder & maintainer | Technical feasibility, maintainability | High |
| Architects/analysts (core) | Primary users | Accuracy, transparency, credibility | High |
| Newcomers/students | Secondary users | Ease of use, education | Medium |
| **Community Contributors** | Volunteer developers | Extensibility, recognition, clear process | Medium–High |
| **Translators** | Language contributors (i18n) | Accurate localization | Medium |
| **Domain Advisors** | Model validators | Correctness of fit/weight values | Medium–High |
| Academics/reviewers *(ASSUMPTION)* | Methodology validators | Scientific grounding | Medium |

**Distrust triggers (design guardrails):** scores without explanation; claims without references;
a slow/cluttered UI; losing input without warning; language that condescends to expert users;
**an unclear contribution process**. All are mitigated (transparency, citations, mature states,
Expert mode, Section 14).

---

## 7. User Personas

**P1 — Architect/Senior Engineer (primary).** Skeptical, values their time. Thinks in quality
attributes and trade-offs. Needs keyboard-first interaction, high density, auditable math, and
tunable weights. → **Expert mode**.

**P2 — Systems Analyst (primary).** Traces back to requirements, documents rationale, checks
consistency. Needs traceability, an audit trail, export, and sensitivity analysis.

**P3 — Mid-level Engineer / Newcomer (secondary).** Needs a framework and education. Needs plain
language, "what this means for you," presets, and a glossary. → **Guided mode**.

**P4 — Non-technical decision-maker (secondary).** Wants to understand the choices and
consequences without jargon. Needs plain summaries and reports.

**P5 — Contributor (new).** Wants to help build. Needs clear onboarding documentation, *good
first issues*, and contribution guidelines (Section 14).

---

## 8. Feasibility Study

**8.1 Technical — FEASIBLE.** Client-side (Vite + React + TypeScript), with no backend/DB.
Scoring is lightweight arithmetic over a small matrix → instant. The stack is mature and widely
known. The main risk (validity of the *fit* values) is methodological, mitigated through
transparency + calibration (Sections 10–11).

**8.2 Business — FEASIBLE (low cost).** Free hosting & CI/CD (GitHub Pages + Actions). No license
fees. The main cost is time. *(Detailed business model: **ASSUMPTION**.)*

**8.3 Operational — FEASIBLE with caveats.** Maintainable by a single maintainer + community. The
*bus factor* is mitigated: documentation, separated configuration, automated testing, and
**contribution governance (Section 14)**.

**8.4 Legal/ethical — FEASIBLE.** No sensitive data; does not reproduce copyrighted material;
references are cited correctly; WCAG AA [11]. An open license encourages contribution (Section 14).

**Conclusion:** **feasible** to proceed to design and implementation, with one academic
prerequisite: a plan for **empirical validation** of the model (Section 11).

---

## 9. Assumptions, Constraints & Dependencies

**Assumptions (need validation):** the open-source/education model; the KPIs in Section 4; the
availability of a maintainer and contributors; an ID/EN audience; the code and document licenses.

**Constraints:** client-side; bilingual ID/EN; desktop & mobile web (≥360px); WCAG AA; *fit* and
weight values are tunable expert heuristics (stated explicitly to users).

**Dependencies:** npm/Vite/React; GitHub Pages/Actions (alternatives: Netlify/Vercel/Cloudflare);
the standards [1], [2], [6].

---

## 10. Initial Risks & Mitigations

| ID | Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|---|
| R1 | Validity of fit/weight values questioned | High | Medium | Transparency (scoring panel), grounding in [1],[2], tunable weights, validation plan (Section 11), domain-advisor review (Section 14) |
| R2 | Over-reliance (scores treated as absolute truth) | High | Medium | Permanent disclaimer, *close-call* detection, sensitivity analysis |
| R3 | Scope creep | Medium | High | A firm MVP scope (Section 5), phased build, version roadmap (Section 15) |
| R4 | Low adoption | High | Medium | Fast onboarding, presets, Guided mode, open-source, free distribution |
| R5 | Bus factor (single maintainer) | Medium | Medium | Contribution governance (Section 14), documentation, automated tests, open license |
| R6 | Academic claims without evidence | Medium | Medium | Verified citations; separate "literature-based" from "unvalidated heuristic" |
| R7 | **Unmanaged contributions / quality decline** | Medium | Medium | CONTRIBUTING.md, mandatory review, CI gating, ADRs for model decisions (Section 14) |
| R8 | **Old results unreadable after the model changes** | Medium | Medium | Model version stored in each result; backward compatibility (Section 15) |

---

## 11. Success Criteria & Project-Level Definition of Done

**UX quality gate:** the first seconds are fast and coherent; no data loss without a
warning/undo; errors are informative and actionable; consistent and predictable; keyboard-first
for core tasks; dark mode; data can be exported; core quality attributes are addressed.

**Academic DoD:** the model is documented and reproducible (open matrix & weights, **labeled with
a model version**); cited grounding [1]–[6]; an **empirical validation plan** (a practitioner
study comparing the tool's recommendations against expert/ATAM judgment + an SUS test [K5]).

**Release gate:** all UX criteria ✓, K3/K5 met at beta, no critical defects.

---

## 12. High-Level Timeline & Milestones

*Estimates — **ASSUMPTION**.*

| Phase | Milestone | Estimate |
|---|---|---|
| M0 | Discovery & charter approved | Complete |
| M1 | Spec freeze + design tokens + data sheet (matrix & ID/EN copy) | Weeks 1–2 |
| M2 | Core implementation | Weeks 3–5 |
| M3 | Multi-dimensional + analysis | Weeks 6–8 |
| M4 | Mature UX + i18n + export + accessibility | Weeks 9–10 |
| M5 | Testing, CI, beta (SUS test) | Weeks 11–12 |
| M6 | Public v1.0 release + open for contributions + start the validation study | After week 12 |

---

## 13. References (IEEE style)

[1] ISO/IEC 25010:2023, *Systems and software engineering — SQuaRE — Product quality model*, ISO, 2023.
[2] R. Kazman, M. Klein, and P. Clements, "ATAM: Method for Architecture Evaluation," SEI, Carnegie Mellon Univ., Tech. Rep. CMU/SEI-2000-TR-004, 2000.
[3] L. Bass, P. Clements, and R. Kazman, *Software Architecture in Practice*, 4th ed. Boston, MA: Addison-Wesley, 2021.
[4] M. Richards and N. Ford, *Fundamentals of Software Architecture*. Sebastopol, CA: O'Reilly, 2020.
[5] N. Ford, R. Parsons, and P. Kua, *Building Evolutionary Architectures*. Sebastopol, CA: O'Reilly, 2017.
[6] ISO/IEC/IEEE 42010:2022, *Software, systems and enterprise — Architecture description*, 2nd ed., 2022.
[7] M. Nygard, "Documenting Architecture Decisions," 2011. [Online].
[8] M. E. Conway, "How do committees invent?," *Datamation*, vol. 14, no. 4, pp. 28–31, 1968.
[9] J. Lewis and M. Fowler, "Microservices," martinfowler.com, 2014. [Online].
[10] S. Newman, *Building Microservices*, 2nd ed. Sebastopol, CA: O'Reilly, 2021.
[11] W3C, *Web Content Accessibility Guidelines (WCAG) 2.2*, W3C Recommendation, 2023.
[12] Nielsen Norman Group, "Jakob's Law of Internet User Experience." [Online].
[13] Contributor Covenant, *Code of Conduct*, v2.1. [Online].
[14] T. Preston-Werner, *Semantic Versioning 2.0.0*. [Online].
[15] *Keep a Changelog 1.1.0*. [Online].
[16] R. Wojcik, F. Bachmann, L. Bass, P. Clements, P. Merson, R. Nord, and B. Wood, "Attribute-Driven Design (ADD), Version 2.0," SEI, Carnegie Mellon Univ., Tech. Rep. CMU/SEI-2006-TR-023, 2006.
[17] J. Brooke, "SUS: A 'quick and dirty' usability scale," in *Usability Evaluation in Industry*, P. W. Jordan et al., Eds. London: Taylor & Francis, 1996, pp. 189–194.
[18] A. Bangor, P. T. Kortum, and J. T. Miller, "Determining what individual SUS scores mean: Adding an adjective rating scale," *Journal of Usability Studies*, vol. 4, no. 3, pp. 114–123, 2009.
[19] A. Jansen and J. Bosch, "Software architecture as a set of architectural design decisions," in *Proc. 5th Working IEEE/IFIP Conf. Software Architecture (WICSA)*, 2005, pp. 109–120.
[20] W. Cunningham, "The WyCash portfolio management system," in *Addendum to Proc. OOPSLA '92*, 1992 (origin of the "technical debt" metaphor).
[21] P. Kruchten, R. Nord, and I. Ozkaya, *Managing Technical Debt: Reducing Friction in Software Development*. Boston, MA: Addison-Wesley/SEI, 2019.
[22] V. R. Basili, G. Caldiera, and H. D. Rombach, "The Goal Question Metric approach," in *Encyclopedia of Software Engineering*. New York: Wiley, 1994.
[23] M. Fowler, "Strangler Fig Application," martinfowler.com, 2004. [Online].
[24] *MADR — Markdown Architectural Decision Records*, adr.github.io/madr. [Online].

> Note: [7], [9], [12]–[15], [23], [24] are legitimate, widely cited industry/web sources; the
> remainder are standards, SEI technical reports, peer-reviewed papers, or established academic
> texts. For a formal academic publication, complete access dates and final URLs.

---

## 14. Governance & Contribution

**14.1 License *(recommended — ASSUMPTION, owner's decision)*.** Code: a permissive license (e.g.
MIT or Apache-2.0) for easy adoption and contribution. Documents/content: CC BY 4.0. An open
license is a prerequisite for community contribution.

**14.2 Roles.**
- *Product Owner* — vision, priorities, final decisions.
- *Maintainers* — review and merge, safeguard quality and direction.
- *Core Contributors* — trusted regular contributors.
- *Community Contributors* — anyone (code, documentation, translations, ideas).
- *Domain Advisors* — validate the model's *fit*/weight values (safeguarding credibility).
- *Translators* — localization (i18n), starting with ID/EN.

**14.3 Contribution flow.** Issue (labeled: `good first issue`, `help wanted`, `model`, `i18n`,
`a11y`, `docs`) → fork & branch → Pull Request → CI (lint/test/build must be green) → review by
≥1 maintainer → merge. Small changes (typos, translations) take a light path; large changes
require discussion first.

**14.4 Decision-making.** *Lazy consensus* for routine matters; maintainer approval for
significant changes. **Changes to the model (factors, weights, fit values, anti-patterns) must:**
(a) include rationale and references; (b) be reviewed by a Domain Advisor; (c) be recorded as an
**ADR** in the repository. (Consistent with the product's spirit: a tool about architecture
decisions documents its own.)

**14.5 Onboarding new contributors.** Required files in the repo: `README.md`, `CONTRIBUTING.md`
(how to set up and contribute), `EXTENDING.md` (how to add factors/QAs/dimensions/anti-patterns/
translations), `CODE_OF_CONDUCT.md` (adopting the Contributor Covenant [13]), [`docs/adr/`](../adr/) (decision
history), Issue & PR templates. Provide several `good first issue`s for newcomers.

**14.6 Recognition.** Record contributors (e.g. an `all-contributors` file), mention them in
release notes — important for community health (K7).

**14.7 Continuous quality.** CI blocks merges when lint/test fail; test coverage for core logic
and edge cases; mandatory review; a rule that model values always live in configuration (not
hard-coded) so they can be reviewed and tested.

---

## 15. Versioning Policy & Evolution Roadmap

**15.1 Release versioning — Semantic Versioning [14].** `MAJOR.MINOR.PATCH`:
- *MAJOR* — incompatible changes (e.g. changing a factor's meaning, removing a dimension).
- *MINOR* — backward-compatible new features (a new factor, a new language, a new mode).
- *PATCH* — bug/text/cosmetic fixes.

**15.2 Separate MODEL version.** The scoring engine has its own **model version** (e.g.
`model v1`). Every result/export/shared-URL records the model version used → results are
reproducible and comparable over time (mitigates R8). When the model changes, offer to
"recompute with the latest model".

**15.3 Backward compatibility.** Old shared-URLs and export files must remain readable/
understandable; breaking changes only in MAJOR releases, accompanied by a migration guide and a
deprecation window.

**15.4 Changelog & communication.** Maintain a `CHANGELOG.md` (*Keep a Changelog* style [15]);
every release has concise release notes understandable to a general reader + technical detail for
experts.

**15.5 Periodic review.** Review the model annually against the latest standards (e.g. a future
ISO revision) and the validation study's findings; update *fit*/weight values via an ADR.

**15.6 Indicative evolution roadmap *(ASSUMPTION — direction, not a promise)*.**

| Version | Focus | Example improvements |
|---|---|---|
| **v1.0** | MVP (scope of Section 5) | 4-step flow, 5 dimensions, radar, ADR export, Guided/Expert, ID/EN |
| **v1.x** | Refinement | More factors & "learn more" content, stricter accessibility (a11y), new translations, UX fixes |
| **v2.0** | Collaboration | Multi-stakeholder weighting, save & compare assessments, organization config import/export |
| **v2.x** | Integration | Auto-generated C4 diagrams (beyond the v1.0 basic stub), export to ADR tools/repos, industry templates |
| **v3.0** | Evidence-based | Recalibrating *fit* values from empirical validation results; community-contributed architecture packs |
| **vN (annual)** | Maintenance | Aligned with the latest standards, dependency refresh, fixes from community feedback |

> **In plain language:** the app starts simple (v1), then grows in an orderly way — new features
> are added without breaking the old ones, every change is recorded so anyone can follow along,
> and old results remain readable even as the app evolves far beyond them.

---

## 16. Resources & Budget

*ASSUMPTION — needs validation.*

**People (initial effort estimate):**

| Role | Involvement | Notes |
|---|---|---|
| Product Owner | Part-time | Decisions & priorities |
| Maintainer/Engineer | 1 core person | Building v1.0; can be assisted by an AI agent |
| Domain Advisor | Occasional | Validates model values |
| Translator | Volunteer | ID/EN |
| Community contributors | Volunteer | Post-release |

**Tools & infrastructure:** entirely free/open-source (Vite, React, TypeScript, charting
libraries, GitHub Pages + Actions). **Monetary cost ≈ 0**; the main cost is **time**.

**MVP time estimate:** ±10–12 weeks of part-time work (see Section 12). The final figure depends on team
availability.

---

## 17. Privacy & Data Handling

- The application is **client-side**: no server stores user data; **no Personally Identifiable
  Information (PII) is collected**.
- Answer data is stored in the **user's browser** (localStorage) and, when sharing, **inside the
  URL** that the user shares themselves.
- The inputs are **non-sensitive** (generic project factors). Even so, note to users not to put
  confidential information in free-text/project-name fields if such a feature exists.
- **Analytics:** none by default; if added later, it must be privacy-respecting, openly declared,
  and able to be disabled *(decision: **ASSUMPTION**)*.

---

## 18. Security Considerations

Although client-side, there is still a risk surface, mitigated from the start:
- **Dependency supply chain:** enable vulnerability scanning (e.g. Dependabot) and lock versions
  (lockfile).
- **XSS/injection:** avoid `dangerouslySetInnerHTML`/`eval` on untrusted input; **validate and
  sanitize state parsed from the URL** before use.
- **Content integrity:** consider a Content Security Policy on hosted pages.
- **Secrets:** no secrets in the code (none are needed, since there is no backend).

---

## 19. Communication Plan

| Channel | For whom | Content |
|---|---|---|
| Repo Issues/Discussions | Contributors & technical users | Bugs, ideas, Q&A |
| `CHANGELOG.md` + Release Notes | Everyone | Plain summary + technical detail per version |
| README & docs | Everyone | How to use, how to contribute, methodology |
| Periodic surveys | Users | Feedback (K5/K6) |

Release notes are written **bilingually** (ID/EN) and in **two layers** (concise for a general
reader + detail for experts), consistent with the dual-readability principle.

---

## 20. Sustainability

- **Operating cost ≈ 0** (free hosting/CI) → low financial sustainability risk.
- **Main risk = maintainer time** → mitigated with contribution governance (Section 14), documentation,
  and separated configuration so others can maintain it easily.
- Supporting options *(ASSUMPTION)*: sponsorship/donations (e.g. GitHub Sponsors) if the
  maintenance burden grows.
- An annual review (Section 15.5) keeps it relevant year over year.

---

## 21. Responsible Use

Architecture Advisor is a **decision-support tool, not an authority**. Its documents, UI, and
outputs affirm: scores are tunable heuristics; the final decision still requires **human
judgment** over the full context. The tool must not be used to "legitimize" decisions made
without consideration. This principle is embedded in the product (a permanent disclaimer,
*close-call* detection, sensitivity analysis) and in the charter (R2).

---

## 22. Pre-Sign-Off Decision Log

| # | Item | Owner's decision | Notes |
|---|---|---|---|
| D1 | Product model | **Open-source & free**, education + community focus first | Monetization (sponsor/consulting) optional in the future |
| D2 | KPIs & targets | Initial targets **moderated** for the solo stage (see table below) | Can be raised once there is a team |
| D3 | KPI baseline | **Zero** (new product); measured from the v1.0 release | — |
| D4 | Code license | **MIT** | Permissive → maximizes adoption & contribution. *Not legal advice — confirm if there are commercial/organizational interests.* |
| D5 | Document/content license | **CC BY 4.0** | — |
| D6 | Budget & resources | **Monetary cost ≈ 0**; 1 person (the author) + AI-agent assistance | Free hosting/CI on GitHub |
| D7 | Schedule/deadline | **Flexible, no hard deadline**; indicative target ±10–12 weeks part-time | Reasonable for solo |
| D8 | Maintenance owner | **The author (solo)** for now → shifting to a community model as contributors join | Bus factor mitigated via Section 14 |
| D9 | Analytics | **None** by default (privacy-friendly) | Can be added later if privacy-respecting & open |
| D10 | Evolution roadmap (Section 15.6) | **Adopted as indicative direction** (not a promise) | — |
| D11 | Reference formality level | **Mixed** (industry + standards) for now | Add peer-reviewed literature if entering the academic track |
| D12 | Domain advisor | **Not yet appointed**; seeking candidates | Interim: the owner + literature [1]–[6] as a reference |

### Operative v1.0 KPI targets (solo stage — moderated)

These targets **govern v1.0 acceptance and the release gate (Section 11)** and supersede the
aspirational Section 4 table for the solo stage; they can be raised once the project has a team.

| # | KPI | Initial target |
|---|---|---|
| K1 | Monthly active users | ≥ 100 (6 months post-release) |
| K2 | Full-assessment completion | ≥ 50% |
| K3 | Median time to recommendation | ≤ 5 minutes |
| K4 | Export usage | ≥ 25% of sessions |
| K5 | Usability (SUS [17]) | ≥ 70 — the empirically derived "acceptable" threshold [18] |
| K6 | Technical-user satisfaction | ≥ 60% |
| K7 | **Active contributors** (first year) | **≥ 3** |

> Contributor-growth strategy (per the owner's direction): a free public release on GitHub →
> provide onboarding & `good first issue`s (Section 14.5) → bilingual release notes →
> invite open contribution → formal recruitment follows once traction forms.

---

## 23. Approval / Sign-Off

This is a single-signatory approval. At present all roles are held by one person. The charter
(v1.1 + Closing Package v1.2) is approved as the execution baseline by the owner.

| Role | Name | Date |
|---|---|---|
| Product Owner / Sponsor (also Maintainer & user representative) | **Faqih Pratama Muhti** | 2026-06-10 |

*Other roles (additional Maintainers, an independent user representative, a Domain Advisor) will*
*be filled as contributors join, and recorded as a document version update.*
