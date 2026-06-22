# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/) (charter
[Section 15](docs/01-discovery-and-planning/discovery-and-planning.md#15-versioning-policy--evolution-roadmap)).
The decision **model** carries its own version, recorded in the
[ADR log](docs/adr/).

## [Unreleased]

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
