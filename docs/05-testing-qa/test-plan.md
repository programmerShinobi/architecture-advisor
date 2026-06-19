# Test Plan & QA — Architecture Advisor

> **Phase 5 of 7 · Status: 🔬 In progress.** The core scoring engine and exporters are covered by
> an automated suite (Vitest) plus three model-integrity guards wired into CI; component/E2E,
> accessibility automation, formal UAT, and security/performance verification are planned. This
> document is the test strategy, the current inventory, the acceptance-criteria traceability
> matrix, and the honest gap list.

Primary references: [Build Spec Section 14](../specs/build-spec-v3.md#14-acceptance-criteria-verify-before-finishing)
(acceptance criteria), the [SRS](../02-requirement-analysis/software-requirements-specification.md)
(FR/NFR), and the charter [Section 11](../01-discovery-and-planning/discovery-and-planning.md)
(Definition of Done & quality gates).

---

## 1. Objectives & scope

**Goal:** prove the tool is *correct, transparent, reproducible, and accessible* — not merely that
it renders. The differentiator of Architecture Advisor is an auditable scoring model, so the model
is tested to the number, and the documentation is machine-checked against the implementation.

**In scope:** the scoring engine, anti-pattern detection, exporters (ADR/report/CSV/JSON/share),
i18n completeness, the model↔docs↔config consistency, the four-step UI flow, accessibility, and
client-side security/performance.

**Out of scope:** backend/API/database testing (there is none — the app is pure client-side),
load testing of servers (static hosting), and cross-browser matrices beyond evergreen browsers.

---

## 2. Test strategy — the layers

A deliberately bottom-heavy pyramid: the model logic is pure and deterministic, so most assurance
lives in fast unit tests and the cross-document guards; UI and human-judgement checks sit on top.

| Layer | Tooling | What it protects | State |
|---|---|---|---|
| **L0 · Model guards** | Node scripts (no deps), CI | The docs, the reference model, and `src/config` cannot drift apart | ✅ Done |
| **L1 · Unit** | Vitest | Scoring math, anti-patterns, exporters, i18n | ✅ Done |
| **L2 · Component/Integration** | Vitest + Testing Library | The 4-step flow, reactivity, override panel, radar toggles | ⏳ Planned |
| **L3 · System / E2E** | (Playwright, candidate) | Full user journeys in a real browser, share-URL deep-link | ⏳ Planned |
| **L4 · Accessibility** | Manual now; `axe`/`vitest-axe` planned | WCAG AA contrast, keyboard operability, names/roles | 🟡 Manual |
| **L5 · UAT** | Scripted scenarios (Section 7) | Real architects/newcomers confirm usefulness & clarity | ⏳ Planned |
| **L6 · Security** | Checklist + `npm audit` (Section 8) | Client-side injection, storage, dependencies | 🟡 Checklist |
| **L7 · Performance** | Checklist + build report (Section 9) | Bundle budget, first paint, instant recompute | 🟡 Checklist |

---

## 3. Current inventory (what runs today)

### 3.1 Automated unit suite — `npm run test` (Vitest)

**39 tests across 4 files**, all green:

| File | Cases | Covers |
|---|---:|---|
| [`src/lib/scoring.test.ts`](../../src/lib/scoring.test.ts) | 22 | Fixtures A–C, equal-weight fallback, **500 seeded random invariants**, requirement scenarios (AC-6/AC-7), contribution reconciliation (FR-REC-4), expert override & lock, **all 25 preset targets** (SRS Section 5.3), qaFit defaulting |
| [`src/lib/antiPatternEngine.test.ts`](../../src/lib/antiPatternEngine.test.ts) | 8 | Distributed monolith, premature microservices, and the other rules (Model Data Sheet Section 5) |
| [`src/lib/exports.test.ts`](../../src/lib/exports.test.ts) | 8 | `generateAdr` (MADR), `generateReport`, `buildC4`, scenario JSON round-trip, **share-URL round-trip (AC-14)** |
| [`src/i18n/dict.test.ts`](../../src/i18n/dict.test.ts) | 1 | Dictionary completeness — every key has EN **and** ID |

### 3.2 Model-integrity guards — L0 (run in CI on every push/PR)

| Guard | Asserts |
|---|---|
| [`scripts/verify-model.mjs`](../../scripts/verify-model.mjs) | The reference model reproduces the math, the fixtures, and **all 25 preset targets** |
| [`scripts/cross-check-docs.mjs`](../../scripts/cross-check-docs.mjs) | The docs agree with each other and with the prototype (qaFit vectors, influence matrix, presets, option names, EN/ID parity) — 12 checks |
| [`scripts/check-app-config.mjs`](../../scripts/check-app-config.mjs) | `src/config/*` mirrors the documented model (no app↔doc drift) |

### 3.3 CI pipelines (`.github/workflows/`)

- **`ci.yml`** — on push/PR: `check-app-config` → `lint` → `test` → `build`.
- **`docs-integrity.yml`** — runs `verify-model` + `cross-check-docs` on doc/model changes.
- **`deploy.yml`** — build + publish to GitHub Pages on `main`.

> The model guards are intentionally dependency-free Node scripts so they run identically on a
> laptop and in CI, and never rot behind a test framework upgrade.

---

## 4. Acceptance-criteria traceability (Build Spec Section 14)

Each criterion maps to its verification method. **Automated** = covered by a test/guard that fails
the build on regression; **Manual** = on the release checklist (Section 6) until L2–L4 land.

| # | Acceptance criterion (abridged) | Verified by | Status |
|---|---|---|---|
| 1 | install/dev/test/build clean; CI present | `ci.yml` | ✅ Automated |
| 2 | Any factor change instantly updates weights/rankings/charts/analyses | L2 (planned); release checklist | 🟡 Manual |
| 3 | Defaults → D1 top **Monolith**; `timeToMarket` highest | `scoring.test` Fixture A | ✅ Automated |
| 4 | team2/dist2/scale2/devops2/ttm0 → D1 top **Microservices** | `scoring.test` Fixture B | ✅ Automated |
| 5 | domain2/team0/ttm0 → **Modular Monolith**; D4 Hexagonal/Clean = 5.0 | `scoring.test` Fixture C | ✅ Automated |
| 6 | async2/realtime2 → D2 **Event-driven/Streaming**; scalability+perf lead | `scoring.test` (AC-6) | ✅ Automated |
| 7 | consistency2 → `dataConsistency` dominates; D3 **Single shared DB** | `scoring.test` (AC-7) | ✅ Automated |
| 8 | Microservices + Single shared DB → **distributed monolith** warning | `antiPatternEngine.test` | ✅ Automated |
| 9 | team0/devops0 + Microservices → **premature microservices** warning | `antiPatternEngine.test` | ✅ Automated |
| 10 | Contribution table reconciles exactly to the composite | `scoring.test` (FR-REC-4) | ✅ Automated |
| 11 | Sensitivity names a flipping factor **or** correctly says "robust" | L2 (planned); release checklist | 🟡 Manual |
| 12 | Radar overlays top options; compare 2–3 options | L2/L3 (planned); release checklist | 🟡 Manual |
| 13 | Language toggle updates **all** strings; dark mode fully styled | `dict.test` (keys) + manual (dark) | 🟡 Partial |
| 14 | Share link round-trips; Export ADR = valid MADR | `exports.test` | ✅ Automated |
| 15 | Keyboard-operable; accessible names; AA contrast both themes | L4 manual checklist (Section 7) | 🟡 Manual |
| 16 | Every QA/factor/option/rule/template in config + documented | `check-app-config` + `cross-check-docs` | ✅ Automated |

**Summary: 10/16 fully automated, 1 partial, 5 manual** — the 5 manual items are the L2–L4
backlog (Section 10).

---

## 5. How to run

```bash
npm run test                       # Vitest unit suite (watch: npm run test:watch)
node scripts/verify-model.mjs      # model math + fixtures + 25 preset targets
node scripts/cross-check-docs.mjs  # docs agree with each other + the prototype
node scripts/check-app-config.mjs  # src/config mirrors the documented model
npm run lint && npm run build      # types + lint + production build
```

CI runs the equivalent on every push/PR; a green checkmark is the merge gate.

---

## 6. Release checklist (manual, until L2–L4 automate it)

Run before tagging a release, in both **light and dark** themes and at **360 px** width:

- [ ] Change a factor → weights, rankings, radar, and analyses update with no reload (AC-2).
- [ ] Open the sensitivity card → it names a flipping factor or says "robust," and is correct (AC-11).
- [ ] Toggle radar options and the dimension selector → overlays and ranking update (AC-12).
- [ ] Switch EN↔ID → no untranslated string anywhere; switch theme → everything styled (AC-13).
- [ ] Tab through the whole flow → every control reachable, visible focus, sensible order (AC-15).
- [ ] Export ADR / report / CSV / JSON, Print/PDF, Share link, Import setup → all succeed (AC-14).
- [ ] `npm run build` size is within budget (Section 9); no console errors on load.

---

## 7. Accessibility (L4) & UAT (L5)

**Accessibility — target WCAG 2.1 AA** (NFR + AC-15). Manual checklist now; automate with
`vitest-axe`/`@axe-core/playwright` when L2/L3 land.

- Keyboard: every interactive control operable, logical tab order, visible focus (already styled
  via `:focus-visible` in `index.css`), no traps; overlays (palette, manual) are escapable.
- Names/roles: segmented controls use `role="radiogroup"`/`radio`; icon-only buttons have
  `aria-label`; the radar `<svg>` has `role="img"` + label.
- Contrast: AA for text in both themes (design tokens chosen for this; spot-check after token edits).

**UAT — scripted scenarios** for two personas, ≥3 participants each, success = task completed
unaided + self-reported clarity ≥4/5:

1. *Newcomer (Guided):* "You're building a small internal tool — what should you use and **why**?"
   Expectations: reaches a recommendation, can explain the top driver in their own words.
2. *Architect (Expert):* "Justify a Modular Monolith over Microservices for a regulated, high-scale
   product." Expectations: uses the contribution bars + sensitivity + close-call, exports an ADR.

---

## 8. Security verification (L6)

Pure client-side, no backend/accounts/secrets — the surface is the browser and the dependencies.

- [ ] **Injection:** all user/derived text rendered via React (escaped). Audit any `dangerouslySet…`
      / `innerHTML` (the prototype mockup uses `innerHTML` with **non-user** template strings only;
      the React app must not interpolate user input into HTML).
- [ ] **Persisted/URL state:** `localStorage` + URL-hash state is validated on read (corrupt/stale
      snapshots are treated as empty — see the `isScenario()` guard) so a hostile hash can't crash
      or mislead the app.
- [ ] **Dependencies:** `npm audit` clean (no high/critical); production deps are minimal
      (React + fontsource + tabler icons) — see [DECISIONS.md](../../DECISIONS.md).
- [ ] **Supply chain:** `package-lock.json` committed; CI uses `npm ci`.

---

## 9. Performance verification (L7)

- [ ] **Bundle budget:** initial JS/CSS within the NFR budget (Build Spec); no chart/diagram library
      ships — all visuals are hand-built SVG (see [DECISIONS.md](../../DECISIONS.md)).
- [ ] **Recompute:** changing a factor recomputes the full model **synchronously** (pure functions,
      no async) — perceptibly instant; verified by the 500-iteration invariant test running in ms.
- [ ] **First paint:** dark theme applied pre-paint (inline script); fonts `font-display: swap`.
- [ ] **No layout thrash:** SVGs are static markup, not re-laid-out per frame.

---

## 10. Gaps & roadmap (honest)

| Gap | Impact | Plan |
|---|---|---|
| No component/integration tests (L2) — `@testing-library/react` is installed but unused | AC-2, AC-11, AC-12 are manual | Add tests for the reducer/flow, override panel, radar toggles |
| No E2E (L3) | Share deep-link & full journeys are manual | Evaluate Playwright; one smoke journey first |
| Accessibility is manual (L4) | Regressions only caught by hand | Add `vitest-axe` on key components |
| UAT not yet executed (L5) | Real-user clarity unproven | Run Section 7 with ≥3 per persona before v1.1 |
| Security/perf are checklists (L6/L7) | Not gated in CI | Add `npm audit` to CI; record a build-size budget check |

---

## 11. Definition of Done (testing gate)

A change is "done" when: the unit suite and all three guards pass; `lint` and `build` are clean;
new model/config/doc changes keep `cross-check-docs` and `check-app-config` green; any new UI
affordance is covered by the release checklist (Section 6); and no acceptance criterion regresses.

---

| Version | Date | Notes |
|---|---|---|
| 0.1 | 2026-06-18 | Initial test plan: strategy, current inventory (39 tests + 3 guards + CI), AC traceability, manual checklist, security/perf/UAT/a11y approach, and the L2–L7 gap roadmap. |
