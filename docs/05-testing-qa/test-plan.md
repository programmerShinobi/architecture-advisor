# Test Plan & QA — Architecture Advisor

> **Phase 5 of 7 · Status: 🔬 In progress.** **99 Vitest** unit/component/integration tests + an
> **axe-core a11y** suite (incl. the lazy Manual/Guide and Insights article), three **model-integrity
> guards** + a **content-validation guard**, and a **Playwright** real-browser E2E suite (smoke,
> share deep-link, structural a11y incl. the Manual and Insights, keyboard) — all in CI, which now also
> gates a **bundle-size budget** and a **production-dependency audit**. Real-browser a11y gates
> **full WCAG A/AA including color-contrast** in both themes. Open: the **UAT kit** is ready (script v0.3 + SUS-10
> session form); participant sessions pending. This document is the test strategy, the current inventory, the
> acceptance-criteria traceability matrix, and the honest gap list.

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
| **L2 · Component/Integration** | Vitest + Testing Library | The 4-step flow, reactivity, override panel + redistribution, radar, command palette, manual & A/B compare overlays | ✅ Mostly done |
| **L3 · System / E2E** | Playwright (chromium) | Full journeys in a real browser: smoke, share-URL deep-link, structural a11y, keyboard | ✅ Done |
| **L4 · Accessibility** | `vitest-axe` + Playwright + `@axe-core/playwright` | Names/roles/ARIA (jsdom + real browser), keyboard, and **full color-contrast** (real browser, both themes) — all automated | ✅ Done |
| **L5 · UAT** | Scripted scenarios — [uat-script.md](uat-script.md) v0.3 + [session form](uat-session-form.md) (SUS-10) + [summary](uat-summary.md) | Real architects/newcomers confirm usefulness, clarity, and **SUS ≥ 70** (NFR-USE-1) | ⏳ Kit ready; dry-run re-verified on the live build (2026-07-05); sessions pending |
| **L6 · Security** | `npm audit --omit=dev` in CI (Section 8) | Client-side injection, storage, dependencies | ✅ Gated in CI |
| **L7 · Performance** | Bundle-size budget guard in CI (Section 9) | Bundle budget, first paint, instant recompute | ✅ Gated in CI |

---

## 3. Current inventory (what runs today)

### 3.1 Automated unit suite — `npm run test` (Vitest)

**99 tests across 16 files**, all green:

| File | Cases | Covers |
|---|---:|---|
| [`src/lib/scoring.test.ts`](../../src/lib/scoring.test.ts) | 22 | Fixtures A–C, equal-weight fallback, **500 seeded random invariants**, requirement scenarios (AC-6/AC-7), contribution reconciliation (FR-REC-4), expert override & lock, **all 25 preset targets** (SRS Section 5.3), qaFit defaulting |
| [`src/lib/antiPatternEngine.test.ts`](../../src/lib/antiPatternEngine.test.ts) | 8 | Distributed monolith, premature microservices, and the other rules (Model Data Sheet Section 5) |
| [`src/lib/exports.test.ts`](../../src/lib/exports.test.ts) | 8 | `generateAdr` (MADR), `generateReport`, `buildC4`, scenario JSON round-trip, **share-URL round-trip (AC-14)** |
| [`src/App.test.tsx`](../../src/App.test.tsx) | 4 | **Integration:** preset & single-factor reactivity (AC-2), language toggle (AC-13), and weight-override redistribution end-to-end |
| [`src/components/RadarPanel.test.tsx`](../../src/components/RadarPanel.test.tsx) | 3 | **Component:** D1 ranking + single top pick, option toggle, dimension switch (AC-12) |
| [`src/components/SensitivityCard.test.tsx`](../../src/components/SensitivityCard.test.tsx) | 3 | **Component:** flip sentence + robust fallback, max-3 flips (AC-11) |
| [`src/components/QaOverridePanel.test.tsx`](../../src/components/QaOverridePanel.test.tsx) | 4 | **Component:** edit → lock, clamp 0–100, unlock, clear-all |
| [`src/components/CommandPalette.test.tsx`](../../src/components/CommandPalette.test.tsx) | 3 | **Component:** closed renders nothing; filter by query; run on click / Enter |
| [`src/components/overlays.test.tsx`](../../src/components/overlays.test.tsx) | 5 | **Component:** ManualBook + ScenarioCompare (A/B) — hidden when closed, labelled dialog + close; plus the Manual's **architecture explanations (FR-READ-*)**: parity with the model (every D1–D5 option) + a bibliography of real, linked citations |
| [`src/lib/frontmatter.test.ts`](../../src/lib/frontmatter.test.ts) | 6 | **Content pipeline:** the dependency-free frontmatter parser — scalars, inline arrays, nested map, list of flow maps, body split, no-frontmatter fallback |
| [`src/lib/markdown.test.tsx`](../../src/lib/markdown.test.tsx) | 6 | **Content pipeline:** the safe Markdown-subset renderer — headings/lists/inline, safe links, `:::guided`/`:::expert` mode blocks, and **no raw-HTML/`javascript:` injection** (XSS-safe by construction) |
| [`src/lib/content.test.ts`](../../src/lib/content.test.ts) | 5 | **Content index (FR-LEARN-2/3):** every article well-formed and **every `related_advisor` id resolves to the frozen model**; section/slug filters; review-due flag |
| [`src/components/LearnView.test.tsx`](../../src/components/LearnView.test.tsx) | 8 | **Component (FR-LEARN-1/4/6/8/9/10):** **every architecture has a Catalog, Playbook, Review, AND Library entry** (21×4 parity with the model); Playbook opens as a step-by-step implementation guide (Prerequisites/Steps/Best practices/Pitfalls) + cited sources; Review opens as a structured evaluation (Pros/Cons/metrics/Final verdict) + "Try in the Advisor" returns to the Advisor; Library covers every architecture as reference (Key concepts/Terminology) AND lists its evergreen articles; the **LensNav** walks one architecture through the Catalog → Playbook → Review → Library journey; a **Roadmap** path's step deep-links to its article; an **Academy** quiz gives client-side feedback + a review link; a **Lab** run calls the Advisor with the prepared factor levels |
| [`src/config/waveC.test.ts`](../../src/config/waveC.test.ts) | 9 | **Wave C datasets (FR-LEARN-8/9/10):** every Roadmap step resolves to a real architecture page / article / the Advisor; every Academy answer index is in range and every "review the topic" link resolves; every Lab experiment sets **all 14 model factors** to a valid level with no unknown factors; path/module/experiment ids unique; and **21-architecture holistic parity per section** — every architecture appears in ≥1 learning path, is reviewed by ≥1 quiz question, and is in play (`focus`) in ≥1 experiment |
| [`src/a11y.test.tsx`](../../src/a11y.test.tsx) | 4 | **Accessibility (AC-15):** axe-core WCAG A/AA on the composed app, Expert/override panel, the lazy Manual/Guide, and the lazy **Insights article** — caught & fixed an unlabeled file input |
| [`src/i18n/dict.test.ts`](../../src/i18n/dict.test.ts) | 1 | Dictionary completeness — every key has EN **and** ID (covers the new Insights/section keys) |

> Component/integration tests render via a small [`src/test/render.tsx`](../../src/test/render.tsx)
> helper that wraps the unit under test in the i18n provider with the language pinned. (Vitest runs
> with `css: false`, so assertions target accessible names, roles, and unique strings — not
> CSS-driven `guided`/`expert` visibility.)

### 3.2 Model-integrity guards — L0 (run in CI on every push/PR)

| Guard | Asserts |
|---|---|
| [`scripts/verify-model.mjs`](../../scripts/verify-model.mjs) | The reference model reproduces the math, the fixtures, and **all 25 preset targets** |
| [`scripts/cross-check-docs.mjs`](../../scripts/cross-check-docs.mjs) | The docs agree with each other and with the prototype (qaFit vectors, influence matrix, presets, option names, EN/ID parity) — 12 checks |
| [`scripts/check-app-config.mjs`](../../scripts/check-app-config.mjs) | `src/config/*` mirrors the documented model (no app↔doc drift) |
| [`scripts/check-content.mjs`](../../scripts/check-content.mjs) | **Content gate (`content:validate`):** every article's frontmatter is valid, has a primary source + review dates, and **every `related_advisor` id resolves to the frozen model** (no content↔engine drift) |

### 3.3 End-to-end — `npm run test:e2e` (Playwright, real chromium)

Real-browser journeys against the dev server at the `/architecture-advisor/` sub-path. **14 pass**
(all gating):

| Spec | Covers |
|---|---|
| [`e2e/smoke.spec.ts`](../../e2e/smoke.spec.ts) | The 4-step flow loads; a preset recomputes the recommendation (AC-2); the primary export downloads a `.md` (MADR) |
| [`e2e/share.spec.ts`](../../e2e/share.spec.ts) | **AC-14 end to end:** Share copies a `#s=…` deep link to the clipboard; opening it restores the exact recommendation |
| [`e2e/a11y.spec.ts`](../../e2e/a11y.spec.ts) | **Full** WCAG A/AA **incl. color-contrast** (axe, real engine) in Guided/dark + Expert/light + override panel + **the Manual/Guide** + **an Insights article** (both themes); keyboard operability |
| [`e2e/responsive.spec.ts`](../../e2e/responsive.spec.ts) | **Responsive redesign (design-spec §6.1):** no horizontal scroll on the Advisor **and** an Insights article at **360 / 768 / 1440 px**; the phone tier hides keyboard-centric chrome (⌘K, ?, save indicator) while Guide/mode/language/theme stay reachable |

**Cross-engine (optional, local — not CI-gated).** [`pw-cross.config.ts`](../../pw-cross.config.ts)
re-runs the same specs on **Firefox (Gecko)** and **Safari (WebKit)** engines, incl. an **iPhone 13
emulation** — the practical proxy for the SRS §2.3 evergreen baseline (setup + run commands are in
the config header; use `--workers=2` — parallel WebKit workers starve each other and time out).
Verified 2026-07-05:

- **Firefox:** responsive 4/4 · smoke 2/2 · a11y 6/7 — the one failure (Expert+light
  color-contrast) was proven a **theme-transition timing artifact**, not a real defect (applying
  the theme pre-paint yields **0 violations**; note in the config).
- **Safari (WebKit) + Safari-iOS (iPhone 13): 26/26** — responsive, smoke, and full a11y
  (incl. color-contrast, both themes) all pass; visual screenshots (dark/light, Advisor +
  Insights) reviewed clean.
- The visual pass also caught a real phone-tier bug (the save indicator's inline `display`
  defeating `aa-hide-phone`) — fixed, and now asserted by `responsive.spec.ts`.
- One-time host setup for WebKit on a fresh Linux machine: `sudo npx playwright install-deps`.

### 3.4 CI pipelines (`.github/workflows/`)

- **`ci.yml`** — on push/PR: `check-app-config` → **`content:validate`** (content ↔ model gate) →
  `lint` → `test` → `build` → **`size`** (bundle budget, L7) → **`audit:prod`** (production-dependency
  audit, L6).
- **`e2e.yml`** — installs the chromium browser and runs `test:e2e` (L3).
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
| 2 | Any factor change instantly updates weights/rankings/charts/analyses | `App.test` (preset + single factor → verdict recomputes) | ✅ Automated |
| 3 | Defaults → D1 top **Monolith**; `timeToMarket` highest | `scoring.test` Fixture A | ✅ Automated |
| 4 | team2/dist2/scale2/devops2/ttm0 → D1 top **Microservices** | `scoring.test` Fixture B | ✅ Automated |
| 5 | domain2/team0/ttm0 → **Modular Monolith**; D4 Hexagonal/Clean = 5.0 | `scoring.test` Fixture C | ✅ Automated |
| 6 | async2/realtime2 → D2 **Event-driven/Streaming**; scalability+perf lead | `scoring.test` (AC-6) | ✅ Automated |
| 7 | consistency2 → `dataConsistency` dominates; D3 **Single shared DB** | `scoring.test` (AC-7) | ✅ Automated |
| 8 | Microservices + Single shared DB → **distributed monolith** warning | `antiPatternEngine.test` | ✅ Automated |
| 9 | team0/devops0 + Microservices → **premature microservices** warning | `antiPatternEngine.test` | ✅ Automated |
| 10 | Contribution table reconciles exactly to the composite | `scoring.test` (FR-REC-4) | ✅ Automated |
| 11 | Sensitivity names a flipping factor **or** correctly says "robust" | `SensitivityCard.test` | ✅ Automated |
| 12 | Radar overlays top options; compare 2–3 options | `RadarPanel.test` (toggle + dimension switch) | ✅ Automated |
| 13 | Language toggle updates **all** strings; dark mode fully styled | `dict.test` (keys) + `App.test` (toggle); dark mode manual | 🟡 Partial |
| 14 | Share link round-trips; Export ADR = valid MADR | `exports.test` + `e2e/share.spec` (deep-link) + `e2e/smoke.spec` (ADR download) | ✅ Automated |
| 15 | Keyboard-operable; accessible names; AA contrast both themes | `a11y.test` + `e2e/a11y.spec` (axe **incl. color-contrast** + keyboard, both themes, real browser) | ✅ Automated |
| 16 | Every QA/factor/option/rule/template in config + documented | `check-app-config` + `cross-check-docs` | ✅ Automated |

**Summary: 15/16 fully automated, 1 partial (AC-13 — dark-mode *styling* completeness is still
eyeballed; the dark theme is otherwise axe-clean).** Nothing fully manual.

---

## 5. How to run

```bash
npm run test                       # Vitest unit/component/a11y suite (watch: npm run test:watch)
node scripts/verify-model.mjs      # model math + fixtures + 25 preset targets
node scripts/cross-check-docs.mjs  # docs agree with each other + the prototype
node scripts/check-app-config.mjs  # src/config mirrors the documented model
npm run lint && npm run build      # types + lint + production build
npm run size                       # bundle-size budget (after build) — L7
npm run audit:prod                 # production-dependency audit (high/critical) — L6

# E2E (real browser) — one-time browser download, then run:
npx playwright install chromium
npm run test:e2e                   # smoke, share deep-link, structural a11y, keyboard — L3
```

CI runs the equivalent on every push/PR (`ci.yml` + `e2e.yml` + `docs-integrity.yml`); a green
checkmark is the merge gate, and `deploy.yml` re-runs the unit tests + build before publishing.

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

**Accessibility — WCAG 2.1 AA** (NFR + AC-15), **automated**: names/roles/ARIA via `vitest-axe`
(axe-core) in [`src/a11y.test.tsx`](../../src/a11y.test.tsx) (jsdom), plus **full color-contrast +
keyboard** in a real browser via Playwright + `@axe-core/playwright` in
[`e2e/a11y.spec.ts`](../../e2e/a11y.spec.ts), across both themes. The axe run caught and fixed an
unlabeled file input; the contrast pass drove the tertiary-token, light-success-green, and
dimmed-opacity (off chips / hidden rows) adjustments to clear AA.

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
- [x] **Dependencies:** **CI-gated** — `npm run audit:prod` (`npm audit --omit=dev --audit-level=high`)
      runs after the build; production deps (React + fontsource + tabler icons) report **0
      vulnerabilities**. Since the Vite 8 / Vitest 4 upgrade (2026-07-05), the **full** `npm audit`
      (dev deps included) is also **0 vulnerabilities** — the old dev-only Vite/esbuild dev-server
      advisory is resolved.
- [ ] **Supply chain:** `package-lock.json` committed; CI uses `npm ci`.

---

## 9. Performance verification (L7)

- [x] **Bundle budget:** **CI-gated** — `npm run size` ([`scripts/check-bundle-size.mjs`](../../scripts/check-bundle-size.mjs))
      asserts gzip **initial JS ≤120kB** (first load) and **total JS ≤260kB** (raised 200→260 for full Insights bilingualisation 2026-07-15 — EN+ID content is lazy; NFR cap 300) / CSS ≤25kB (currently ~114 initial /
      ~237 total / ~23 CSS with React 19 on Vite 8). The guard reads the **real initial set from `dist/index.html`** (entry
      script + modulepreloads), so lazy views (Manual/Guide, Insights) **and their shared async chunks** (e.g.
      `readerContent`, which powers the data-driven Catalog) are correctly excluded from the first load — none can be
      silently mis-counted. No chart/diagram/markdown library ships — all visuals are hand-built SVG and Markdown is
      rendered by a small safe renderer (see [DECISIONS.md](../../DECISIONS.md)).
- [x] **Lighthouse (mobile, measured 2026-07-04** on the production build via `npm run preview`,
      Chrome headless, after the responsive redesign): **Performance 93 · Accessibility 100 ·
      Best-practices 96 · SEO 100**; CLS **0**, TBT 40 ms (FCP/LCP 2.6 s under simulated slow-4G
      throttling). Manual, not CI-gated — re-run with
      `npx lighthouse http://localhost:4173/architecture-advisor/ --form-factor=mobile`.
- [ ] **Recompute:** changing a factor recomputes the full model **synchronously** (pure functions,
      no async) — perceptibly instant; verified by the 500-iteration invariant test running in ms.
- [ ] **First paint:** dark theme applied pre-paint (inline script); fonts `font-display: swap`.
- [ ] **No layout thrash:** SVGs are static markup, not re-laid-out per frame.

---

## 10. Gaps & roadmap (honest)

| Gap | Impact | Plan |
|---|---|---|
| **UAT not yet executed** (L5) | Real-user clarity unproven | Run [uat-script.md](uat-script.md) with ≥3 per persona before v1.1 |
| Component/integration (L2) is broad but not exhaustive | A few minor affordances still ride the release checklist | Add cases opportunistically as components change |

---

## 11. Definition of Done (testing gate)

A change is "done" when: the unit suite and all three guards pass; `lint` and `build` are clean;
new model/config/doc changes keep `cross-check-docs` and `check-app-config` green; any new UI
affordance is covered by the release checklist (Section 6); and no acceptance criterion regresses.

---

| Version | Date | Notes |
|---|---|---|
| 0.1 | 2026-06-18 | Initial test plan: strategy, current inventory (39 tests + 3 guards + CI), AC traceability, manual checklist, security/perf/UAT/a11y approach, and the L2–L7 gap roadmap. |
| 0.2 | 2026-06-20 | First L2 component/integration tests landed (9 cases via `src/test/render.tsx`): App reactivity (AC-2) + language (AC-13), RadarPanel (AC-12), SensitivityCard (AC-11). Inventory 39→48; automated AC 11→14 of 16. |
| 0.3 | 2026-06-20 | L4 accessibility automated with `vitest-axe` (axe-core), WCAG A/AA, on the composed app + Expert/override panel (`src/a11y.test.tsx`, 2 cases) — caught & fixed an unlabeled file input (Toolbar). Inventory 48→50; AC-15 manual→partial (contrast/keyboard still manual). |
| 0.4 | 2026-06-20 | Extended L2 to the override panel + redistribution, command palette, and the manual / A/B-compare overlays. Inventory 50→62. |
| 0.5 | 2026-06-20 | **L3 E2E** (Playwright: smoke, share deep-link, structural a11y, keyboard) + real-browser keyboard for AC-15; **L6/L7 gated in CI** (`audit:prod`, bundle-size budget); **L5 UAT script** added ([uat-script.md](uat-script.md)). Full color-contrast AA tracked as a `test.fixme`. |
| 0.6 | 2026-06-20 | **Full color-contrast AA remediated and gated** in the real browser (tertiary tokens, light success green, off-chip/hidden-row opacity) — `e2e/a11y.spec` now asserts color-contrast in both themes (no `fixme`); L4 ✅; AC-15 ✅ automated (15/16 AC automated). |
| 0.7 | 2026-07-06 | **Insights holistic coverage:** `LearnView.test.tsx` rewritten (4→5 cases) for the four structured lenses — 21×4 parity vs `insightPlaybooks`/`insightReviews`/`insightLibrary`, per-lens layout assertions, and the LensNav journey; e2e specs updated for the English default language (exact `Guide` match vs the `Guided` toggle) and the richer card accessible names. Inventory 86→87 Vitest + 14 e2e, all green. |
| 0.8 | 2026-07-06 | **Insights Wave C:** new `src/config/waveC.test.ts` (6 cases — Roadmap/Academy/Lab dataset validity: every deep-link target resolves, quiz answers in range, Lab levels valid for all 14 factors, ids unique) + 3 new `LearnView` cases (Roadmap step → article; Academy feedback + review link; Lab run passes prepared levels to the Advisor). The SEO generator (`generate-seo.mjs`) self-guards canonical/robots vs `SITE_URL` at build time. Inventory 87→96 Vitest (16 files) + 14 e2e, all green. |
| 0.9 | 2026-07-06 | **Wave C holistic parity:** `waveC.test.ts` extended 6→9 with per-section **21-architecture coverage tests** (every architecture in ≥1 Roadmap path, reviewed by ≥1 Academy question, in play in ≥1 Lab experiment via the new `focus` chips) — Wave C can no longer mismatch the lenses' 21×4 coverage. Inventory 96→99 Vitest + 14 e2e, all green. |
