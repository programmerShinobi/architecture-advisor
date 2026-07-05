# Content & Features Rollout — Plan (the "Insights" layer)

> **Phase 3 (Blueprint) artefact.** The design + rollout plan for the **Insights** content layer that
> wraps the Advisor. It was adapted to this **shipped, client-side SPA** after reviewing a generic
> implementation prompt whose assumptions did not match the codebase — the corrections are in
> [Appendix A](#appendix-a). Cross-cutting records live in the SDLC docs (SRS §3.10, the design
> spec, the test plan) and in root [`DECISIONS.md`](../../DECISIONS.md); this file is the single
> structured home for the plan itself.
>
> **Status:** *client-rendered first (no SSG)* — **Wave A + pipeline and Wave B (Library) implemented**.
> **Language:** this plan and all code/docs are English; article content + UI strings are bilingual
> (ID default), per the repo convention.

## 1. Mission & audience

Help **both newcomers (awam) and experts** genuinely understand software architecture — not just get
a score. The Insights layer teaches the *why*, cites real sources, and links every claim back to the
Advisor's frozen decision model so learning and tooling reinforce each other.

Two audiences, one text: a **plain-language layer** (TL;DR → what / when it fits / what it costs) and
a **deeper layer** (mechanism, evidence, trade-offs, cited journals) — the same dual-audience pattern
the Guide uses, toggled by the app's **Guided / Expert** mode.

## 2. What already exists (build on it, don't duplicate)

- The **Advisor**: 14 factors → 12 quality attributes → recommendation across 5 dimensions (D1–D5),
  with a frozen, machine-verified scoring model.
- The **Manual / Guide** carries in-app, cited D1–D5 explanations
  ([`src/config/readerContent.ts`](../../src/config/readerContent.ts), canonical
  [architecture-reader.md](architecture-reader.md)).
- The **model as data** in [`src/config/`](../../src/config/) and the
  [Model Data Sheet](model-data-sheet.md) — the single source of truth for dimensions, options, qaFit.

**Anti-duplication rule:** anything about D1–D5 / qaFit / QAs **derives from the model**, never
re-copied. **Catalog, Playbook, and Review** are therefore all *data-driven* (see §3), not
hand-authored per architecture — and no explanation is repeated across them.

## 3. Key decisions (rationale also in [`DECISIONS.md`](../../DECISIONS.md))

| Topic | Decision | Why (fit to this repo) |
|---|---|---|
| **Discoverability / SSG** | **Deferred.** Client-rendered inside the existing SPA; SSG is a separate future proposal only if search discoverability becomes a stated goal. | Hash-state SPA on GitHub Pages (no custom domain → limited SEO upside); SSG + router would risk hydration clashes with the Advisor's `#s=` share-state and the 120 kB initial-JS budget. |
| **Routing** | **Light**: a two-item top nav (Advisor · Insights) + in-view section/article state, lazy-loaded. **No `react-router`.** | Avoids a second navigation paradigm; the Advisor keeps sole ownership of the URL hash / share links. |
| **Section shape** | **All three sections are data-driven** from the model (`readerContent.ts` + `readerAngles.ts`) → every architecture (all 21 D1–D5 options), grouped by decision, through three lenses (Catalog = explain, Playbook = how-to-adopt, Review = what-to-check). Hand-authored Markdown is reserved for **cross-cutting** guides/methods listed under Playbook & Review. | Comprehensive by construction; cannot go partial or drift from the model. **No explanation is duplicated** — Playbook/Review cross-link to the Catalog. |
| **Content format** | **Markdown + YAML frontmatter** for the cross-cutting guides; rendered by a small **dependency-free, XSS-safe** renderer with `:::guided` / `:::expert` blocks. | Matches the repo's hand-built ethos (no `gray-matter` / `react-markdown` / micromark); keeps the Insights chunk small. |
| **Diagrams** | **Hand-built SVG or static images only. No Mermaid.** | DECISIONS.md already **rejected Mermaid** (unreliable + heavy). |
| **Frontmatter validation** | **Dependency-free guard** ([`scripts/check-content.mjs`](../../scripts/check-content.mjs)) in the style of the model guards — **not** `zod`. | The repo's guards are proudly dependency-free; it also cross-checks `related_advisor` against the frozen model. |
| **Content index** | Build-time via `import.meta.glob` in [`src/lib/content.ts`](../../src/lib/content.ts). | Statically analyzable, offline-capable, testable; no backend. |
| **`SITE_URL`** | Single source in `src/config/site.ts`. | Future custom-domain safe. |

## 4. Non-negotiables (the repo's standing discipline)

- **Frozen gates stay green:** `verify-model.mjs` + `cross-check-docs.mjs` exit 0. **Do not edit**
  `src/lib/scoring.ts`, frozen `src/config/*` model values/presets, those scripts, or
  [`docs-integrity.yml`](../../.github/workflows/docs-integrity.yml).
- **No backend, DB, accounts, AI calls, or runtime telemetry.** 100% client-side, base `/architecture-advisor/`.
- **All UI strings in `src/i18n`** (EN+ID, default **id**); EN/ID key parity is test-enforced.
- **Accessibility:** new views keyboard-navigable, axe-clean, AA contrast in both themes, responsive
  to 360 px — axe + keyboard tests.
- **Bundle budget** ([`check-bundle-size.mjs`](../../scripts/check-bundle-size.mjs)) stays green; the
  Insights area is lazy-loaded. Raise budgets only deliberately, with a note.

## 5. The "Minimum Viable Article" gate (`content:validate`, offline & blocking)

A Markdown article ships only if it passes `content:validate`:

1. Frontmatter valid against the schema.
2. **≥ 1 primary source** with a **well-formed** URL/DOI (format check only — no fetching).
3. Honest `evidence_strength` ∈ {strong, moderate, emerging}.
4. `last_reviewed` set and `review_due = last_reviewed + 12 months`.
5. At least the **id** version.
6. **Every `related_advisor` dimension/option resolves to a canonical id in the frozen model** — the
   anti-drift contract.
7. Unique slug + meta.

**Link liveness** (`links:check`) and **review cadence** (`content:review`) are **scheduled /
non-blocking** only — never on the build path, so CI can't turn red on its own months later.

## 6. Frontmatter schema (v1)

```yaml
title_id / title_en: string
slug: string                 # unique, kebab-case, matches the filename
section: catalog | playbook | review | library | roadmap | academy | lab
audience: [awam, expert]
summary_tldr_id / summary_tldr_en: string
evidence_strength: strong | moderate | emerging
last_reviewed: YYYY-MM-DD
review_due: YYYY-MM-DD        # = last_reviewed + 12 months (validated)
translation_status: id | en | id+en
related_advisor: { dimensions: [D1..D5], options: [<option-id>] }   # must exist in the model
sources: [ { label, venue, year, url } ]
status: draft | published
author: string
```

The contract lives in [`src/config/contentSchema.ts`](../../src/config/contentSchema.ts); the
authoring workflow is in [`EXTENDING.md`](../../EXTENDING.md).

## 7. Reading template (dual-audience)

TL;DR → plain explanation (`:::guided`) → deep dive with evidence (`:::expert`) → "Try in the
Advisor" → credibility block (multiple `sources[]`, evidence badge, "Terakhir ditinjau", and a
"Perlu ditinjau" flag once `review_due` passes). The **Catalog** renders the same shape from the model.

## 8. Scope delivered — Waves A & B + pipeline

**Phase 0 — Pipeline (client-rendered, no SSG):** `contentSchema.ts` (dependency-free types, no zod)
+ `site.ts` + `sections.ts`; `content.ts` (index via `import.meta.glob`), `frontmatter.ts`,
`markdown.tsx` (safe renderer + `:::guided`/`:::expert`); `check-content.mjs` + `content:validate`
wired into `ci.yml` (`docs-integrity.yml` untouched); `LearnView` (lazy) + `CredibilityBlock`; i18n.

**Phase 1 — Wave A:**
- **Every architecture appears in all three sections**, data-driven from the model — three lenses on
  the same 21 D1–D5 options (`readerContent.ts` + `readerAngles.ts`):
  - **Catalog** — what it is / when it fits / what it costs.
  - **Playbook** — how to adopt it (+ 7 cross-cutting decision guides in Markdown: ADRs, Strangler-Fig
    migration, choosing communication / data / code-structure / frontend, when to use microservices).
  - **Review** — what to check when evaluating it (+ 6 Markdown methods: ATAM checklist, detecting a
    distributed monolith, fitness functions, data-consistency review, serverless readiness, avoiding
    premature microservices).
- **No content is duplicated across lenses:** only the Catalog carries the explanation; a Playbook or
  Review page shows its own angle plus a **"Full explanation in the Catalog →"** cross-link.
- Each architecture carries **several cited references** (books + peer-reviewed journals/surveys).
- **Guided / Expert reading mode** (the app's mode; one control in the header — no duplicate).
- All Markdown guides pass `content:validate`.

**Wave B — delivered (2026-07-05):** the **Library** section is live with 5 trend articles — GenAI & architecture, green/carbon-efficient software (SCI / ISO/IEC 21031), architectural technical debt, the monolith→microservices decision map, and Conway’s Law / Team Topologies — each with real, current sources and honest `evidence_strength`; article-only sections render without repeating the architecture grid (no redundancy).

**Deferred (own future proposals):** SSG/SEO (sitemap/robots/hreflang/JSON-LD), Wave C (Roadmap, Academy quizzes, interactive Lab).

## 9. Definition of done (met)

Advisor + model gates unchanged and green; every article passes `content:validate`; new views
axe-clean + keyboard-navigable + AA both themes; i18n parity; `lint` / `test` / `build` /
`content:validate` / bundle budget green; `docs-integrity.yml` untouched; diagrams hand-built SVG
(no Mermaid); [`README.md`](../../README.md), [`EXTENDING.md`](../../EXTENDING.md),
[`DECISIONS.md`](../../DECISIONS.md), the [SRS](../02-requirement-analysis/software-requirements-specification.md)
(§3.10), the [design spec](design-specification.md), and the [test plan](../05-testing-qa/test-plan.md)
updated.

---

## Appendix A — corrections vs the generic implementation prompt

The generic prompt assumed things that do **not** hold here; the plan corrects them:

- **Missing spec:** the referenced plan file did not exist — this document is it (now in the docs).
- **zod:** not a dependency ("reuse the repo's zod approach" was false) → **NOT added**; validation
  is a dependency-free guard.
- **Mermaid / Recharts:** neither is installed; **Mermaid was consciously rejected** → not reintroduced.
- **SSG / `react-router`:** the app is a hash-state SPA → **deferred**.
- **Script/paths:** `verify:model` / `verify:docs` are not npm scripts (guards run as `node
  scripts/*.mjs`); `ci.yml` already existed; `src/lib/sensitivity.ts` does not exist (sensitivity is
  in `scoring.ts`); "ADR-0001" is the D4/D5 qaFit ratification, not the scoring contract.
- **Scope:** trimmed to Wave A + pipeline; Wave B/C and SSG deferred.

| Version | Date | Notes |
|---|---|---|
| 1.0 | 2026-07-03 | Relocated into the SDLC docs from the repo root; Wave A delivered (data-driven Catalog of all 21 architectures, Guided/Expert reading mode, 7 Playbook + 6 Review Markdown guides, dependency-free pipeline). |
