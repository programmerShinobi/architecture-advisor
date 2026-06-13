# ADR-0001 — Ratify the D4/D5 `qaFit` baseline vectors

- **Status:** Accepted (interim ratification — Owner, per charter decision D12; pending an independent Domain Advisor and the v3.0 empirical study)
- **Date:** 2026-06-13
- **Deciders:** Owner (interim Domain-Advisor role)
- **Closes:** SRS OI-4 · Design spec DI-1
- **Affects:** [Model Data Sheet Section 4](../03-blueprint/model-data-sheet.md) (D4, D5)

## Context and problem statement

[Build Spec v3 Section 6](../specs/build-spec-v3.md) fixes the `qaFit` vectors for D1–D3 but leaves
D4 (Code Structure) and D5 (Frontend Architecture) **to be assigned and documented**. Baseline
vectors were authored — promoted verbatim from the interactive [prototype](../03-blueprint/prototype/index.html)
into [Model Data Sheet Section 4](../03-blueprint/model-data-sheet.md) — and machine-verified by
`scripts/verify-model.mjs`. Phase 4 cannot begin with these values still marked "pending" (the
Definition-of-Ready gate, design spec Section 11). This record formally accepts them.

## Decision drivers

- **Defensibility** — each vector must match the trade-off shape established in the literature
  ([Model Data Sheet Section 8](../03-blueprint/model-data-sheet.md)).
- **Intellectual honesty** — the values are tunable heuristics, not measured facts (charter Section 21, risks R1/R6).
- **Buildability** — `config/dimensions.ts` needs fixed values; the verification fixtures depend on them.
- **No appointed Domain Advisor yet** (charter D12) — the interim reviewer is the Owner + the cited sources.

## Considered options

1. **Ratify the prototype-derived baseline as documented** (and keep it editable).
2. **Re-derive D4/D5 from a formal multi-stakeholder elicitation** before accepting.
3. **Defer** ratification until an independent Domain Advisor is appointed.

## Decision outcome

**Chosen: option 1.** The baseline vectors in Model Data Sheet Section 4 are ratified as the v1.0
defaults. Each is defensible against its source:

- **D4** — Hexagonal and Clean score highest on maintainability/testability at a time-to-market
  cost (Cockburn, *Hexagonal Architecture*; Martin, *Clean Architecture*); Vertical Slice trades a
  little of that for faster feature delivery (Bogard); Layered favours time-to-market and low cost
  and is neutral elsewhere (Richards & Ford). Hexagonal and Clean tie exactly when the
  interoperability weight is 0 — hence the "Hexagonal / Clean" target set in the presets.
- **D5** — Micro-frontends favour deployability/scalability at a maintainability/time-to-market
  cost (Jackson, *Micro Frontends*); SPA is the balanced single-deployable default; SSR leads on
  first-paint performance (web.dev, *Rendering on the Web*).

Option 2 is rejected for v1.0 (no Domain Advisor yet, and it would block Phase 4); it is exactly
the v3.0 empirical-validation work. Option 3 is rejected because the baseline is usable now and the
values are editable and guarded.

## Consequences

- **Good:** SRS OI-4 and design-spec DI-1 close; the Definition-of-Ready gate is satisfied for the
  model values; Phase 4 can mirror Model Data Sheet Section 4 into `config/` without guesswork.
- **Honest caveats (open for the future Domain Advisor / empirical study):** the values are expert
  estimates. The weakest individual cells, flagged for scrutiny, are **SSR security = 4** (the
  security benefit of keeping logic server-side is marginal) and **Hexagonal security = 4 /
  interoperability = 4** (defensible but not strongly evidenced). These remain editable.
- **Change control:** any revision edits Model Data Sheet Section 4, must pass
  `node scripts/verify-model.mjs` and `node scripts/cross-check-docs.mjs`, and is recorded as a
  superseding ADR (charter Section 14.4).

## Links

- [Model Data Sheet Section 4 & Section 8](../03-blueprint/model-data-sheet.md) — the values and their literature anchors.
- [Scoring Algorithm Specification](../03-blueprint/scoring-algorithm.md) — how the vectors are used.
- [ADR-0002](0002-ratify-preset-calibration.md) — the companion preset-calibration ratification.
