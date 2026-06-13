# ADR-0002 — Ratify the scenario-preset calibration

- **Status:** Accepted (interim ratification — Owner, per charter decision D12; pending an independent Domain Advisor and the v3.0 empirical study)
- **Date:** 2026-06-13
- **Deciders:** Owner (interim Domain-Advisor role)
- **Closes:** SRS OI-2
- **Affects:** [Model Data Sheet Section 6](../03-blueprint/model-data-sheet.md) · [SRS Section 5.3](../02-requirement-analysis/software-requirements-specification.md#5-data--decision-model-requirements)

## Context and problem statement

Each scenario preset must set the 14 factor levels that produce the expected top recommendation in
[SRS Section 5.3](../02-requirement-analysis/software-requirements-specification.md#5-data--decision-model-requirements).
Those levels were calibrated in [Model Data Sheet Section 6](../03-blueprint/model-data-sheet.md)
and machine-verified: `scripts/verify-model.mjs` recomputes all five presets and asserts **all 25
targets** (5 presets × 5 dimensions), reporting each target's **margin** over the best option
outside its allowed set. Four targets hold by a margin under 2 %. This record accepts the
calibration, eyes open about those margins.

## Decision drivers

- **Outcome fidelity** — each preset must yield the persona's intended architecture (SRS 5.3).
- **Verifiability** — the calibration is a regression fixture, not an opinion.
- **Persona realism** — the level vectors should read as a believable project, not be contorted to
  manufacture wide margins.

## Considered options

1. **Ratify the calibrated levels as-is**, accepting the four sub-2 % margins with a documented
   sensitivity rule.
2. **Re-tune levels to widen the thin margins.**
3. **Defer** until an independent Domain Advisor is appointed.

## Decision outcome

**Chosen: option 1.** The calibrated factor levels in Model Data Sheet Section 6 are ratified as the
v1.0 presets. The four calibration-sensitive targets — `iot-streaming` D3 (0.85 %),
`internal-tool` D1 (0.99 %), `regulated` D3 (1.59 %), `high-traffic-ecommerce` D2 (1.90 %) — reflect
trade-offs that are genuinely close in reality; widening them (option 2) would distort the persona's
realism, so they are accepted as honest close calls (the tool itself flags close calls to the user).
Two formerly knife-edge D4 targets were already widened to the **Hexagonal / Clean** set, since
those options tie exactly when the interoperability weight is 0 (see ADR-0001). Option 3 is rejected
because the calibration is verified and usable now.

## Consequences

- **Good:** SRS OI-2 closes; the presets are fixed and reproducible; Phase 4 can mirror Section 6
  into `config/presets.ts`.
- **Honest caveat / maintenance watch:** the four sub-2 % targets could flip under a future
  coefficient change. The standing rule (Scoring Algorithm Section 9.4): **re-run
  `node scripts/verify-model.mjs` after any model change** — a flipped target means recalibrating
  the levels or re-ratifying the target via a superseding ADR.
- **Change control:** as ADR-0001 — edit Model Data Sheet, pass both guard scripts, record a
  superseding ADR.

## Links

- [Model Data Sheet Section 6](../03-blueprint/model-data-sheet.md) — the calibrated levels and expected outcomes.
- [Scoring Algorithm Specification Section 9.4](../03-blueprint/scoring-algorithm.md) — the measured margins and the maintenance rule.
- [ADR-0001](0001-ratify-d4-d5-qafit.md) — the companion D4/D5 `qaFit` ratification.
