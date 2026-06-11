# Architecture Advisor — Software Requirements Specification (SRS)

**Requirement Analysis Phase · Software Requirements Specification**

| Field | Detail |
|---|---|
| **Document type** | Software Requirements Specification (SRS) |
| **Version** | 0.1 |
| **Date** | 2026-06-10 |
| **Status** | Draft |
| **Author / Owner** | Faqih Pratama Muhti, B.Sc. Computer Science |
| **Audience** | Engineers, architects, analysts, reviewers |
| **Derived from** | [Discovery & Planning charter](../01-discovery-and-planning/discovery-and-planning.md) v1.2 · [Build Spec v3](../specs/build-spec-v3.md) |
| **License** | [CC BY 4.0](../../LICENSE-docs.md) |

**Document history**

| Version | Date | Summary |
|---|---|---|
| 0.1 | 2026-06-10 | Initial SRS draft derived from the charter and Build Spec v3 |

---

## Table of Contents

- [1. Introduction](#1-introduction)
- [2. Overall Description](#2-overall-description)
- [3. Functional Requirements](#3-functional-requirements)
- [4. Non-Functional Requirements](#4-non-functional-requirements)
- [5. Data & Decision-Model Requirements](#5-data--decision-model-requirements)
- [6. Use Cases](#6-use-cases)
- [7. Acceptance Criteria](#7-acceptance-criteria)
- [8. Requirements Traceability Matrix](#8-requirements-traceability-matrix)
- [9. Open Issues & To Be Determined](#9-open-issues--to-be-determined)

---

## 1. Introduction

### 1.1 Purpose

This document specifies the functional and non-functional requirements for **Architecture
Advisor v1.0 (MVP)**. It translates the approved [Discovery & Planning charter](../01-discovery-and-planning/discovery-and-planning.md)
and the [Build Spec v3](../specs/build-spec-v3.md) into discrete, testable, traceable
requirements that guide design (Phase 3), implementation (Phase 4), and verification (Phase 5).

The structure follows ISO/IEC/IEEE 29148:2018. Where the Build Spec already defines model
internals (factor values, fit vectors, rule conditions), this SRS references them rather than
restating them, and instead specifies *what the system must do* and *how well*.

### 1.2 Product Scope

Architecture Advisor is a **client-side web application** that turns project factors into a
transparent, quality-attribute-driven architecture recommendation across five dimensions, with
trade-off, sensitivity, risk, anti-pattern, and fitness-function analysis, and exportable
decision records. The authoritative scope (in/deferred/non-goals) is the charter,
[Section 5 Scope](../01-discovery-and-planning/discovery-and-planning.md#5-scope); this SRS covers the
**in-MVP** scope only. Deferred items are out of scope for these requirements.

### 1.3 Definitions & Abbreviations

| Term | Meaning |
|---|---|
| QA | Quality attribute (e.g. scalability, maintainability) per ISO/IEC 25010:2023 |
| Factor | A user-facing project driver/constraint with 3 ordinal levels (0–2) |
| Fit (`qaFit`) | An option's rated suitability (1–5) for a given QA |
| Composite score | Σ over QAs of `normalizedWeight/100 × qaFit` for an option |
| Dimension | An orthogonal architecture decision axis (D1–D5) |
| ADR | Architecture Decision Record (exported in MADR — Markdown ADR — format) |
| ATAM | Architecture Tradeoff Analysis Method |
| Utility tree | The normalized, weighted set of QA priorities |
| MoSCoW | Prioritization: Must / Should / Could / Won't (this release) |
| SUS | System Usability Scale |
| i18n / a11y | Internationalization / accessibility |

### 1.4 References

1. [Discovery & Planning charter](../01-discovery-and-planning/discovery-and-planning.md) (v1.2) — problem, scope, KPIs, risks, governance.
2. [Build Spec v3](../specs/build-spec-v3.md) — technical specification and model definitions.
3. [UI/UX Execution Playbook](../guides/uiux-execution-playbook.md) — usability requirements for technical users.
4. ISO/IEC/IEEE 29148:2018 — Requirements engineering.
5. ISO/IEC 25010:2023 — Product quality model.
6. W3C WCAG 2.2 — Web Content Accessibility Guidelines.

### 1.5 Requirement Conventions

- Each requirement has a unique ID (`FR-*` functional, `NFR-*` non-functional), a single
  **shall** statement, a **priority** (MoSCoW), and a **trace** to its source.
- Trace shortcuts: **Charter Section n** = a section of the charter; **Build Spec Section n** =
  a section of Build Spec v3; **UI/UX Playbook Task n** = a task in the UI/UX Execution Playbook.
- Priority for v1.0: **Must** unless stated. **Could** items may slip without affecting the MVP.
- Verification methods (Phase 5): **T** test, **D** demonstration, **I** inspection, **A** analysis.

---

## 2. Overall Description

### 2.1 Product Perspective

A self-contained single-page application with **no backend, database, accounts, or AI calls**.
All computation is local arithmetic over small in-memory matrices. State lives in the browser
(`localStorage`) and, when shared, in the URL hash. The app is deployable as a static site
(e.g. GitHub Pages). See [Build Spec v3 Section 2](../specs/build-spec-v3.md).

### 2.2 User Classes & Characteristics

Per charter [Section 7 User Personas](../01-discovery-and-planning/discovery-and-planning.md#7-user-personas):
**P1** architect/senior engineer (Expert mode, keyboard-first, auditable math); **P2** systems
analyst (traceability, export); **P3** mid-level/newcomer (Guided mode, plain language); **P4**
non-technical decision-maker (summaries/reports); **P5** contributor (onboarding, config).

### 2.3 Operating Environment

Modern evergreen desktop and mobile browsers; responsive down to a 360 px viewport; functions
fully offline after first load; WCAG 2.2 AA in both light and dark themes.

### 2.4 Constraints

Client-side only; bilingual ID/EN; all model values held in configuration (not hard-coded);
tech stack fixed by [Build Spec v3 Section 2](../specs/build-spec-v3.md) (Vite + React + TypeScript,
Tailwind, recharts, mermaid). See charter [Section 9](../01-discovery-and-planning/discovery-and-planning.md#9-assumptions-constraints--dependencies).

### 2.5 Assumptions & Dependencies

The `fit`/weight values are tunable expert heuristics (not validated facts); npm ecosystem and
free static hosting/CI are available. Full list: charter
[Section 9](../01-discovery-and-planning/discovery-and-planning.md#9-assumptions-constraints--dependencies).

---

## 3. Functional Requirements

### 3.1 Application Shell, Modes & Global UX

| ID | The system shall… | Priority | Trace |
|---|---|---|---|
| FR-SHELL-1 | Provide two modes — **Guided** (plain language) and **Expert** (technical terms, editable weights) — switchable at runtime, with the choice persisted. | Must | Charter Section 7; Build Spec Section 12 |
| FR-SHELL-2 | Provide an **ID/EN language toggle** that localizes every visible string at runtime (default ID). | Must | Charter Section 5; Build Spec Section 2 |
| FR-SHELL-3 | Provide a **dark/light theme toggle**, both meeting WCAG AA contrast. | Must | Charter Section 5, Section 11 |
| FR-SHELL-4 | Display a **permanent, visible disclaimer** that scores are tunable heuristics, not facts. | Must | Charter Section 21 (R2) |
| FR-SHELL-5 | Offer **scenario presets** (startup MVP, regulated/enterprise, high-traffic e-commerce, IoT/streaming, internal tool) that populate all factors. | Must | Build Spec Section 12; Charter Section 5 |
| FR-SHELL-6 | Provide **reset** of all answers, guarded by confirmation and reversible via undo. | Must | UI/UX Playbook Task 4 |
| FR-SHELL-7 | Provide a **glossary** of terms and contextual help/tooltips. | Must | Charter Section 5; UI/UX Playbook Task 9 |
| FR-SHELL-8 | Provide a **command palette and keyboard shortcuts** covering all core actions. | Should | UI/UX Playbook Task 2 |

### 3.2 Step 1 — Project Factors

| ID | The system shall… | Priority | Trace |
|---|---|---|---|
| FR-FACT-1 | Present **≥12 project factors** (target 14), grouped, each with three ordinal levels (0–2). | Must | Charter Section 5; Build Spec Section 4 |
| FR-FACT-2 | Show localized **help text** per factor (what it means + why it shifts QA priorities). | Must | Build Spec Section 4 |
| FR-FACT-3 | On any factor change, **instantly update** QA priorities, all dimension rankings, charts, and analyses. | Must | Build Spec Section 14.2 |
| FR-FACT-4 | Support **collapsible groups** and progressive disclosure of advanced factors. | Should | UI/UX Playbook Task 3, T9 |
| FR-FACT-5 | Apply documented **default factor levels** (all level 0 except time-to-market = 1). | Must | Build Spec Section 12 |

### 3.3 Step 2 — Quality-Attribute Priorities

| ID | The system shall… | Priority | Trace |
|---|---|---|---|
| FR-QA-1 | Derive QA weights from factors via the **factor→QA influence matrix** (contribution = influence × level; budget inverted), clamp negatives to 0, and **normalize to sum 100 %**. | Must | Build Spec Section 5 |
| FR-QA-2 | Display the 12 QA weights as a ranked bar chart (the **utility tree**). | Must | Build Spec Section 8 |
| FR-QA-3 | In Expert mode, allow **direct override** of any QA weight and **lock** it so factor changes do not overwrite it. | Should | Build Spec Section 5 |
| FR-QA-4 | Visibly mark **economic QAs** (cost efficiency, time-to-market) as outside the ISO product-quality model. | Must | Build Spec Section 3 |

### 3.4 Step 3 — Recommendation & Analysis

| ID | The system shall… | Priority | Trace |
|---|---|---|---|
| FR-REC-1 | Recommend across **five orthogonal dimensions** (deployment, communication, data, code structure, frontend). | Must | Build Spec Section 6 |
| FR-REC-2 | Compute each option's **composite score** and rank options within each dimension, displaying scores normalized to 0–100. | Must | Build Spec Section 6, Section 8 |
| FR-REC-3 | Render a **radar chart** overlaying the top options across all 12 QAs. | Must | Build Spec Section 8 |
| FR-REC-4 | Show a per-option **QA contribution breakdown** that reconciles exactly to the composite score. | Must | Build Spec Section 8, Section 14.10 |
| FR-REC-5 | Provide a **comparison mode** for 2–3 options side-by-side. | Should | Build Spec Section 8 |
| FR-REC-6 | Flag a **close call** when the top two options in a dimension are within 10 %. | Must | Build Spec Section 8 |
| FR-REC-7 | Perform **sensitivity analysis**: name the single factor change (±1 level) that flips the D1 winner, or label the result **robust**. | Must | Build Spec Section 8 |
| FR-REC-8 | Present a **risk register** for the chosen options (likelihood, impact, mitigation). | Must | Build Spec Section 8, Section 9 |
| FR-REC-9 | Detect **anti-patterns** on the chosen combination via rules with severity (info/warning/danger). | Must | Build Spec Section 10 |
| FR-REC-10 | Generate suggested, measurable **fitness functions** from the top-weighted QAs. | Should | Build Spec Section 11 |
| FR-REC-11 | Show qualitative **cost & operational-complexity indicators** (Low/Med/High) per D1 option. | Should | Build Spec Section 8 |
| FR-REC-12 | Given an optional **current architecture**, suggest an incremental **migration path** (Strangler Fig where legacy is heavy). | Should | Build Spec Section 8 |
| FR-REC-13 | Provide a **"How scoring works" / methodology panel** citing ISO/IEC 25010:2023, ATAM, ADD, and fitness functions. | Must | Build Spec Section 8; Charter Section 1 |

### 3.5 Step 4 — Outputs & Sharing

| ID | The system shall… | Priority | Trace |
|---|---|---|---|
| FR-OUT-1 | Export an **ADR in MADR format**. | Must | Build Spec Section 12 |
| FR-OUT-2 | Export a **full report** (Markdown + print stylesheet). | Must | Build Spec Section 12 |
| FR-OUT-3 | Export **scores as CSV** and the **assessment as JSON**. | Should | Build Spec Section 12 |
| FR-OUT-4 | Provide a **share-via-URL** link that round-trips to identical state. | Must | Build Spec Section 14.14 |
| FR-OUT-5 | Render a **C4-style Mermaid diagram stub** reflecting the chosen D1 style. | Could | Build Spec Section 12 |
| FR-OUT-6 | Support **import/export of a custom configuration JSON** for extensibility. | Should | Build Spec Section 12 |

### 3.6 State, Persistence & Reproducibility

| ID | The system shall… | Priority | Trace |
|---|---|---|---|
| FR-STATE-1 | Persist the full assessment state to **`localStorage`**. | Must | Build Spec Section 2 |
| FR-STATE-2 | Encode the full state in the **URL hash** for shareable links. | Must | Build Spec Section 2 |
| FR-STATE-3 | Record the **model version** in every result, export, and shared URL. | Must | Charter Section 15 (R8) |
| FR-STATE-4 | **Validate and sanitize** any state parsed from the URL before use. | Must | Charter Section 18 |

### 3.7 UI States & Feedback

| ID | The system shall… | Priority | Trace |
|---|---|---|---|
| FR-UI-1 | Show an always-visible **save-state indicator** (Saving / All changes saved). | Must | UI/UX Playbook Task 4 |
| FR-UI-2 | Use **skeleton loading** (not a full-screen spinner) while recomputing. | Must | UI/UX Playbook Task 1 |
| FR-UI-3 | Present **three-layer errors** (what / why / how to fix) with a retry and a copyable request ID for recoverable failures. | Must | UI/UX Playbook Task 5 |
| FR-UI-4 | Provide **undo** for destructive actions. | Must | UI/UX Playbook Task 4 |
| FR-UI-5 | Provide a **guiding empty state** with a "load sample data" action. | Must | UI/UX Playbook Task 9 |
| FR-UI-6 | Avoid layout shift and keep transitions within 150–250 ms. | Should | UI/UX Playbook Task 1 |

---

## 4. Non-Functional Requirements

| ID | The system shall… | Priority | Trace | Verify |
|---|---|---|---|---|
| NFR-PERF-1 | Reflect any factor change in priorities, charts, and rankings within **~100 ms perceived** latency on a mid-range device. | Must | UI/UX Playbook Task 1 | T |
| NFR-PERF-2 | Enable a **median time-to-first-recommendation ≤ 5 minutes** (KPI K3). | Must | Charter Section 4 (K3) | T |
| NFR-USE-1 | Achieve a **System Usability Scale ≥ 75** at beta (KPI K5). | Should | Charter Section 4 (K5) | T |
| NFR-USE-2 | Be usable **without mandatory setup** (presets and sample data available immediately). | Must | UI/UX Playbook Task 9 | D |
| NFR-USE-3 | Be **consistent and predictable**: honor standard shortcuts; one term per concept; consistent color meaning. | Must | UI/UX Playbook Task 6 | I |
| NFR-A11Y-1 | Meet **WCAG 2.2 AA** contrast in both themes. | Must | Charter Section 5 | T |
| NFR-A11Y-2 | Be **fully keyboard-operable**, with accessible names on all controls. | Must | Build Spec Section 14.15 | T |
| NFR-I18N-1 | Resolve **every string from the i18n dictionary** with no untranslated keys when toggling language. | Must | Build Spec Section 14.13 | T |
| NFR-REL-1 | Never lose user data **without a warning or undo**. | Must | Charter Section 11 | D |
| NFR-REL-2 | Keep **old shared URLs and exports readable** across releases (breaking changes only on MAJOR). | Should | Charter Section 15 | A |
| NFR-SEC-1 | Avoid `eval`/`dangerouslySetInnerHTML` on untrusted input and **sanitize URL-parsed state**. | Must | Charter Section 18 | I |
| NFR-SEC-2 | Use a **lockfile and dependency vulnerability scanning**; consider a Content Security Policy. | Should | Charter Section 18 | I |
| NFR-SEC-3 | Contain **no secrets** in the codebase. | Must | Charter Section 18 | I |
| NFR-PRIV-1 | Collect **no PII** and store data **only** in the browser and user-shared URL. | Must | Charter Section 17 | I |
| NFR-PRIV-2 | Include **no analytics by default**; any future analytics must be privacy-respecting, declared, and able to be disabled. | Must | Charter Section 17 | I |
| NFR-COMPAT-1 | Be **responsive to ≥ 360 px** and function on modern evergreen browsers. | Must | Charter Section 9 | T |
| NFR-COMPAT-2 | Be deployable as a **static site** (incl. a sub-path base, e.g. GitHub Pages). | Must | Deployment guide | D |
| NFR-MAINT-1 | Keep **all model values** (factors, weights, fit vectors, rules, strings) in `config/`/`i18n/`, never hard-coded. | Must | Build Spec Section 13; Charter Section 14.7 | I |
| NFR-MAINT-2 | Provide **unit tests** for scoring, normalization, sensitivity, URL round-trip, and ADR generation, run in **CI**. | Must | Build Spec Section 14; Charter Section 14.7 | T |
| NFR-MAINT-3 | Maintain a **model version distinct from the app (SemVer) version**. | Should | Charter Section 15 | I |

---

## 5. Data & Decision-Model Requirements

The decision model is data, not code, and **shall** live in configuration so it is auditable and
extensible (NFR-MAINT-1). The authoritative definitions are in [Build Spec v3](../specs/build-spec-v3.md);
this section states the scoring pipeline, the required datasets, and their integrity rules.

### 5.1 Scoring pipeline — one input, five coordinated decisions

A single set of factor answers drives **all five dimensions at once**, through a shared
quality-attribute priority layer (the "utility tree"). The dimensions are **orthogonal** — chosen
together, not one instead of another — and the resulting combination is then checked for
anti-patterns.

```mermaid
flowchart TB
    F["Project factors<br/>≥12 × 3 levels"] --> W["Quality-attribute priorities<br/>utility tree · normalized to 100%"]
    W --> D1["D1 · Deployment Granularity"]
    W --> D2["D2 · Communication Style"]
    W --> D3["D3 · Data Management"]
    W --> D4["D4 · Code Structure"]
    W --> D5["D5 · Frontend Architecture"]
    D1 --> X["Combination analysis<br/>anti-patterns · sensitivity · risks · migration"]
    D2 --> X
    D3 --> X
    D4 --> X
    D5 --> X
    X --> O["Coordinated recommendation<br/>+ ADR / report / share link"]
```

> **In plain language:** you answer the questions once; the tool decides five things about your
> app together — how it's split, how the parts talk, where data lives, how each part is organized
> inside, and how the screens are built — and warns you if the combined choices clash.

**Worked example — one change ripples across all five dimensions.** Raising *scale*, *async
workload*, *team size*, and *DevOps maturity* (the high-traffic e-commerce preset) lifts the
**scalability**, **availability**, and **deployability** weights, shifting every dimension at once:

| Dimension | Top recommendation | Why |
|---|---|---|
| D1 · Deployment Granularity | Microservices / Serverless | highest deployability & scalability |
| D2 · Communication Style | Event-driven / Async | absorbs load & traffic spikes |
| D3 · Data Management | Database-per-service / CQRS | independent read/write scaling |
| D4 · Code Structure | Hexagonal / Clean | maintainability for a large team |
| D5 · Frontend Architecture | Micro-frontends | independent UI deployment |
| ⚠ Combination | Microservices + single shared DB → *distributed monolith* | flagged by FR-REC-9 |

### 5.2 Required datasets

These datasets **shall** be held in configuration:

| ID | The system shall maintain… | Trace |
|---|---|---|
| FR-DATA-1 | **12 quality attributes**, each with id, EN/ID name & definition, ISO 25010 mapping, and an economic flag. | Build Spec Section 3 |
| FR-DATA-2 | **≥12 (target 14) factors**, each with id, EN/ID label, three EN/ID level labels, EN/ID help, and a group. | Build Spec Section 4 |
| FR-DATA-3 | A **factor→QA influence matrix** of non-zero influences (budget inverted). | Build Spec Section 5 |
| FR-DATA-4 | **Five dimensions** with options, each option carrying a 12-value `qaFit` vector (1–5), educational metadata (EN/ID), and risks. | Build Spec Section 6, Section 7, Section 9 |
| FR-DATA-5 | **Anti-pattern rules** (condition + severity + EN/ID message). | Build Spec Section 10 |
| FR-DATA-6 | **Fitness-function templates** keyed to QAs (EN/ID). | Build Spec Section 11 |
| FR-DATA-7 | **Scenario presets** and **migration paths**. | Build Spec Section 12 |
| FR-DATA-8 | A defined **persisted-state schema** and a stable **URL-encoding** of it, both versioned by model version. | Build Spec Section 2; FR-STATE-3 |
| FR-DATA-9 | A documented **custom-configuration JSON** schema for import/export. | Build Spec Section 12 |

**Integrity rules:** unlisted `qaFit` entries default to a neutral 3; normalized QA weights always
sum to 100; a contribution breakdown always reconciles to the composite score (FR-REC-4).

### 5.3 Preset calibration (targets)

Each scenario preset **shall** set factor levels that produce the expected top recommendation
below. These outcome targets make the model **verifiable** — a preset that no longer yields its
expected result is a regression. The exact factor levels live in configuration ([Build Spec Section 12](../specs/build-spec-v3.md))
and are confirmed with a Domain Advisor and recorded as an ADR ([Charter Section 14.4](../01-discovery-and-planning/discovery-and-planning.md#14-governance--contribution)).

| Preset | D1 Deployment | D2 Communication | D3 Data | D4 Code | D5 Frontend | Primary driver |
|---|---|---|---|---|---|---|
| Startup MVP | Monolith | Synchronous | Single shared DB | Layered | SPA | time-to-market, low cost |
| Bank / healthcare (regulated) | Modular Monolith | Synchronous | Single shared DB | Hexagonal / Clean | SPA / SSR | security, strong consistency |
| High-traffic e-commerce | Microservices | Event-driven | Database-per-service | Hexagonal | Micro-frontends | scalability, availability |
| Sensors / live data (IoT) | Microservices / Serverless | Streaming | CQRS / Event Sourcing | Hexagonal | SPA | performance, data volume |
| Internal tool | Modular Monolith | Synchronous | Single shared DB | Layered | SPA | maintainability, simplicity |

> Anti-pattern guardrails apply per preset — e.g. choosing CQRS/Event Sourcing for a short-lived
> Startup MVP triggers the over-engineering warning, and Microservices + a single shared DB
> triggers the distributed-monolith danger (FR-REC-9).

---

## 6. Use Cases

**UC-1 — Guided assessment (P3).** *Precondition:* first visit. *Flow:* pick a preset or answer
factors → view derived priorities → read the recommended plan with plain-language reasoning →
export a report. *Postcondition:* a saved assessment + a downloadable report. *(FR-SHELL-5,
FR-FACT-\*, FR-QA-1/2, FR-REC-\*, FR-OUT-2)*

**UC-2 — Expert tuning (P1).** *Flow:* switch to Expert → override and lock selected QA weights →
inspect the contribution breakdown and data grid → compare top options. *Postcondition:* a tuned
recommendation with auditable math. *(FR-SHELL-1, FR-QA-3, FR-REC-4/5)*

**UC-3 — Document the decision (P2).** *Flow:* finalize options → export an ADR (MADR) and the
full report. *Postcondition:* MADR file capturing context, drivers, options, outcome,
consequences. *(FR-OUT-1/2, FR-STATE-3)*

**UC-4 — Share & reproduce.** *Flow:* generate a share link → recipient opens it → identical
state is restored with the original model version. *Postcondition:* reproduced assessment.
*(FR-OUT-4, FR-STATE-2/3/4)*

**UC-5 — Evolve a legacy system.** *Flow:* set current architecture = monolith with heavy legacy
→ receive an incremental migration path. *Postcondition:* a staged, lower-risk plan.
*(FR-REC-12)*

---

## 7. Acceptance Criteria

The executable, scenario-level acceptance criteria are enumerated in
[Build Spec v3 Section 14](../specs/build-spec-v3.md); this SRS adopts them as its verification basis.
Key gates:

- **AC-1.** `npm install && npm run dev` runs clean; `npm run test` and `npm run build` pass; CI present. *(NFR-MAINT-2)*
- **AC-2.** Defaults (all 0, time-to-market = 1) → D1 top = **Monolith**; QA weights show time-to-market highest. *(FR-FACT-5, FR-QA-1)*
- **AC-3.** team = 2, distribution = 2, scale = 2, devops = 2, ttm = 0 → D1 top = **Microservices**. *(FR-REC-2)*
- **AC-4.** Selecting Microservices + Single shared DB triggers the **distributed-monolith** danger. *(FR-REC-9)*
- **AC-5.** A contribution table reconciles exactly to the composite score. *(FR-REC-4)*
- **AC-6.** The sensitivity card names a flipping factor or correctly labels the result robust. *(FR-REC-7)*
- **AC-7.** Language toggle updates **all** strings; dark mode fully styled. *(NFR-I18N-1, FR-SHELL-3)*
- **AC-8.** Share link round-trips to identical state; ADR/report exports are valid; config import/export round-trips. *(FR-OUT-\*, FR-STATE-2)*
- **AC-9.** Fully keyboard-operable; AA contrast in both themes. *(NFR-A11Y-1/2)*

**Release gate (Charter [Section 11](../01-discovery-and-planning/discovery-and-planning.md#11-success-criteria--project-level-definition-of-done)):**
all UX-quality criteria met; KPIs K3 and K5 met at beta; no critical defects.

---

## 8. Requirements Traceability Matrix

| Requirement group | Charter source | Build Spec | KPI |
|---|---|---|---|
| FR-SHELL (modes, i18n, theme, presets, disclaimer) | Section 5, Section 7, Section 21 | Section 2, Section 12 | K2, K6 |
| FR-FACT (factors) | Section 5 | Section 4, Section 5 | K3 |
| FR-QA (priorities/utility tree) | Section 1, Section 5 | Section 3, Section 5 | — |
| FR-REC (5 dimensions + analysis) | Section 1, Section 5 | Sections 6–11 | K2, K6 |
| FR-OUT (ADR, report, CSV/JSON, share, config) | Section 5 | Section 12 | K4 |
| FR-STATE (persistence, reproducibility) | Section 15, Section 18 | Section 2 | — |
| FR-UI (mature states) | Section 11 | Section 12 | K2, K5 |
| FR-DATA (decision model) | Section 14.7 | Sections 3–12 | — |
| NFR-PERF | Section 4 | Section 1 | K3 |
| NFR-USE / A11Y / I18N | Section 5, Section 11 | Section 14 | K5, K6 |
| NFR-SEC / PRIV | Section 17, Section 18 | Section 2 | — |
| NFR-MAINT | Section 14.7, Section 15 | Section 13, Section 14 | K7 |

---

## 9. Open Issues & To Be Determined

| # | Open issue | Owner | Notes |
|---|---|---|---|
| OI-1 | Final factor count (≥12 vs the 14 in Build Spec Section 4) and grouping | Owner | Confirm at spec freeze (M1) |
| OI-2 | Preset factor-level values (config) that hit the Section 5.3 outcome targets | Owner + Domain Advisor | Outcome targets defined in [Section 5.3](#5-data--decision-model-requirements); exact levels to be calibrated & ADR-logged |
| OI-3 | Whether the C4 Mermaid stub (FR-OUT-5) is in v1.0 or deferred | Owner | Currently **Could**-priority |
| OI-4 | D4/D5 `qaFit` values (documented as defensible defaults) | Domain Advisor | Recorded as an ADR per Charter Section 14.4 |
| OI-5 | Quantitative performance budgets (bundle size, p95 interaction) | Engineer | Set during Phase 3 design |
| OI-6 | Empirical-validation study design (deferred per Charter Section 5) | Owner | Out of MVP scope; tracked for v3.0 |

---

> **In plain language:** this document lists exactly what the app must do (the features) and how
> well it must do them (speed, accessibility, safety), each item numbered and linked back to the
> charter so nothing is built without a reason — and nothing the charter promised is forgotten.
