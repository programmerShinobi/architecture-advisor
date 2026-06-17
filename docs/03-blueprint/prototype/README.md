# UI Prototype

A self-contained, interactive HTML prototype of the Architecture Advisor interface, **kept in
sync with the implemented app** ([`src/`](../../../src/)). The shipped React app is now the
source of truth for the UI; this static mockup mirrors its look and interaction so the design can
be reviewed in one file without a build step.

<table>
  <tr>
    <th align="center" width="50%">Guided mode</th>
    <th align="center" width="50%">Expert mode</th>
  </tr>
  <tr valign="top">
    <td width="50%"><img alt="Architecture Advisor — Guided mode" src="preview-guided.png" /></td>
    <td width="50%"><img alt="Architecture Advisor — Expert mode" src="preview-expert.png" /></td>
  </tr>
</table>

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

A clickable mockup (illustrative numbers — the real engine lives in the app) mirroring the
shipped UI:

- **Guided / Expert modes** — plain-language labels vs. technical terms and editable weights.
- **4-step flow** — factors → quality priorities → recommendation across 5 dimensions → export.
- **Project factors as collapsible group dropdowns** (Team & delivery / Scale & performance /
  Domain, data & risk) — all 14 factors.
- **Header** — `Guide`, command palette (`⌘K`), shortcuts (`?`), Guided/Expert, EN/ID, dark/light.
- **Trade-off radar** + ranked composite scores; toggle architectures on/off.
- **Expert "Professional analysis" dropdowns** — cost & ops, fitness functions, risk register,
  methodology, glossary, and a **hand-built-SVG C4 stub**.
- **Transparency** — "How does it decide?", sensitivity ("what would change this?"), the
  distributed-monolith anti-pattern warning, and a migration path.
- **Outputs** — Export ADR, full report, **Print / PDF**, CSV/JSON, share link; plus the command
  palette's scenario A/B pin/compare and "Open the manual".
- **Polish** — save-state indicator, skeleton loading, three-layer error with request ID +
  retry, guiding empty state, reset-with-undo.

## Notes

- This mockup is **kept in sync with the implemented app** — it now shows all 14 factors (as group
  dropdowns), all 5 presets, the expert "Professional analysis" dropdowns, and a hand-built-SVG C4
  stub, matching `src/`. When the app's UI changes, update this file too.
- `preview-guided.png` / `preview-expert.png` are full-page screenshots of the **running app** — the
  same scenario in each mode (`npm run dev`, 1240px wide @2×); **regenerate them** after UI changes.
- The displayed **composite scores/percentages are illustrative** (one fixed scenario); the real
  numbers are computed live by the app's engine per the [Scoring Algorithm](../scoring-algorithm.md).
- The per-option **`qaFit` vectors** encoded here are canonical (identical to the
  [Model Data Sheet](../model-data-sheet.md) Section 4) and are machine-checked by
  [`scripts/cross-check-docs.mjs`](../../../scripts/cross-check-docs.mjs) (check 12).

## Source of truth

The model values are canonical in the [Model Data Sheet](../model-data-sheet.md) /
[Scoring Algorithm](../scoring-algorithm.md); the **app UI** (`src/`) is the source of truth for
look & interaction, and this prototype mirrors it. The only data shared (and guarded) between this
file and the specs is the `qaFit` vectors. Treat the displayed numbers as illustrative — the app
computes them live.
