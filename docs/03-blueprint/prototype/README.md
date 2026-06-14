# UI Prototype

A self-contained, interactive HTML prototype of the Architecture Advisor interface — the
visual and interaction reference for the build.

![Architecture Advisor UI prototype](preview.png)

## Open it

Open [`index.html`](index.html) directly in any modern browser — no build step, no server:

```bash
# from the repository root
xdg-open docs/03-blueprint/prototype/index.html   # Linux
open docs/03-blueprint/prototype/index.html        # macOS
```

It loads the [Tabler Icons](https://tabler.io/icons) webfont and Inter/JetBrains Mono from a
CDN, so an internet connection gives the intended look; it still works offline with fallback
fonts.

## What it demonstrates

This is a clickable mockup (no real scoring engine yet) that shows the intended UX:

- **Guided / Expert modes** — plain-language labels vs. technical terms and editable weights.
- **4-step flow** — factors → quality priorities → recommendation across 5 dimensions → export.
- **Trade-off radar** + ranked composite scores; toggle architectures on/off.
- **Transparency** — "How does it decide?" panel, sensitivity ("what would change this?"),
  the distributed-monolith anti-pattern warning, and a migration path.
- **Technical-user polish** — command palette (`⌘K`), keyboard shortcuts, persistent
  save-state indicator, skeleton loading, three-layer error with request ID + retry, CSV/JSON
  export, guiding empty state, dark/light toggle.

## Notes

- `preview.png` is a rendered screenshot of `index.html`, used in the READMEs.
- This prototype is the **design reference**; the production app will implement the same UX on
  the [planned tech stack](../../specs/build-spec-v3.md#2-tech-stack-use-exactly-this)
  (Vite + React + TypeScript) with the design values living in editable config.
- The per-option **`qaFit` vectors** encoded here are the canonical baseline for D4/D5: they were
  promoted verbatim into the [Model Data Sheet](../model-data-sheet.md) Section 4. The **composite
  scores/percentages** displayed, however, are illustrative placeholders until the real scoring
  engine exists.

## Canonical vs illustrative — what to take from the specs, not the mockup

To avoid any mismatch in development, treat this prototype as a **UX/interaction reference only**.
The data, scope, and copy come from the specs. A cross-check guard
([`scripts/cross-check-docs.mjs`](../../../scripts/cross-check-docs.mjs), check 12) enforces the one
piece that must agree.

| Aspect | Source of truth for the build |
|---|---|
| **`qaFit` vectors** | ✅ **Canonical here** — identical to [Model Data Sheet](../model-data-sheet.md) Section 4, guarded by cross-check 12 |
| Composite scores / percentages (e.g. "84") | *Illustrative* — the engine computes them per the [Scoring Algorithm](../scoring-algorithm.md) |
| Option display names (e.g. "Layered (N-tier)") | Use the canonical names in [Model Data Sheet](../model-data-sheet.md) Section 4 + [Option Content Sheet](../option-content-sheet.md) |
| Factors shown | The mockup shows only a **few** for illustration; build **all 14** from [Model Data Sheet](../model-data-sheet.md) Section 2 |
| Presets shown | The mockup shows **4**; build **all 5** from [Model Data Sheet](../model-data-sheet.md) Section 6 — **`internal-tool` is not in the mockup** |
| Bilingual (ID/EN) copy | From the factor content (Model Data Sheet Section 2.1) and the [Option Content Sheet](../option-content-sheet.md) |
| Scope (what features exist in v1.0) | The [SRS](../../02-requirement-analysis/software-requirements-specification.md), not the mockup (e.g. the C4 stub is in v1.0 even though the mockup doesn't render one) |

In short: **build the model and scope from the specs; use the prototype for look, layout, and
interaction.** Only the `qaFit` vectors are shared canonical data, and they are machine-checked.
