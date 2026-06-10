# Phase 3 — Blueprint (Design & Architecture)

> 🔬 **In progress.** Phase 3 of 7. Follows [Requirement Analysis](../02-requirement-analysis/).
>
> **Output:** the design specification + an interactive UI prototype (system architecture, module
> & data schema, design system, UX patterns, and design decisions).

## Deliverables

➡️ **[Design Specification (Blueprint)](design-specification.md)** — draft v0.1: architecture
overview, module & code structure, the decision-model data schema, state & persistence, the
design system & tokens, UX patterns, and the key design decisions (ADRs).

🖼️ **[UI prototype](prototype/index.html)** — the interactive visual reference.

[![Architecture Advisor UI prototype](prototype/preview.png)](prototype/index.html)

An interactive, self-contained mockup of the interface lives in
[`prototype/`](prototype/) — open [`prototype/index.html`](prototype/index.html) in any
browser (Guided/Expert modes, the 4-step flow, the trade-off radar, transparency panels, and
technical-user polish such as the command palette and three-layer error handling). See
[`prototype/README.md`](prototype/README.md) for details.

> Note: a backend ERD and API design are **not applicable** — Architecture Advisor is purely
> client-side (see the design spec, §2). The "data schema" here is the in-app decision-model
> configuration, covered in §4 of the design spec.

Contributions to this phase are welcome — see [`../../CONTRIBUTING.md`](../../CONTRIBUTING.md).
