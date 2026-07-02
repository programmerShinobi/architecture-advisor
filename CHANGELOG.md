# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/) (charter
[Section 15](docs/01-discovery-and-planning/discovery-and-planning.md#15-versioning-policy--evolution-roadmap)).
The decision **model** carries its own version, recorded in the
[ADR log](docs/adr/).

## [Unreleased]

### Added

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
