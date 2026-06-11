# Phase 5 — Testing / QA

> 🚧 **Not started.** Phase 5 of 7. Runs alongside and after [Development](../04-development/).

Layered testing to separate a prototype from a product: **unit**, **integration**, and **system**
tests, then **UAT** (user-acceptance testing), plus **security** and **performance** checks.

**Expected outputs**

- Unit tests (Vitest) for the scoring engine: weight derivation, normalization, composite scores,
  sensitivity/flip analysis, URL round-trip, ADR generation.
- Integration tests for the 4-step flow; accessibility checks (WCAG AA, keyboard).
- A test plan and coverage for core logic and edge cases.
- Security & performance verification.

**References**

- [Build Spec v3 Section 14](../specs/build-spec-v3.md#14-acceptance-criteria-verify-before-finishing) — the
  acceptance criteria to verify.
- [Feature-Maturity Playbook](../guides/feature-maturity-playbook.md) — `TECH-01` (edge cases),
  `TECH-03` (security), `TECH-07` (performance), `TECH-08` (testing & coverage).
- Charter [Section 11](../01-discovery-and-planning/discovery-and-planning.md) — project-level Definition of Done & quality gates.

Contributions are welcome — see [`../../CONTRIBUTING.md`](../../CONTRIBUTING.md).
