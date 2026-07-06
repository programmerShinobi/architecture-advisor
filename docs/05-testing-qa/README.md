# Phase 5 — Testing / QA

> 🔬 **In progress.** Phase 5 of 7. Runs alongside and after [Development](../04-development/).
> **Deliverable → the [Test Plan & QA](test-plan.md).**

Layered testing to separate a prototype from a product: **unit**, **integration**, and **system**
tests, then **UAT** (user-acceptance testing), plus **security** and **performance** checks.

The scoring engine, exporters, and UI are covered by **99 Vitest cases** (unit + component +
integration + axe a11y), **three model-integrity guards** + a **content-validation guard**, and a
**Playwright real-browser E2E** suite — all in CI, which now also gates a **bundle-size budget** and
a **production-dependency audit**. **Full color-contrast AA** (both themes, incl. the Manual/Guide
and the Insights content area) is now gated in a real
browser. Open: the **UAT kit** is ready (script v0.3 + SUS-10 session form); participant sessions pending. Full strategy, inventory, AC
traceability, and the honest gap list live in **[test-plan.md](test-plan.md)**.

**Outputs**

- ✅ Unit + component/integration tests (Vitest + Testing Library) — engine, anti-patterns,
  exporters, i18n, App reactivity, radar, sensitivity, override panel + redistribution, command
  palette, manual & A/B-compare overlays, language.
- ✅ Accessibility (`vitest-axe` in jsdom + Playwright `@axe-core/playwright` in a real browser) —
  WCAG A/AA names/roles/ARIA + keyboard; caught & fixed an unlabeled input.
- ✅ E2E ([Playwright](../../e2e/)) — smoke journey, **share-URL deep-link round-trip** (AC-14),
  structural a11y, keyboard.
- ✅ CI gates: model guards, lint, tests, build, **bundle-size budget**, **prod-dependency audit**,
  and the E2E job.
- ✅ AC traceability (Build Spec Section 14): **14/16 automated**, 2 partial.
- ⏳ [UAT script](uat-script.md) execution (≥3 per persona); full color-contrast AA remediation.

**References**

- [Build Spec v3 Section 14](../specs/build-spec-v3.md#14-acceptance-criteria-verify-before-finishing) — the
  acceptance criteria to verify.
- [Feature-Maturity Playbook](../guides/feature-maturity-playbook.md) — `TECH-01` (edge cases),
  `TECH-03` (security), `TECH-07` (performance), `TECH-08` (testing & coverage).
- Charter [Section 11](../01-discovery-and-planning/discovery-and-planning.md) — project-level Definition of Done & quality gates.

Contributions are welcome — see [`../../CONTRIBUTING.md`](../../CONTRIBUTING.md).
