# Phase 5 — Testing / QA

> 🔬 **In progress.** Phase 5 of 7. Runs alongside and after [Development](../04-development/).
> **Deliverable → the [Test Plan & QA](test-plan.md).**

Layered testing to separate a prototype from a product: **unit**, **integration**, and **system**
tests, then **UAT** (user-acceptance testing), plus **security** and **performance** checks.

The scoring engine and exporters are covered by **48 Vitest cases** plus **three model-integrity
guards** wired into CI, and the **first component/integration tests have landed** (reactivity,
radar, sensitivity, language); E2E, accessibility automation, formal UAT, and security/performance
verification are the open backlog. Full strategy, current inventory, the acceptance-criteria
traceability matrix, and the honest gap list live in **[test-plan.md](test-plan.md)**.

**Outputs**

- ✅ Unit tests (Vitest) for the scoring engine, anti-patterns, exporters, and i18n.
- ✅ Component/integration tests (Testing Library) — App reactivity, radar, sensitivity, language (48 cases total).
- ✅ Three model-integrity guards (`verify-model`, `cross-check-docs`, `check-app-config`) in CI.
- ✅ Acceptance-criteria traceability (Build Spec Section 14 → tests): **14/16 automated**.
- ⏳ E2E for the 4-step flow + automated accessibility (WCAG AA, keyboard); override-panel/overlay coverage.
- ⏳ Scripted UAT, plus security & performance verification (currently a release checklist).

**References**

- [Build Spec v3 Section 14](../specs/build-spec-v3.md#14-acceptance-criteria-verify-before-finishing) — the
  acceptance criteria to verify.
- [Feature-Maturity Playbook](../guides/feature-maturity-playbook.md) — `TECH-01` (edge cases),
  `TECH-03` (security), `TECH-07` (performance), `TECH-08` (testing & coverage).
- Charter [Section 11](../01-discovery-and-planning/discovery-and-planning.md) — project-level Definition of Done & quality gates.

Contributions are welcome — see [`../../CONTRIBUTING.md`](../../CONTRIBUTING.md).
