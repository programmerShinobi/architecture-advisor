# DECISIONS

Choices made while building the application that were **not** fully pinned by the specs, plus a
few notable interpretations. The model values themselves are canonical — see the
[Model Data Sheet](docs/03-blueprint/model-data-sheet.md) and
[Scoring Algorithm Spec](docs/03-blueprint/scoring-algorithm.md); this file records the rest.

## Model

- **D4/D5 `qaFit` were not invented here.** The Build Spec left them "to assign & document," but
  they are already ratified in [Model Data Sheet Section 4](docs/03-blueprint/model-data-sheet.md)
  (interim, ADR-0001). `src/config/dimensions.ts` reproduces those exact vectors.
- **Cost & operational-complexity indicators** (`src/config/costOps.ts`) are **defensible expert
  defaults**, not values from the Model Data Sheet (the prototype shows none). Chosen profile per
  D1 option: Layered/Monolith/Modular-Monolith = ops *low* / infra *low*; Microservices = *high* /
  *high*; Serverless = *med* / *med* (scales to zero but variable + lock-in). Editable like any
  config; an independent reviewer may revise.
- **Display normalization** is `round(composite / 5 × 100)` (Scoring Algorithm Section 7), **not** min-max
  — min-max would always show the worst option as 0 and exaggerate small gaps.
- **`migrationPathChosen` is kept `false`** in the anti-pattern engine so the `legacy-without-plan`
  rule still fires; the migration card is informational guidance, not a model input.

## Scores & presets vs the prototype

- The UI matches [the prototype](docs/03-blueprint/prototype/index.html) **exactly** in look, copy,
  and features, with two deliberate exceptions (the prototype's are illustrative):
  - **Scores are computed live** from the engine, not the mockup's fixed numbers (e.g. 84%).
  - **All 5 presets** are shipped (the mockup chip bar showed 4; `internal-tool` was absent).

## UI / tech

- **Icons:** `@tabler/icons-react` (tree-shaken) instead of the prototype's full icon **webfont** —
  identical glyphs at a few KB vs a 457 KB font + 249 KB CSS, protecting the FCP budget (ADR-008).
- **All visuals are hand-built SVG/CSS** (radar, priority/score bars, **and the C4 diagram stub**);
  **`recharts` and `mermaid` were both removed**. recharts duplicated the prototype's custom radar;
  mermaid failed to render the C4 stub reliably and was a heavy lazy dependency. Hand-built SVG is
  deterministic, theme-aware, always renders, and keeps the bundle small.
- **Dark by default** (matches the prototype); light is opt-in via the `html.light` class.
- **Guided/Expert reconciliation:** the prototype has no separate analysis section, but the Build
  Spec mandates a risk register, fitness functions, cost/ops indicators, a C4 stub, methodology
  references, and a glossary. Guided mode renders **exactly** the prototype's flow; those extra
  panels are surfaced in an **expert-only** section so nothing mandated is lost.
- **Primary factors:** the 3 shown by default (`team`, `scale`, `consistency`) mirror the
  prototype's three visible questions; the other 11 sit behind "Show the other N factors".
- **Custom-config import/export** is implemented as **scenario** JSON (factors + selections +
  overrides + mode + language), the basic version per the charter; richer org-level model-config
  editing remains the deferred v2.x item.
- **Omitted prototype theater:** the mockup's artificial skeleton-on-recompute and empty state are
  not reproduced — the live engine always has a result, so an empty state would mislead.

## Content & i18n

- **Authored copy:** guided factor questions, plain QA labels, the per-dimension "good / cost /
  know" narrative, per-option blurbs, migration steps, and short radar labels were ported from the
  prototype (English) and **translated to Indonesian** to match. The 3 factor questions and 4 QA
  labels shown in the prototype are verbatim; the rest follow the same register. Indonesian copy is
  **interim** — a professional translator review is welcome (charter Section 14.2).
- **Canonical bilingual content** (factor labels/levels/help, option names, anti-pattern messages,
  fitness templates, risks) is reproduced verbatim from the Model Data Sheet and Option Content
  Sheet — see [EXTENDING.md](EXTENDING.md) for where each lives.
