# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/) (charter
[Section 15](docs/01-discovery-and-planning/discovery-and-planning.md#15-versioning-policy--evolution-roadmap)).
The decision **model** carries its own version, recorded in the
[ADR log](docs/adr/).

## [Unreleased]

### Changed (UI redesign — in progress on `redesign/ui-ux`)

- **Stage 1 — design tokens.** New `--aa-*` token layer (fluid spacing/type via `clamp()`, soft
  elevation, 44 px touch targets, global `:focus-visible` ring) + base classes (`aa-page/frame/
  surface/panel/card/wrap/touch`), mirrored into Tailwind utilities. Documented in design-spec §6.1;
  the "prototype-exact look" decision is superseded (*look only* — copy, features, and the model are
  unchanged; see DECISIONS.md). Canonical breakpoints: ≤640 / 641–1024 / ≥1025 px.

- **Stage 2 — Advisor restyle.** App shell moves to the fluid aa- classes (aa-page/frame/surface/
  panel); Header, nav, and StepTracker paddings tokenized; keyboard-only chrome (⌘K, ?, save status)
  marked `aa-hide-phone` for the phone tier; dimension cards get soft elevation + token padding.
- **Stage 3 — Insights restyle.** LearnView wrappers move to `.aa-panel` (fluid padding); card and
  landing-card paddings + headings tokenized (`--aa-card-pad`/`--aa-fs-xl/2xl` fluid type); the
  card hover shadow now uses the theme-aware `--aa-shadow-md` token instead of a hardcoded rgba.
- **Stage 4 — responsiveness, a11y & tests.** Phone tier (≤640 px): `aa-hide-phone` chrome hidden,
  tighter dividers, phone-friendly overlay padding; overflow safety (`img/svg max-width`, prose
  `pre` scrolls, long words wrap); 44 px touch targets extended to chips + mode toggle on coarse
  pointers. New `e2e/responsive.spec.ts` gates **no horizontal scroll at 360/768/1440 px** on the
  Advisor and an Insights article (E2E suite: 10 → **14**).

### Added

- **Insights content area (Wave A + pipeline)** — a new **Insights** tab (top nav: Advisor · Insights) with
  cited, dual-audience content about the architectures the tool evaluates. Ships **client-rendered and
  lazy-loaded** (SSG deferred by decision).
  - **Every architecture appears in all three sections — Catalog, Playbook, and Review.** All are
    **data-driven from the frozen model** — the full **21 options across D1–D5**, grouped by decision
    — so coverage can never be partial or drift from the engine. Each section is a different lens on
    the same architecture: **Catalog** = what it is / when it fits / what it costs; **Playbook** = how
    to adopt it; **Review** = what to check when evaluating it (`src/config/readerAngles.ts`). **No
    content is duplicated across lenses** — only the Catalog carries the explanation; Playbook/Review
    show their angle plus a "Full explanation in the Catalog →" cross-link. Each architecture cites
    **multiple trusted references** (standards, seminal books, and peer-reviewed journals/surveys —
    Newman, Kleppmann, Fowler, Richardson, plus IEEE/JSS/VLDB/CACM papers). No fabricated sources.
  - **Guided / Expert reading mode in Insights** — reuses the Advisor's mode (a single control in the
    header, no duplicate toggle); newcomers read the plain layers, experts additionally get the
    *Deeper* notes, mechanism, and cited journals. Markdown articles support `:::guided` / `:::expert`
    blocks. Engaging card UI (hover cue, icon chips, ref counts) for both audiences.
  - **Cross-cutting guides & methods (Markdown)** — Playbook adds 7 decision guides (writing good
    ADRs · Strangler-Fig migration · choosing communication / data / code-structure / frontend · when
    to use microservices); Review adds 6 methods (ATAM checklist · detecting a distributed monolith ·
    fitness functions · data-consistency review · serverless readiness · avoiding premature
    microservices). Each with several trusted sources, validated by the **content gate**
    (`npm run content:validate`, wired into CI) — schema, primary sources, review dates, and that
    **every `related_advisor` id resolves to the frozen model**.
  - Pipeline is **dependency-free** (hand-built safe Markdown renderer + frontmatter parser). Rollout
    plan + rationale: [content rollout plan](docs/03-blueprint/content-rollout-plan.md);
    see [DECISIONS.md](DECISIONS.md) for the SSG-deferred / no-router / dependency-free / data-driven-Catalog choices.
- **Detailed architecture explanations in the Manual/Guide** — the in-app Guide now includes a
  plain-language, evidence-grounded explanation of **every architecture the Advisor evaluates** (all
  five decisions, D1–D5) plus a bibliography, so the Guide is a genuine deep-dive rather than a
  summary. Each option gets *What / When it fits / What it costs / Deeper* — written for newcomers
  **and** experts, bilingual EN/ID, AA-clean in both themes. Grounded in recognised standards and the
  software-architecture literature (Bass · Newman · Kleppmann · Fowler · Richards & Ford · SEI ·
  peer-reviewed surveys) with real, linked citations — no fabricated sources. Canonical write-up:
  [`docs/03-blueprint/architecture-reader.md`](docs/03-blueprint/architecture-reader.md); in-app
  content in [`src/config/readerContent.ts`](src/config/readerContent.ts). The **Manual is now
  lazy-loaded** (a separate on-demand chunk), so this depth adds **nothing** to first-load JS (initial
  gzip actually dropped ~110kB → ~107kB); the bundle guard now budgets initial vs. total JS separately.

### Changed

- **React 18 → 19** (with matching `@types`). No source changes (the app already uses `createRoot`);
  bundle grew ~115kB → ~129kB gzip, still within the CI budget.
- **CI:** GitHub Actions bumped to current majors (checkout v7, cache v5, upload-artifact v7,
  configure-pages v6, deploy-pages v5) — clears the Node-20 runner deprecation.
- **Dependabot** now groups only minor/patch updates; each major opens its own PR (so breaking
  bumps like Vite/Vitest/ESLint/Tailwind/TypeScript are reviewed one at a time).

### Fixed

- **WCAG AA color-contrast** across both themes — raised the tertiary-text tokens, the light-theme
  success green, and the de-emphasised opacities (off-state radar chips, dimmed ranking rows). The
  E2E a11y suite now gates **full** color-contrast in a real browser (no more `fixme`); the same
  tokens are mirrored in the UI prototype and the README previews.

### Known / tracked

- **UAT** scripted scenarios are authored but not yet executed with participants.

## [1.0.0] — 2026-06-20

First public release — **live at <https://programmershinobi.github.io/architecture-advisor/>**.

### Added

- Client-side decision-support app (Vite + React + TypeScript): the four-step flow — project
  factors → quality priorities → recommendation across 5 dimensions → export — with the trade-off
  radar, anti-pattern detection, sensitivity & migration paths, fitness functions, risk register,
  cost/ops indicators, methodology, a C4-style diagram stub, and a glossary.
- Guided / Expert modes, EN/ID i18n, and dark / light themes.
- Exports: ADR (MADR), full report, Print/PDF, CSV, JSON, a shareable URL, and scenario import.
- A transparent scoring engine — a TypeScript twin of the verified reference model
  ([`scripts/verify-model.mjs`](scripts/verify-model.mjs)); the model itself is documented in the
  [Blueprint](docs/03-blueprint/).
- Quality gates: 62 unit / component / a11y tests (Vitest), Playwright E2E (smoke, share deep-link,
  structural a11y, keyboard), three model-integrity guards, and CI gates for the bundle-size budget
  and a production-dependency audit. Deployed to GitHub Pages via GitHub Actions.
- Maintenance scaffolding: this changelog, a [security policy](SECURITY.md), Dependabot (npm +
  GitHub Actions, weekly), and issue / pull-request templates.

**Model:** interim baseline (ADR-0001) — the qaFit vectors, factor→QA influence matrix, presets,
and anti-pattern rules as documented in the
[Model Data Sheet](docs/03-blueprint/model-data-sheet.md).

[Unreleased]: https://github.com/programmerShinobi/architecture-advisor/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/programmerShinobi/architecture-advisor/releases/tag/v1.0.0
