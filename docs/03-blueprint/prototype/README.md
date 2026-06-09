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
- Numbers shown are illustrative placeholders, consistent with the spec's scoring model.
