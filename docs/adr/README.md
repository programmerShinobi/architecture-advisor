# Architecture Decision Records (ADR)

This is the repository's **decision log** required by the charter
([Section 14.4](../01-discovery-and-planning/discovery-and-planning.md#14-governance--contribution),
Section 14.5). It records **model-value and governance decisions** — changes to the factors,
quality attributes, factor→QA matrix, fit vectors, anti-pattern rules, and presets — in
[MADR](https://adr.github.io/madr/) format, each with rationale and references, as the charter
requires.

> **Scope.** *App-level design* decisions (pure functional core, client-side only, recharts, etc.)
> are recorded inline in the [Design Specification Section 8](../03-blueprint/design-specification.md#8-key-design-decisions-adrs)
> as ADR-001…008 (3-digit). **This log** records *model* decisions, numbered **ADR-0001…** (4-digit).

> **Reviewer.** Model changes are reviewed by a Domain Advisor. None is appointed yet
> (charter decision D12), so the **interim** reviewer is the Owner using the documented literature
> ([Model Data Sheet Section 8](../03-blueprint/model-data-sheet.md)). These records are honest
> about that: the ratified values are **defensible expert defaults, not empirically validated
> facts** — empirical validation is the v3.0 roadmap item, and an independent Domain Advisor remains
> welcome to revise any value via a superseding ADR.

## Log

| ADR | Decision | Status | Closes |
|---|---|---|---|
| [0001](0001-ratify-d4-d5-qafit.md) | Ratify the D4/D5 `qaFit` baseline vectors | Accepted (interim) | SRS OI-4 |
| [0002](0002-ratify-preset-calibration.md) | Ratify the scenario-preset calibration | Accepted (interim) | SRS OI-2 |

## How to add one

1. Copy the structure of an existing record; number it `NNNN` (next free integer).
2. Fill in Context, Decision Drivers, Considered Options, Decision Outcome, Consequences, and Links.
3. For a model change, update the [Model Data Sheet](../03-blueprint/model-data-sheet.md) and run
   **both** guards (`node scripts/verify-model.mjs` and `node scripts/cross-check-docs.mjs`).
4. Add a row to the log above. A superseding ADR marks the old one `Superseded by ADR-NNNN`.
