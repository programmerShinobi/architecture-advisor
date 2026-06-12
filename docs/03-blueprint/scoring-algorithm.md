# Architecture Advisor — Scoring Algorithm Specification

**Blueprint Phase · Computational Specification**

| Field | Detail |
|---|---|
| **Document type** | Scoring Algorithm Specification (exact computation rules) |
| **Version** | 0.2 |
| **Date** | 2026-06-13 |
| **Status** | Baseline — every number below is machine-verified by [`scripts/verify-model.mjs`](../../scripts/verify-model.mjs) |
| **Author / Owner** | Faqih Pratama Muhti, B.Sc. Computer Science |
| **Audience** | Engineers implementing `lib/scoring.ts`, `lib/sensitivity.ts`, and their tests |
| **Derived from** | [Model Data Sheet](model-data-sheet.md) · [Build Spec v3](../specs/build-spec-v3.md) Sections 5–8 · [SRS](../02-requirement-analysis/software-requirements-specification.md) Section 5 |
| **License** | [CC BY 4.0](../../LICENSE-docs.md) |

**Document history**

| Version | Date | Summary |
|---|---|---|
| 0.1 | 2026-06-12 | Initial specification: exact formulas for every pipeline step, override/lock semantics, tie-breaking, close-call and sensitivity definitions, display rounding (largest remainder), float-precision policy, and machine-verified worked fixtures |
| 0.2 | 2026-06-13 | Validity review: added Section 11 (methodological validity & known limitations) grounded in the MCDA research literature; calibration margins measured and the four sensitive targets documented (Section 9.4); the verification script now also asserts margins, largest-remainder display rounding, override/lock semantics, and 500 randomized property tests |

---

## Table of Contents

- [1. Why this document exists](#1-why-this-document-exists)
- [2. Notation](#2-notation)
- [3. Step 1 — Quality-attribute weight derivation](#3-step-1--quality-attribute-weight-derivation)
- [4. Step 2 — Composite scoring](#4-step-2--composite-scoring)
- [5. Step 3 — Ranking, tie-breaking & close-call detection](#5-step-3--ranking-tie-breaking--close-call-detection)
- [6. Step 4 — Sensitivity (robustness) analysis](#6-step-4--sensitivity-robustness-analysis)
- [7. Display & rounding policy](#7-display--rounding-policy)
- [8. Numeric precision policy](#8-numeric-precision-policy)
- [9. Worked fixtures (machine-verified)](#9-worked-fixtures-machine-verified)
- [10. Engine invariants & required property tests](#10-engine-invariants--required-property-tests)
- [11. Methodological validity & known limitations](#11-methodological-validity--known-limitations)
- [12. References](#12-references)

---

## 1. Why this document exists

The [Model Data Sheet](model-data-sheet.md) freezes every model *value*; this document freezes
every model *computation*. Together they make the scoring engine implementable with **zero
judgment calls**: formulas, edge semantics, tie-breaking, rounding, and float precision are all
pinned, and every worked number is asserted by [`scripts/verify-model.mjs`](../../scripts/verify-model.mjs)
(`node scripts/verify-model.mjs` — exit 0 means the spec, data sheet, and fixtures agree).

Anything ambiguous here is a **defect in this document** — fix the document, never improvise in code.

## 2. Notation

- `Q` = the 12 quality attributes in **canonical order** (Model Data Sheet Section 1):
  `performance, scalability, availability, security, maintainability, deployability, testability,
  observability, dataConsistency, interoperability, costEfficiency, timeToMarket`.
- `F` = the 14 factors in **canonical order** (Model Data Sheet Section 2). `level(f) ∈ {0,1,2}`.
- `inf(f,q)` = the factor→QA influence (Model Data Sheet Section 3); 0 if unlisted.
- `fit(o,q) ∈ {1..5}` = option `o`'s fit for QA `q` (Model Data Sheet Section 4); **3 if unlisted**.
- Canonical option order within a dimension = the row order in Model Data Sheet Section 4.

## 3. Step 1 — Quality-attribute weight derivation

### 3.1 Raw weights

For each QA `q`:

```
raw(q) = Σ over f in F of  inf(f,q) × effectiveLevel(f)

effectiveLevel(f) = 2 − level(f)   if f = budget     (the inverted factor)
                  = level(f)        otherwise
```

The **budget inversion** means a *tight* budget (level 0) contributes the maximum
(`3 × 2 = 6`) to `costEfficiency`, and a *flexible* budget (level 2) contributes 0.

### 3.2 Clamp, normalize, fallback

1. **Clamp:** `raw(q) ← max(0, raw(q))` (negative influences such as `ttm → maintainability −1`
   may drive a raw weight below zero; it never goes below zero after this step).
2. **Normalize:** `S = Σ raw(q)`. If `S > 0`: `w(q) = raw(q) / S × 100`. Weights are percentages
   that sum to exactly 100 in exact arithmetic.
3. **Equal-weight fallback (FR-EDGE-6):** if `S = 0` (every signal absent), set
   `w(q) = 100/12` for all q. The engine never divides by zero, and a recommendation is defined
   for **every** input combination.

### 3.3 Default factor levels

Defaults are the **no-signal** level of each factor: level 0 for every factor **except**
`ttm = 1` (mild time-to-market pressure) and **`budget = 2`** — because budget is inverted, its
no-signal level is 2 (Flexible), not 0 (Tight = the strongest cost signal). See the Model Data
Sheet Section 2.

### 3.4 Expert override & lock semantics (FR-QA-3)

- Overriding a QA weight sets its value `v ∈ [0,100]` **and locks it**; unlocking discards the
  override and the weight is re-derived from factors.
- Let `L` = locked QAs, `Σ_L` = the sum of their override values, `U` = unlocked QAs.
- Effective weights: locked QAs keep their overrides; unlocked QAs share `R = max(0, 100 − Σ_L)`
  **proportionally to their derived raw weights**:
  `w(u) = raw(u) / Σ_{u' in U} raw(u') × R`.
- Edge cases (all deterministic):
  - If every unlocked raw weight is 0 → split `R` equally among unlocked QAs.
  - If `Σ_L > 100` → rescale the locked values proportionally to sum 100; unlocked QAs get 0;
    the UI shows a warning.
  - If everything is locked → use the locked values rescaled to sum 100.
- **Applying a preset or reset clears all overrides and locks** — a preset is a fresh scenario;
  the preset calibration targets (Section 9.4) assume no locks.

## 4. Step 2 — Composite scoring

For each option `o` in each dimension:

```
composite(o) = Σ over q in Q of  ( w(q) / 100 ) × fit(o,q)
```

- This is the classical **additive multi-attribute value model** [1] — the most widely studied
  form of multi-criteria decision analysis, and the same family ATAM's utility tree draws on [4];
  its sensitivity behavior is well characterized in the literature [2].
- Range: `[1, 5]` (fits are 1–5 and weights sum to 100).
- Factor levels are clamped to `0..2` before Step 1; unlisted fits default to 3 (FR-EDGE-6).
- The per-QA terms `( w(q)/100 ) × fit(o,q)` are the **contribution breakdown** rows (FR-REC-4);
  their exact sum **is** the composite — reconciliation is an identity, not a coincidence.

## 5. Step 3 — Ranking, tie-breaking & close-call detection

- **Ranking:** within each dimension, sort by `composite` descending.
- **Tie-breaking (deterministic):** equal composites (exact float equality) are ordered by
  **canonical option order** (Model Data Sheet Section 4 row order). Example: in Fixture C,
  Hexagonal and Clean both score exactly 5.0 → Hexagonal ranks #1 because it is listed first.
- **Close call (FR-REC-6):** flag the dimension when the **relative gap** between the top two
  raw composites is under the threshold:

```
closeCall = ( s1 − s2 ) / s1 < 0.10        (s1 = top score, s2 = runner-up; s1 ≥ 1 always)
```

  The threshold `0.10` is a named constant in `config/` (not hard-coded), compared on **raw**
  composites before any display rounding.

## 6. Step 4 — Sensitivity (robustness) analysis

Exact algorithm for FR-REC-7 (defined per dimension; the product requirement applies it to D1):

```
winner = rank(levels, dim)[0]
flips  = []
for f in F (canonical order):
  for delta in (−1, +1):                  # −1 first
    lv = level(f) + delta
    if lv < 0 or lv > 2: skip             # clamped — never evaluated out of range
    if rank(levels with f=lv, dim)[0] ≠ winner:
      flips.append( {factor f, newLevel lv, newWinner} )
robust = (flips is empty)
```

- The engine returns the **complete flip set** in deterministic order; the UI shows it (or the
  first few) — "robust" is shown **iff the set is empty**.
- Locked/overridden weights are **respected**: sensitivity recomputes Step 1 with the same lock
  state, so a fully-locked utility tree is reported robust (factor changes cannot move it).
- Cost: at most `14 × 2 = 28` re-rankings per dimension — trivially fast; no caching required
  for correctness (allowed as an optimization).

## 7. Display & rounding policy

The engine never rounds internally; **rounding happens only at the display/export boundary**, with
these exact rules (all values are non-negative, "round half up" = `Math.round`):

1. **Option score 0–100 (FR-REC-2):** `display(o) = round( composite(o) / 5 × 100 )`.
   This is an **absolute** scale (a perfect 5.0 fit everywhere = 100), *not* min-max within the
   dimension — min-max would always show the worst option as 0 and exaggerate small gaps, which
   conflicts with the honesty principle (Charter Section 21).
2. **QA weight percentages:** displayed as integers via the **largest-remainder method**
   (Hamilton's apportionment method [3]) so they
   sum to exactly 100: floor every weight, then distribute the missing percentage points one by
   one to the largest fractional remainders (ties → lower canonical QA index first).
   *Worked example (Fixture B):* exact weights `7.142857, 21.428571, 7.142857, 14.285714,
   35.714286, 7.142857, 7.142857` (+ five zeros) → floors sum to 98 → the two largest remainders
   (deployability .714, scalability .429) each gain 1 → displayed
   `7, 22, 7, 14, 36, 7, 7` = exactly 100.
3. **Contribution table (FR-REC-4):** rows display 2 decimals; apply largest-remainder in units
   of 0.01 against the composite rounded to 2 decimals, so the **displayed rows sum exactly to
   the displayed total** — reviewers must never see a table that "doesn't add up".
4. **Exports:** the same rounded display values, plus the raw values where the format allows
   (CSV/JSON include raw floats); timestamps in UTC ISO-8601 (FR-EDGE-7).

## 8. Numeric precision policy

- All arithmetic in **IEEE-754 float64** [5] (JavaScript `number`); no BigDecimal needed at this scale.
- **Deterministic summation order:** always sum over QAs in canonical order and factors in
  canonical order — identical inputs produce bit-identical outputs on any conforming engine.
- **Test tolerance:** assert `|a − b| < 1e-9` for score equality; never compare display-rounded
  values in engine tests.
- Weight derivation uses integers until the single division in normalization, so `raw` values and
  `S` are exact; composites involve one multiply-add chain per QA (error far below 1e-12).

## 9. Worked fixtures (machine-verified)

These are the canonical regression fixtures. Each is asserted in
[`scripts/verify-model.mjs`](../../scripts/verify-model.mjs); the unit-test suite (NFR-MAINT-2)
must encode them as well.

### 9.1 Fixture A — defaults

Levels: all 0 except `ttm = 1`, `budget = 2`.
Raw: `timeToMarket = 3`, `maintainability = −1 → 0` (clamped); `S = 3` →
**`w(timeToMarket) = 100 %`** (the utility tree honestly shows a single bar: only one signal so far).

| D1 option | composite | display |
|---|---|---|
| **Monolith** | **5.0000** | **100** |
| Layered | 4.0000 | 80 |
| Modular Monolith | 4.0000 | 80 |
| Serverless | 4.0000 | 80 |
| Microservices | 2.0000 | 40 |

Top = Monolith, gap = 20 % → **no close call**. Satisfies AC-2 exactly.
**Sensitivity at defaults (D1):** the complete flip set has **5 entries** —
`team 0→1 ⇒ Serverless`, `distribution 0→1 ⇒ Serverless`, `scale 0→1 ⇒ Serverless`,
`dataVolume 0→1 ⇒ Serverless`, and `ttm 1→0 ⇒ Modular Monolith` (this last one flows through the
**equal-weight fallback**: with `ttm = 0` and `budget = 2` every signal is zero, so all twelve
weights become 100/12 and Modular Monolith's mean fit 45/12 = 3.75 wins).

### 9.2 Fixture B — the Microservices scenario (AC-3)

Levels: `team = 2, distribution = 2, scale = 2, devops = 2, ttm = 0` (others default; `budget = 2`).
Raw: `perf 2, scal 6, avail 2, maint 4, deploy 10, obs 2, cost 2`; `S = 28`.

| D1 option | composite (exact) | display |
|---|---|---|
| **Microservices** | **120/28 = 4.2857** | **86** |
| Serverless | 110/28 = 3.9286 | 79 |
| Modular Monolith | 94/28 = 3.3571 | 67 |
| Layered | 78/28 = 2.7857 | 56 |
| Monolith | 74/28 = 2.6429 | 53 |

Top = Microservices ✓ (AC-3). Gap to Serverless = 8.33 % → a **close call is expected and
flagged** — the acceptance test must assert both facts.

### 9.3 Fixture C — the complex-domain scenario (Build Spec acceptance 5, revised)

Levels: `domain = 2, team = 0, ttm = 0` (others default).
Raw: `maint 4, test 2`; `S = 6` → `w(maint) = 66.67 %, w(test) = 33.33 %`.
**D1 top = Modular Monolith (4.0)**; **D4: Hexagonal = Clean = 5.0 exactly** — the tie is broken
by canonical order → Hexagonal #1, Clean #2; Vertical Slice 4.0; Layered 3.0.
*(The original scenario used `ttm = 1`, under which Vertical Slice edges Hexagonal 4.0 vs 3.875 —
the scenario was corrected to `ttm = 0`, where the stated intent "complex domain → Hexagonal/Clean"
holds exactly.)*

### 9.4 Preset calibration results

With the calibrated levels in Model Data Sheet Section 6, **all 25 preset targets hold**
(5 presets × 5 dimensions). Winner composites, for regression:

| Preset | D1 | D2 | D3 | D4 | D5 |
|---|---|---|---|---|---|
| startup-mvp | Monolith 4.5000 | Synchronous 4.0000 | Single shared DB 4.5000 | Layered 4.5000 | SPA 4.0000 |
| regulated | Modular Monolith 4.0000 | Synchronous 3.6579 | Single shared DB 3.3158 | Hexagonal 3.9737 | SPA 3.3421 |
| high-traffic-ecommerce | Microservices 3.9032 | Event-driven 3.4032 | Database-per-service 3.8548 | Hexagonal 3.5645 | Micro-frontends 3.4516 |
| iot-streaming | Serverless 3.7302 | Streaming 3.6349 | CQRS 3.7143 | Hexagonal 3.3175 | SSR 3.4286 |
| internal-tool | Modular Monolith 3.8846 | Synchronous 3.9231 | Single shared DB 3.6923 | Layered 3.5769 | SPA 3.5000 |

Many preset dimensions are intentionally close calls (the tool flags them); the **top option** is
the assertion, with alternative sets (`Hexagonal/Clean`, `SPA/SSR`, `Microservices/Serverless`,
`CQRS/Event Sourcing`) where SRS Section 5.3 allows them.

**Calibration margins.** For every target, the verification script also reports the **margin**:
the relative gap between the winner and the best option *outside* the allowed set. Four targets
are **calibration-sensitive** (margin < 2 %) — they hold today, but a small ratification change
could flip them, so any model change must re-run `node scripts/verify-model.mjs` and, if a
fragile target flips, either recalibrate the preset levels or re-ratify the target via an ADR
(Charter Section 14.4):

| Preset · dimension | Winner | Best outside the target set | Margin |
|---|---|---|---|
| iot-streaming · D3 | CQRS 3.7143 | Database-per-service 3.6825 | **0.85 %** |
| internal-tool · D1 | Modular Monolith 3.8846 | Monolith 3.8462 | **0.99 %** |
| regulated · D3 | Single shared DB 3.3158 | Database-per-service 3.2632 | **1.59 %** |
| high-traffic-ecommerce · D2 | Event-driven 3.4032 | Streaming 3.3387 | **1.90 %** |

All remaining targets hold with margins ≥ 2.98 %. (The two former exact ties — Hexagonal vs Clean
in the e-commerce and IoT D4 columns — were resolved by widening those targets to
`Hexagonal / Clean`: the pair differs only on `interoperability`, so whenever that weight is 0
they tie exactly and only the canonical order separated them.)

## 10. Engine invariants & required property tests

Beyond the fixtures, the test suite (NFR-MAINT-2) **shall** assert these properties over random
valid inputs:

1. Normalized weights sum to 100 within 1e-9 — for every input, including overrides/locks.
2. Composite ∈ [1, 5] for every option and every input.
3. Contribution rows sum to the composite within 1e-9 (identity check).
4. Determinism: identical input state ⇒ bit-identical ranked output (ordering included).
5. Clamping: factor levels outside 0..2 and unlisted `qaFit` entries never throw — they clamp/default.
6. The equal-weight fallback engages **iff** every raw weight is 0.
7. Displayed weight integers sum to exactly 100; displayed contribution rows sum to the displayed composite.
8. Sensitivity never reports a flip that re-evaluation cannot reproduce, and "robust" means an empty flip set.

---

## 11. Methodological validity & known limitations

Stated openly so reviewers can judge the model on the same terms its authors do — and so the
documented mitigations are recognized as deliberate, not accidental.

1. **Commensurability is satisfied.** The weighted-sum model is only meaningful when all criteria
   share a common scale [2]; here every `qaFit` uses one absolute 1–5 scale, so the classic
   unit-aggregation objection to WSM does not apply.
2. **Rank stability by construction.** An option's composite depends only on its own fits and the
   weights — never on the other options — so adding or removing an option can never reorder the
   rest. The rank-reversal phenomenon documented for AHP [7] cannot occur here. AHP-style pairwise
   comparison [8] was deliberately rejected: 12 QAs would demand 66 pairwise judgments per user,
   incompatible with the ≤ 5-minute KPI (K3); the factor→QA matrix instead follows the
   simple-multiattribute (SMART-family) tradition, shown to be robust in practice [9].
3. **Ordinal scales treated as interval.** Factor levels (0–2) and fits (1–5) are ordinal
   measurements used arithmetically — a known approximation in measurement theory [10]. This is
   precisely why the values are editable, a sensitivity analysis is built in [12], and every
   result carries a permanent heuristics disclaimer (Charter Section 21).
4. **Preferential independence is assumed.** Additive aggregation formally requires mutual
   preferential independence of criteria [1]; some QAs correlate in practice (e.g. deployability
   and maintainability). This is a standard, accepted simplification in applied MCDA [11],
   mitigated by full transparency, close-call detection, and the sensitivity analysis.
5. **Calibration sensitivity is measured, not hidden.** The verification script reports the margin
   of every preset target (Section 9.4); the four targets under 2 % are flagged in its output, and
   the maintenance rule is: **re-run the script after any model change** — a flipped fragile
   target means recalibrating levels or re-ratifying the target via ADR.

## 12. References

1. R. L. Keeney and H. Raiffa, *Decisions with Multiple Objectives: Preferences and Value Tradeoffs*. New York: Wiley, 1976.
2. E. Triantaphyllou, *Multi-Criteria Decision Making Methods: A Comparative Study*. Dordrecht: Kluwer Academic (Springer), 2000.
3. M. L. Balinski and H. P. Young, *Fair Representation: Meeting the Ideal of One Man, One Vote*. New Haven, CT: Yale University Press, 1982.
4. R. Kazman, M. Klein, and P. Clements, "ATAM: Method for Architecture Evaluation," SEI, Carnegie Mellon Univ., Tech. Rep. CMU/SEI-2000-TR-004, 2000.
5. IEEE Std 754-2019, *IEEE Standard for Floating-Point Arithmetic*, IEEE, 2019.
6. P. C. Fishburn, "Additive utilities with incomplete product sets: Application to priorities and assignments," *Operations Research*, vol. 15, no. 3, 1967.
7. V. Belton and T. Gear, "On a short-coming of Saaty's method of analytic hierarchies," *Omega*, vol. 11, no. 3, pp. 228–230, 1983.
8. T. L. Saaty, *The Analytic Hierarchy Process*. New York: McGraw-Hill, 1980.
9. W. Edwards and F. H. Barron, "SMARTS and SMARTER: Improved simple methods for multiattribute utility measurement," *Organizational Behavior and Human Decision Processes*, vol. 60, no. 3, pp. 306–325, 1994.
10. S. S. Stevens, "On the theory of scales of measurement," *Science*, vol. 103, no. 2684, pp. 677–680, 1946.
11. V. Belton and T. J. Stewart, *Multiple Criteria Decision Analysis: An Integrated Approach*. Boston, MA: Kluwer Academic, 2002.
12. E. Triantaphyllou and A. Sánchez, "A sensitivity analysis approach for some deterministic multi-criteria decision-making methods," *Decision Sciences*, vol. 28, no. 1, pp. 151–194, 1997.

---

> **In plain language:** this document writes down the arithmetic of the tool so precisely that
> two strangers implementing it independently would produce identical numbers — every formula,
> every tie-break, every rounding rule, and a set of worked examples that a script re-checks
> automatically, so the math can never silently drift from the documentation.
