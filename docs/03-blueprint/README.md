# Phase 3 — Blueprint (Design & Architecture)

> 🔬 **In progress.** Phase 3 of 7. Follows [Requirement Analysis](../02-requirement-analysis/).
> A first interactive **UI prototype** is already available.
>
> **Output:** system architecture, UI/UX design (wireframe → mockup → prototype), database
> schema (ERD), API design, tech-stack selection — i.e. the design docs and the final mockup.

## UI prototype

[![Architecture Advisor UI prototype](prototype/preview.png)](prototype/index.html)

An interactive, self-contained mockup of the interface lives in
[`prototype/`](prototype/) — open [`prototype/index.html`](prototype/index.html) in any
browser. It is the visual and interaction reference for the build (Guided/Expert modes, the
4-step flow, the trade-off radar, transparency panels, and technical-user polish such as the
command palette and three-layer error handling). See [`prototype/README.md`](prototype/README.md)
for details.

## Still to come

- Component architecture and module boundaries (mirroring §13 of [Build Spec v3](../specs/build-spec-v3.md)).
- Data/config schema for the decision model (`config/` and `i18n/`).
- A documented UI/UX design system and tokens (the prototype's tokens, formalized; informed by
  the [UI/UX playbook](../guides/uiux-execution-playbook.md)).
- Architecture Decision Records (ADRs) for significant choices.

Contributions to this phase are welcome — see [`../../CONTRIBUTING.md`](../../CONTRIBUTING.md).
