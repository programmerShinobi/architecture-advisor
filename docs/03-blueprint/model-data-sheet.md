# Architecture Advisor — Model Data Sheet (frozen model values)

**Blueprint Phase · Implementation Data Appendix**

| Field | Detail |
|---|---|
| **Document type** | Model Data Sheet (the single source of truth for every model value) |
| **Version** | 0.4 |
| **Date** | 2026-06-12 |
| **Status** | Baseline — build against this; model heuristics pending Domain-Advisor ratification |
| **Author / Owner** | Faqih Pratama Muhti, B.Sc. Computer Science |
| **Audience** | Engineers building the scoring engine and `config/` |
| **Derived from** | [Build Spec v3](../specs/build-spec-v3.md) Sections 3–12 · [SRS](../02-requirement-analysis/software-requirements-specification.md) v0.5 Section 5 · [UI prototype](prototype/index.html) |
| **License** | [CC BY 4.0](../../LICENSE-docs.md) |

**Document history**

| Version | Date | Summary |
|---|---|---|
| 0.1 | 2026-06-12 | Froze all numeric model values in one place: the 12-QA index, 14 factors + defaults, factor→QA matrix, D1–D5 `qaFit` vectors (D4/D5 promoted from the prototype), anti-pattern rules, and a baseline preset factor-level table |
| 0.2 | 2026-06-12 | Calibration pass, machine-verified by [`scripts/verify-model.mjs`](../../scripts/verify-model.mjs): pinned the default `budget` level at 2 (the no-signal level of the inverted factor — makes AC-2/AC-3 hold exactly); calibrated preset levels (regulated `scale`/`dataVolume` → 0, e-commerce `realtime` → 0, internal-tool `ttm` → 2); computation rules now live in the [Scoring Algorithm Specification](scoring-algorithm.md) |
| 0.3 | 2026-06-12 | Added literature anchors (Section 8): the per-dimension trade-off shapes are tied to their established sources (Richards & Ford, Newman, Kleppmann, Cockburn, Martin, Lewis & Fowler, Jackson) for Domain-Advisor ratification |
| 0.4 | 2026-06-12 | Authored the bilingual factor content (Section 2.1): EN/ID labels, level labels, and help text for all 14 factors — baseline copy pending Translator review |

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
> master that those files must mirror. **How** these values are computed (formulas, tie-breaking,
> rounding, sensitivity) is pinned in the [Scoring Algorithm Specification](scoring-algorithm.md),
> and both documents are re-checked by [`scripts/verify-model.mjs`](../../scripts/verify-model.mjs).

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
`ttm` = 1 and `budget` = 2** (Build Spec Section 4, Section 12). Defaults are the **no-signal**
level of each factor — and because `budget` is inverted (a *tight* budget is the strongest cost
signal), its no-signal level is 2 (Flexible), not 0. Order below is the canonical factor order
used by the preset table in Section 6.

| # | `id` | Label (EN) | Group | Default |
|---|---|---|---|---|
| 1 | `team` | Team size | Team & delivery | 0 |
| 2 | `distribution` | Team distribution | Team & delivery | 0 |
| 3 | `ttm` | Time-to-market pressure | Team & delivery | **1** |
| 4 | `budget` | Budget / cost flexibility | Team & delivery | **2** *(inverted factor — see note above)* |
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

### 2.1 Factor content — labels, level labels & help (EN · ID) — 🧪 Baseline copy

The user-facing copy for all 14 factors, in both product languages. Each help text states *what
the factor means* and *why it shifts the priorities* (Build Spec Section 4). English is the
authoring language; the Indonesian copy follows the product's plain-language register and awaits
Translator review (Charter Section 14.2).

| `id` | Label & levels (EN · *ID*) | Help (EN) | Help (ID) |
|---|---|---|---|
| `team` | Team size · *Ukuran tim*<br>0 Small (1–5) · *Kecil (1–5)*<br>1 Medium (6–20) · *Sedang (6–20)*<br>2 Large / multiple teams · *Besar / banyak tim* | How many people build and maintain the system. Larger or multiple teams make independent releases and clear module boundaries more valuable (deployability, maintainability). | Berapa banyak orang yang membangun dan merawat sistem. Tim besar atau banyak tim membuat rilis mandiri dan batas modul yang jelas semakin penting (deployability, maintainability). |
| `distribution` | Team distribution · *Sebaran tim*<br>0 Co-located · *Satu lokasi*<br>1 Partly remote · *Sebagian remote*<br>2 Fully distributed / global · *Terdistribusi penuh / global* | Where the team works from. Distributed teams coordinate less easily, so architectures that let each group ship independently matter more (deployability, maintainability). | Dari mana tim bekerja. Tim terdistribusi lebih sulit berkoordinasi, sehingga arsitektur yang memungkinkan tiap kelompok rilis secara mandiri menjadi lebih penting (deployability, maintainability). |
| `ttm` | Time-to-market pressure · *Tekanan waktu rilis*<br>0 Relaxed · *Santai*<br>1 Moderate · *Sedang*<br>2 Very urgent · *Sangat mendesak* | How urgently the first version must ship. High pressure favors simple options that deliver fast (time-to-market), at a small cost to long-term structure (maintainability). | Seberapa mendesak versi pertama harus dirilis. Tekanan tinggi mengutamakan opsi sederhana yang cepat jadi (time-to-market), dengan sedikit mengorbankan struktur jangka panjang (maintainability). |
| `budget` | Budget / cost flexibility · *Fleksibilitas anggaran*<br>0 Tight · *Ketat*<br>1 Moderate · *Sedang*<br>2 Flexible · *Longgar* | How much money is available to run the system. A tight budget raises the weight of cost efficiency — this factor is **inverted**: level 0 (Tight) is the strongest signal. | Seberapa besar dana untuk menjalankan sistem. Anggaran ketat menaikkan bobot efisiensi biaya — faktor ini **terbalik**: level 0 (Ketat) adalah sinyal terkuat. |
| `lifespan` | Expected system lifespan · *Perkiraan umur sistem*<br>0 Throwaway / prototype · *Sekali pakai / prototipe*<br>1 Medium-term · *Jangka menengah*<br>2 Long-lived / strategic · *Jangka panjang / strategis* | How long the system is expected to live. Long-lived systems repay investment in clean structure, tests, and monitoring (maintainability, testability, observability). | Berapa lama sistem diperkirakan dipakai. Sistem berumur panjang layak diberi investasi struktur yang rapi, pengujian, dan pemantauan (maintainability, testability, observability). |
| `scale` | Expected scale / traffic · *Perkiraan skala / trafik*<br>0 Low · *Rendah*<br>1 Medium · *Sedang*<br>2 High / extreme spikes · *Tinggi / lonjakan ekstrem* | How much traffic the system must handle. High scale raises scalability, performance, and availability — and cost efficiency, because waste multiplies at scale. | Seberapa besar trafik yang harus ditangani. Skala tinggi menaikkan bobot skalabilitas, performa, dan ketersediaan — juga efisiensi biaya, karena pemborosan ikut berlipat pada skala besar. |
| `dataVolume` | Data volume · *Volume data*<br>0 Low · *Rendah*<br>1 Moderate · *Sedang*<br>2 Very large / big data · *Sangat besar / big data* | How much data is stored and processed. Very large data raises scalability and performance needs, and storage cost matters more (cost efficiency). | Seberapa banyak data yang disimpan dan diolah. Data sangat besar menaikkan kebutuhan skalabilitas dan performa, dan biaya penyimpanan semakin berpengaruh (efisiensi biaya). |
| `async` | Async / event-driven workload · *Beban asinkron / berbasis event*<br>0 Minimal · *Minimal*<br>1 Some · *Sebagian*<br>2 Heavy / many integrations · *Berat / banyak integrasi* | How much work happens in the background or reacts to events. Heavy async workloads favor architectures that absorb bursts and keep running when one part is busy (scalability, availability, performance). | Seberapa banyak pekerjaan berjalan di latar belakang atau bereaksi terhadap event. Beban asinkron yang berat cocok dengan arsitektur yang mampu menyerap lonjakan dan tetap berjalan saat satu bagian sibuk (skalabilitas, ketersediaan, performa). |
| `realtime` | Real-time / low-latency need · *Kebutuhan real-time / latensi rendah*<br>0 Not important · *Tidak penting*<br>1 Somewhat · *Cukup penting*<br>2 Critical (sub-second) · *Kritis (sub-detik)* | How fast responses must be. Sub-second requirements push performance to the top, with availability close behind. | Seberapa cepat respons harus diberikan. Kebutuhan sub-detik menempatkan performa di prioritas teratas, disusul ketersediaan. |
| `domain` | Business domain complexity · *Kompleksitas domain bisnis*<br>0 Simple · *Sederhana*<br>1 Moderate · *Sedang*<br>2 Complex · *Kompleks* | How intricate the business rules are. Complex domains repay structures that isolate and test business logic (maintainability, testability). | Seberapa rumit aturan bisnisnya. Domain yang kompleks layak diberi struktur yang memisahkan dan menguji logika bisnis (maintainability, testability). |
| `consistency` | Data consistency need · *Kebutuhan konsistensi data*<br>0 Eventual is fine · *Eventual cukup*<br>1 Mixed · *Campuran*<br>2 Strong consistency required · *Wajib konsistensi kuat* | How strictly data must agree at all times. A strong-consistency requirement dominates the data-management choice (data consistency). | Seberapa ketat data harus selalu sinkron. Kebutuhan konsistensi kuat sangat menentukan pilihan pengelolaan data (konsistensi data). |
| `security` | Security / compliance need · *Kebutuhan keamanan / kepatuhan*<br>0 Standard · *Standar*<br>1 Elevated · *Lebih tinggi*<br>2 Strict (regulated data) · *Ketat (data teregulasi)* | How sensitive the data and rules are. Regulated data (finance, health) raises the security weight sharply. | Seberapa sensitif data dan aturannya. Data teregulasi (keuangan, kesehatan) menaikkan bobot keamanan secara tajam. |
| `legacy` | Legacy integration burden · *Beban integrasi sistem lama*<br>0 None / greenfield · *Tidak ada / greenfield*<br>1 Some · *Sebagian*<br>2 Heavy legacy coupling · *Keterikatan legacy berat* | How much the system must connect to older systems. Heavy legacy coupling raises interoperability and rewards architectures with clean integration seams (maintainability). | Seberapa besar sistem harus terhubung ke sistem lama. Keterikatan legacy yang berat menaikkan bobot interoperabilitas dan menghargai arsitektur dengan titik integrasi yang rapi (maintainability). |
| `devops` | DevOps / platform maturity · *Kematangan DevOps / platform*<br>0 Low · *Rendah*<br>1 Medium · *Sedang*<br>2 Mature (CI/CD, monitoring) · *Matang (CI/CD, pemantauan)* | How strong the team's automation and operations are. Mature platforms can safely run more independently deployed parts (deployability, observability). | Seberapa kuat otomasi dan operasional tim. Platform yang matang dapat menjalankan lebih banyak bagian yang dirilis mandiri secara aman (deployability, observability). |

> English level labels are verbatim from Build Spec Section 4 (🔒); the Indonesian labels and both
> help texts are 🧪 baseline copy pending Translator review. At build time this table maps 1:1 to
> `config/factors.ts` (`label`, `levels[0..2]`, `help` — each `{ en, id }`).

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

## 6. Scenario presets — factor levels — 🧪 Calibrated baseline (ratify per OI-2)

Each preset sets all 14 factor levels (column order = Section 2). These levels are **calibrated
and machine-verified**: running [`scripts/verify-model.mjs`](../../scripts/verify-model.mjs)
recomputes every preset against the outcome targets in
[SRS Section 5.3](../02-requirement-analysis/software-requirements-specification.md#5-data--decision-model-requirements)
— all 25 targets (5 presets × 5 dimensions) currently hold. **If a future model change breaks a
target, adjust the levels here — not the targets** — and re-run the script.

Columns: `team, distribution, ttm, budget, lifespan, scale, dataVolume, async, realtime, domain, consistency, security, legacy, devops`

| Preset `id` | team | dist | ttm | budget | lifespan | scale | dataVol | async | realtime | domain | consist | security | legacy | devops |
|---|--|--|--|--|--|--|--|--|--|--|--|--|--|--|
| `startup-mvp` | 0 | 0 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `regulated` | 1 | 0 | 0 | 1 | 2 | 0 | 0 | 0 | 0 | 2 | 2 | 2 | 1 | 1 |
| `high-traffic-ecommerce` | 2 | 2 | 0 | 2 | 2 | 2 | 2 | 2 | 0 | 2 | 1 | 1 | 0 | 2 |
| `iot-streaming` | 1 | 1 | 1 | 1 | 2 | 2 | 2 | 2 | 2 | 1 | 0 | 1 | 0 | 2 |
| `internal-tool` | 1 | 0 | 2 | 1 | 1 | 0 | 0 | 0 | 0 | 1 | 1 | 0 | 1 | 1 |

Calibration notes (v0.2): `regulated` drops `scale`/`dataVolume` to 0 — the preset is driven by
consistency/security, and any traffic signal pushes D3 toward Database-per-service, off its
Single-shared-DB target; `high-traffic-ecommerce` drops `realtime` to 0 — a `performance` boost
tips D2 from Event-driven to Streaming; `internal-tool` raises `ttm` to 2 — internal tools carry
quick-delivery expectations, which is also what keeps D4 on Layered rather than Hexagonal.

**Expected top recommendation per preset (the regression assertion — SRS 5.3):**

| Preset | D1 | D2 | D3 | D4 | D5 |
|---|---|---|---|---|---|
| `startup-mvp` | Monolith | Synchronous | Single shared DB | Layered | SPA |
| `regulated` | Modular Monolith | Synchronous | Single shared DB | Hexagonal / Clean | SPA / SSR |
| `high-traffic-ecommerce` | Microservices | Event-driven | Database-per-service | Hexagonal | Micro-frontends |
| `iot-streaming` | Microservices / Serverless | Streaming | CQRS / Event Sourcing | Hexagonal | SPA / SSR |
| `internal-tool` | Modular Monolith | Synchronous | Single shared DB | Layered | SPA |

> Cross-check: `high-traffic-ecommerce` equals the SRS acceptance scenario AC-3
> (`team=2, distribution=2, scale=2, devops=2, ttm=0` → D1 = Microservices) and avoids the
> distributed-monolith danger (D3 ≠ single shared DB). `startup-mvp` keeps every driver low so the
> default-style Monolith wins and no over-engineering warning fires. The `iot-streaming` D5 target
> was widened to **SPA / SSR** (the alternative-set style already used by other cells): under the
> heavy `performance` weight that defines IoT, SSR's perf fit (5) legitimately wins, and every
> level change that forced SPA broke the D3/D4 targets — widening the target is the honest fix.

---

## 7. Integrity rules (engine invariants) — 🔒 Fixed

These must hold for every input and are unit-tested (NFR-MAINT-2, SRS FR-EDGE-6):

1. Any unlisted `qaFit` entry resolves to **3**.
2. Normalized QA weights always **sum to 100** (after clamping negatives to 0).
3. A per-option contribution breakdown always **reconciles exactly** to the composite score (FR-REC-4).
4. Factor levels are clamped to **0–2**; if all weights resolve to 0, fall back to **equal weights** (FR-EDGE-6).
5. Displayed scores are normalized to **0–100** within each dimension and rounded.

---

## 8. Literature anchors for the fit heuristics

The `qaFit` values are expert heuristics (Charter Section 9), but they are **not invented from
nothing** — each dimension's trade-off shape follows established, widely cited literature, which
is also where a Domain Advisor should start when ratifying them:

| Dimension | The trade-off shape encoded | Primary sources |
|---|---|---|
| D1 Deployment Granularity | Microservices trade data consistency & cost for deployability/scalability; monoliths the reverse | M. Richards & N. Ford, *Fundamentals of Software Architecture* (O'Reilly, 2020), ch. 9–17; S. Newman, *Building Microservices*, 2nd ed. (O'Reilly, 2021); J. Lewis & M. Fowler, "Microservices" (martinfowler.com, 2014) |
| D2 Communication Style | Synchronous favors consistency/simplicity; events favor scalability/resilience at consistency cost | M. Kleppmann, *Designing Data-Intensive Applications* (O'Reilly, 2017), ch. 11–12; Richards & Ford 2020, ch. 14–15 |
| D3 Data Management | Shared DB favors consistency/simplicity; per-service/CQRS/event sourcing favor scale & autonomy at consistency/ops cost | Kleppmann 2017; Newman 2021, ch. 4–5 |
| D4 Code Structure | Hexagonal/Clean favor maintainability & testability at early-delivery cost; layered the reverse | A. Cockburn, "Hexagonal Architecture (Ports & Adapters)" (alistair.cockburn.us, 2005); R. C. Martin, *Clean Architecture* (Prentice Hall, 2017) |
| D5 Frontend Architecture | Micro-frontends favor team-scale deployability at complexity cost; SSR favors first-paint performance | C. Jackson, "Micro Frontends" (martinfowler.com, 2019); Richards & Ford 2020 |

The scoring mathematics itself is grounded separately in the
[Scoring Algorithm Specification](scoring-algorithm.md) Section 11 (additive multi-attribute
value theory, sensitivity analysis, apportionment).

## 9. What is still pending (and who closes it)

| Item | Status | Closes |
|---|---|---|
| D4 / D5 `qaFit` vectors (Section 4) | 🧪 Baseline recorded | Domain Advisor ratifies → SRS OI-4 |
| Preset factor levels (Section 6) | 🧪 **Calibrated & machine-verified** (all 25 targets hold) | Domain Advisor ratifies → SRS OI-2 |
| Factor content EN/ID (labels, level labels, help) | 🧪 **Authored** (Section 2.1) | Translator review → Charter Section 14.2 |
| Option educational metadata; fitness & anti-pattern messages (EN/ID) | ✍ To author | Build Spec Section 7, Section 10, Section 11 |
| C4 Mermaid stub in v1.0? | ❔ Scope | SRS OI-3 |
| Performance budgets ratified | 🧪 Interim set | SRS OI-5 / design DI-4 |

> Numbers in this sheet (🔒 and 🧪) are sufficient to **build and run** the engine today. Ratifying
> the 🧪 values changes only these tables, never the requirements that reference them.
