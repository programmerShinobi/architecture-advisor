# Architecture Advisor — Model Data Sheet (frozen model values)

**Blueprint Phase · Implementation Data Appendix**

| Field | Detail |
|---|---|
| **Document type** | Model Data Sheet (the single source of truth for every model value) |
| **Version** | 0.1 |
| **Date** | 2026-06-12 |
| **Status** | Baseline — build against this; model heuristics pending Domain-Advisor ratification |
| **Author / Owner** | Faqih Pratama Muhti, B.Sc. Computer Science |
| **Audience** | Engineers building the scoring engine and `config/` |
| **Derived from** | [Build Spec v3](../specs/build-spec-v3.md) Sections 3–12 · [SRS](../02-requirement-analysis/software-requirements-specification.md) v0.2 Section 5 · [UI prototype](prototype/index.html) |
| **License** | [CC BY 4.0](../../LICENSE-docs.md) |

**Document history**

| Version | Date | Summary |
|---|---|---|
| 0.1 | 2026-06-12 | Froze all numeric model values in one place: the 12-QA index, 14 factors + defaults, factor→QA matrix, D1–D5 `qaFit` vectors (D4/D5 promoted from the prototype), anti-pattern rules, and a baseline preset factor-level table |

---

## Why this document exists

The charter, SRS, and design spec say *what* the model must do; the Build Spec defines *most* of
the numbers. But two sets of values were left "to be assigned" (D4/D5 `qaFit`) or "to be
calibrated" (preset factor levels), which would force a developer to guess. **This sheet freezes
every value the scoring engine needs, in one place,** so Phase 4 development has no ambiguity.

**Provenance & authority of each table is labeled:**

- 🔒 **Fixed** — taken verbatim from Build Spec v3; change only via the model-change ADR process
  ([Charter Section 14.4](../01-discovery-and-planning/discovery-and-planning.md#14-governance--contribution)).
- 🧪 **Baseline** — a defensible default (promoted from the prototype or derived to hit the SRS
  outcome targets); **valid to build against now**, to be ratified by a Domain Advisor
  (SRS [OI-2](../02-requirement-analysis/software-requirements-specification.md#9-open-issues--to-be-determined), OI-4).
  Ratification adjusts numbers **in this sheet**, not the requirements.

> All values live in `config/` at build time (NFR-MAINT-1); this sheet is the human-readable
> master that those files must mirror.

---

## 1. Quality-attribute index (the `qaFit` vector order) — 🔒 Fixed

Every `qaFit` vector below has **12 entries in exactly this order**. (Build Spec Section 3.)

| # | `QaId` | Name | Economic? |
|---|---|---|---|
| 1 | `performance` | Performance & latency | no |
| 2 | `scalability` | Scalability | no |
| 3 | `availability` | Availability & resilience | no |
| 4 | `security` | Security | no |
| 5 | `maintainability` | Maintainability & evolvability | no |
| 6 | `deployability` | Deployability & release independence | no |
| 7 | `testability` | Testability | no |
| 8 | `observability` | Observability | no |
| 9 | `dataConsistency` | Data consistency & integrity | no |
| 10 | `interoperability` | Interoperability & integration | no |
| 11 | `costEfficiency` | Cost efficiency | **yes** |
| 12 | `timeToMarket` | Time-to-market / delivery speed | **yes** |

---

## 2. Project factors & default levels — 🔒 Fixed (count pinned at 14)

14 factors, each with 3 ordinal levels (0/1/2). **Default level is 0 for every factor except
`ttm` = 1** (Build Spec Section 4, Section 12). Order below is the canonical factor order used by
the preset table in Section 6.

| # | `id` | Label (EN) | Group | Default |
|---|---|---|---|---|
| 1 | `team` | Team size | Team & delivery | 0 |
| 2 | `distribution` | Team distribution | Team & delivery | 0 |
| 3 | `ttm` | Time-to-market pressure | Team & delivery | **1** |
| 4 | `budget` | Budget / cost flexibility | Team & delivery | 0 |
| 5 | `lifespan` | Expected system lifespan | Team & delivery | 0 |
| 6 | `scale` | Expected scale / traffic | Scale & performance | 0 |
| 7 | `dataVolume` | Data volume | Scale & performance | 0 |
| 8 | `async` | Async / event-driven workload | Scale & performance | 0 |
| 9 | `realtime` | Real-time / low-latency need | Scale & performance | 0 |
| 10 | `domain` | Business domain complexity | Domain, data & risk | 0 |
| 11 | `consistency` | Data consistency need | Domain, data & risk | 0 |
| 12 | `security` | Security / compliance need | Domain, data & risk | 0 |
| 13 | `legacy` | Legacy integration burden | Domain, data & risk | 0 |
| 14 | `devops` | DevOps / platform maturity | Domain, data & risk | 0 |

> Level labels (EN/ID) and help text per factor: Build Spec Section 4 (content to be authored —
> see the build-readiness checklist in the design spec).

---

## 3. Factor → QA influence matrix — 🔒 Fixed

Contribution of a factor to a QA weight = `influence × level`, **except `budget`**, which is
inverted: use `(2 − budgetLevel)` so a tight budget raises `costEfficiency`. Everything not listed
is 0. Sum, clamp negatives to 0, then normalize to 100. (Build Spec Section 5.)

| Factor | Influences (QA: weight) |
|---|---|
| `team` | deployability +2, maintainability +1 |
| `distribution` | deployability +2, maintainability +1 |
| `ttm` | timeToMarket +3, maintainability −1 |
| `budget` *(inverted)* | costEfficiency +3 |
| `lifespan` | maintainability +2, testability +1, observability +1 |
| `scale` | scalability +3, performance +1, availability +1, costEfficiency +1 |
| `dataVolume` | scalability +2, performance +1, costEfficiency +1 |
| `async` | scalability +1, availability +1, performance +1 |
| `realtime` | performance +3, availability +1 |
| `domain` | maintainability +2, testability +1 |
| `consistency` | dataConsistency +3 |
| `security` | security +3 |
| `legacy` | interoperability +3, maintainability +1 |
| `devops` | deployability +1, observability +1 |

---

## 4. Dimension options & `qaFit` vectors

Composite score of an option = `Σ_QA ( normalizedWeight[QA]/100 × qaFit[QA] )`. Vectors are in the
Section 1 order: `[perf, scal, avail, sec, maint, deploy, test, obs, dataCons, interop, cost, ttm]`.
Values are integers 1–5; any unlisted entry defaults to **3**.

### D1 — Deployment Granularity (5 options) — 🔒 Fixed (Build Spec Section 6)

| Option `id` | `name` | qaFit |
|---|---|---|
| `layered` | Layered / N-Tier | `4,3,3,4,3,2,3,3,5,3,4,4` |
| `monolith` | Monolith | `4,2,3,4,3,2,4,4,5,3,4,5` |
| `modular-monolith` | Modular Monolith | `4,3,3,4,4,3,4,4,5,3,4,4` |
| `microservices` | Microservices | `3,5,4,4,4,5,3,3,2,4,2,2` |
| `serverless` | Serverless (FaaS) | `3,5,4,3,3,4,3,3,3,3,4,4` |

### D2 — Communication Style (4 options) — 🔒 Fixed (Build Spec Section 6; unlisted = 3)

| Option `id` | `name` | qaFit |
|---|---|---|
| `synchronous` | Synchronous (request/response) | `4,2,2,3,4,3,3,4,5,3,3,5` |
| `async-messaging` | Async messaging | `3,4,4,3,3,3,3,3,3,3,3,3` |
| `event-driven` | Event-driven (pub/sub) | `3,5,5,3,3,3,3,2,2,3,3,2` |
| `streaming` | Streaming | `5,5,4,3,2,3,3,2,2,3,3,2` |

### D3 — Data Management (5 options) — 🔒 Fixed (Build Spec Section 6; unlisted = 3)

| Option `id` | `name` | qaFit |
|---|---|---|
| `single-db` | Single shared database | `4,2,3,3,3,2,3,3,5,3,4,5` |
| `db-per-service` | Database-per-service | `3,5,3,3,4,5,3,3,2,3,3,3` |
| `cqrs` | CQRS | `5,5,3,3,3,3,3,3,3,3,3,2` |
| `event-sourcing` | Event Sourcing | `3,4,3,3,2,3,3,5,4,3,2,2` |
| `polyglot` | Polyglot persistence | `4,4,3,3,3,3,3,3,3,4,2,3` |

### D4 — Code Structure (4 options) — 🧪 Baseline (promoted from prototype; ratify per OI-4)

Build Spec Section 6 left D4 `qaFit` "to be assigned & documented." These are the values the
prototype already encodes and displays; they follow the Build Spec principle (Hexagonal/Clean
favor maintainability/testability at a time-to-market cost; simpler structures favor `ttm`).

| Option `id` | `name` | qaFit |
|---|---|---|
| `hexagonal` | Hexagonal (Ports & Adapters) | `3,3,3,4,5,3,5,3,3,4,3,2` |
| `clean` | Clean Architecture | `3,3,3,4,5,3,5,3,3,3,3,2` |
| `vertical-slice` | Vertical Slice | `3,3,3,3,4,3,4,3,3,3,3,4` |
| `layered` | Layered | `3,3,3,3,3,3,3,3,3,3,4,5` |

### D5 — Frontend Architecture (3 options) — 🧪 Baseline (promoted from prototype; ratify per OI-4)

Build Spec Section 6 left D5 `qaFit` "to be assigned & documented." Micro-frontends favor
deployability/scalability at a maintainability/`ttm` cost.

| Option `id` | `name` | qaFit |
|---|---|---|
| `micro-frontends` | Micro-frontends | `3,5,3,3,2,5,3,3,3,3,2,2` |
| `spa` | Single-page app (SPA) | `3,3,3,3,4,3,3,3,3,3,4,4` |
| `ssr` | Server-rendered (SSR/SSG) | `5,3,3,4,3,3,3,3,3,3,3,3` |

---

## 5. Anti-pattern rules — 🔒 Fixed (Build Spec Section 10)

Each rule is a boolean over factors + chosen options, with a severity and an EN/ID message.

| `id` | Severity | Condition |
|---|---|---|
| `premature-microservices` | danger | D1 = `microservices` AND `team` ≤ 0 AND `devops` ≤ 0 |
| `distributed-monolith` | danger | D1 = `microservices` AND D3 = `single-db` |
| `sync-coupling-at-scale` | warning | D1 = `microservices` AND D2 = `synchronous` AND `scale` ≥ 1 |
| `over-engineered-mvp` | warning | `lifespan` = 0 AND `ttm` = 2 AND (D1 = `microservices` OR D3 ∈ {`cqrs`, `event-sourcing`}) |
| `consistency-conflict` | warning | `consistency` = 2 AND (D2 = `event-driven` OR D3 = `event-sourcing` as primary store) |
| `legacy-without-plan` | warning | `legacy` = 2 AND D1 ∈ {`microservices`, `serverless`} AND no migration path chosen |
| `strict-security-shared-infra` | info | `security` = 2 AND D1 = `serverless` AND `devops` ≤ 1 |

---

## 6. Scenario presets — factor levels — 🧪 Baseline (calibrate & ratify per OI-2)

Each preset sets all 14 factor levels (column order = Section 2). These baseline levels are
**designed to produce the outcome targets in [SRS Section 5.3](../02-requirement-analysis/software-requirements-specification.md#5-data--decision-model-requirements)**.
The preset-calibration test is the source of truth: **if a preset does not yield its target
outcome once the engine exists, adjust the levels here — not the targets.**

Columns: `team, distribution, ttm, budget, lifespan, scale, dataVolume, async, realtime, domain, consistency, security, legacy, devops`

| Preset `id` | team | dist | ttm | budget | lifespan | scale | dataVol | async | realtime | domain | consist | security | legacy | devops |
|---|--|--|--|--|--|--|--|--|--|--|--|--|--|--|
| `startup-mvp` | 0 | 0 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `regulated` | 1 | 0 | 0 | 1 | 2 | 1 | 1 | 0 | 0 | 2 | 2 | 2 | 1 | 1 |
| `high-traffic-ecommerce` | 2 | 2 | 0 | 2 | 2 | 2 | 2 | 2 | 1 | 2 | 1 | 1 | 0 | 2 |
| `iot-streaming` | 1 | 1 | 1 | 1 | 2 | 2 | 2 | 2 | 2 | 1 | 0 | 1 | 0 | 2 |
| `internal-tool` | 1 | 0 | 1 | 1 | 1 | 0 | 0 | 0 | 0 | 1 | 1 | 0 | 1 | 1 |

**Expected top recommendation per preset (the regression assertion — SRS 5.3):**

| Preset | D1 | D2 | D3 | D4 | D5 |
|---|---|---|---|---|---|
| `startup-mvp` | Monolith | Synchronous | Single shared DB | Layered | SPA |
| `regulated` | Modular Monolith | Synchronous | Single shared DB | Hexagonal / Clean | SPA / SSR |
| `high-traffic-ecommerce` | Microservices | Event-driven | Database-per-service | Hexagonal | Micro-frontends |
| `iot-streaming` | Microservices / Serverless | Streaming | CQRS / Event Sourcing | Hexagonal | SPA |
| `internal-tool` | Modular Monolith | Synchronous | Single shared DB | Layered | SPA |

> Cross-check: `high-traffic-ecommerce` equals the SRS acceptance scenario AC-3
> (`team=2, distribution=2, scale=2, devops=2, ttm=0` → D1 = Microservices) and avoids the
> distributed-monolith danger (D3 ≠ single shared DB). `startup-mvp` keeps every driver low so the
> default-style Monolith wins and no over-engineering warning fires.

---

## 7. Integrity rules (engine invariants) — 🔒 Fixed

These must hold for every input and are unit-tested (NFR-MAINT-2, SRS FR-EDGE-6):

1. Any unlisted `qaFit` entry resolves to **3**.
2. Normalized QA weights always **sum to 100** (after clamping negatives to 0).
3. A per-option contribution breakdown always **reconciles exactly** to the composite score (FR-REC-4).
4. Factor levels are clamped to **0–2**; if all weights resolve to 0, fall back to **equal weights** (FR-EDGE-6).
5. Displayed scores are normalized to **0–100** within each dimension and rounded.

---

## 8. What is still pending (and who closes it)

| Item | Status | Closes |
|---|---|---|
| D4 / D5 `qaFit` vectors (Section 4) | 🧪 Baseline recorded | Domain Advisor ratifies → SRS OI-4 |
| Preset factor levels (Section 6) | 🧪 Baseline recorded | Calibration test + Domain Advisor → SRS OI-2 |
| Bilingual content (factor help; option pros/cons/whenToUse/learnMore; fitness & anti-pattern messages, EN/ID) | ✍ To author | Build Spec Section 7, Section 11 |
| C4 Mermaid stub in v1.0? | ❔ Scope | SRS OI-3 |
| Performance budgets ratified | 🧪 Interim set | SRS OI-5 / design DI-4 |

> Numbers in this sheet (🔒 and 🧪) are sufficient to **build and run** the engine today. Ratifying
> the 🧪 values changes only these tables, never the requirements that reference them.
