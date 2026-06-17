# Build Spec v3: Architecture Advisor — a quality-attribute-driven decision framework

You are a senior full-stack engineer and software architect. Build a complete, runnable
web application from this specification. Build everything; do not stop halfway and do not ask
clarifying questions first. If a detail is unspecified, choose the most defensible option and
record it in `DECISIONS.md`. Build in the PHASE ORDER in section 12; each phase must leave the
app runnable. When done, output a summary of files created, how to run, and which acceptance
criteria you verified.

This tool is meant for professional software engineers, architects, and analysts making real
architecture decisions. Credibility matters: ground the model in recognized methods (ISO/IEC
25010:2023, ATAM, Attribute-Driven Design, evolutionary-architecture fitness functions),
be transparent about every calculation, and be honest about uncertainty.

---

## 1. The core idea (read this first — it drives the whole design)

Most "architecture pickers" naively map inputs straight to a style name. That is not how
architects actually reason. Real decisions are driven by **quality attributes** (QAs) and the
**trade-offs** between them. This tool models that explicitly, as a transparent pipeline:

```
PROJECT FACTORS  ──►  QUALITY-ATTRIBUTE PRIORITIES  ──►  ARCHITECTURE FIT (per dimension)  ──►  ANALYSIS
(drivers &            (what the system must                (how well each option              (trade-offs, risks,
 constraints)          optimize for — a "utility            satisfies the prioritized          sensitivity, fitness
                       tree" of weighted QAs)               QAs, across several                functions, anti-pattern
                                                            orthogonal dimensions)             warnings, ADR/report)
```

The QA layer in the middle is the explainability bridge: the user can SEE that "microservices
scored high because you prioritized deployability and scalability, and despite hurting data
consistency, which you weighted low." That is what separates a serious tool from a toy.

Architecture is NOT a single label. The tool produces a coherent recommendation across several
**orthogonal dimensions** (deployment granularity, communication, data management, code
structure, frontend), checks the combination for known anti-patterns, and outputs a
professional decision record.

Design principles, in priority order:
1. **Intellectual honesty** — decision support, not an oracle. Show uncertainty, close calls,
   robustness, and a permanent disclaimer. The encoded weights are defensible defaults, not
   facts; they are fully editable.
2. **Transparency** — every score traceable to factor → QA weight → option fit.
3. **Methodological grounding** — cite ISO/IEC 25010:2023, ATAM, ADD, fitness functions.
4. **Approachable yet deep** — guided mode for newcomers, expert mode for architects.
5. **Actionable & shareable** — export ADR + full report + diagram stub; share via URL;
   extensible config so any org can tailor it.

---

## 2. Tech stack (use exactly this)

- Vite + React + TypeScript (strict mode)
- Tailwind CSS with dark mode (`class` strategy + toggle)
- Charts & diagram: **hand-built SVG** (radar, bar charts, C4-style stub) — no chart/diagram library *(implementation superseded the original `recharts` + `mermaid` plan; see [DECISIONS.md](../../DECISIONS.md))*
- State: React hooks only (`useState`/`useReducer`/`useMemo`/`useContext`); no Redux
- State persistence: `localStorage` + full state encoded in the URL hash (shareable links)
- i18n: lightweight dictionary (`{ en, id }`) + `t(key)` helper; runtime toggle; default = `id`
- Testing: `vitest` + `@testing-library/react`
- Quality: ESLint + Prettier; a GitHub Actions workflow (`.github/workflows/ci.yml`) that runs
  lint, test, build
- Pure client-side, no backend/DB/accounts/AI calls. `npm install && npm run dev` must work.
- Responsive to 360px; fully keyboard-accessible; WCAG AA contrast in both themes.

---

## 3. Quality attributes (the spine of the model — grounded in ISO/IEC 25010:2023)

Define 12 architecturally-significant QAs. Each has `id`, `name` (EN+ID), `definition` (EN+ID),
`isoMapping` (string), and `economicFlag` (boolean — true for concerns OUTSIDE the ISO product
model, shown honestly as economic/delivery goals rather than product-quality characteristics).

| id            | name                      | ISO/IEC 25010:2023 mapping                          | economicFlag |
|---------------|---------------------------|-----------------------------------------------------|--------------|
| performance   | Performance & latency     | Performance efficiency (time behaviour)             | false |
| scalability   | Scalability               | Flexibility › scalability (new 2023 subcharacteristic) | false |
| availability  | Availability & resilience | Reliability (availability, fault tolerance, recoverability) | false |
| security      | Security                  | Security                                            | false |
| maintainability | Maintainability & evolvability | Maintainability (modularity, modifiability)    | false |
| deployability | Deployability & release independence | Maintainability/Flexibility (operational)    | false |
| testability   | Testability               | Maintainability › testability                       | false |
| observability | Observability             | (operational concern; not an ISO top-level char.)   | false |
| dataConsistency | Data consistency & integrity | Functional suitability (correctness) / Reliability | false |
| interoperability | Interoperability & integration | Compatibility › interoperability               | false |
| costEfficiency | Cost efficiency           | (economic — outside ISO product quality model)      | true |
| timeToMarket  | Time-to-market / delivery speed | (business/delivery goal — outside ISO model)    | true |

Honesty requirement: in the "How it works" panel, state that `costEfficiency` and
`timeToMarket` are not ISO product-quality characteristics but are included because they
materially drive real architecture decisions; mark them visibly (e.g. an "economic" tag).

---

## 4. Project factors (drivers & constraints — the user-facing inputs)

14 factors. Each: `id`, `label` (EN+ID), `levels` (3 labels EN+ID for index 0/1/2), `help`
(EN+ID, 1–2 sentences: what it means + why it shifts QA priorities), and `group`.

| id          | label (EN)                       | level 0           | level 1          | level 2                    | group |
|-------------|----------------------------------|-------------------|------------------|----------------------------|-------|
| team        | Team size                        | Small (1–5)       | Medium (6–20)    | Large / multiple teams     | Team & delivery |
| distribution| Team distribution                | Co-located        | Partly remote    | Fully distributed / global | Team & delivery |
| ttm         | Time-to-market pressure          | Relaxed           | Moderate         | Very urgent                | Team & delivery |
| budget      | Budget / cost flexibility        | Tight             | Moderate         | Flexible                   | Team & delivery |
| lifespan    | Expected system lifespan         | Throwaway / prototype | Medium-term      | Long-lived / strategic     | Team & delivery |
| scale       | Expected scale / traffic         | Low               | Medium           | High / extreme spikes      | Scale & performance |
| dataVolume  | Data volume                      | Low               | Moderate         | Very large / big data      | Scale & performance |
| async       | Async / event-driven workload    | Minimal           | Some             | Heavy / many integrations  | Scale & performance |
| realtime    | Real-time / low-latency need     | Not important     | Somewhat         | Critical (sub-second)      | Scale & performance |
| domain      | Business domain complexity       | Simple            | Moderate         | Complex                    | Domain, data & risk |
| consistency | Data consistency need            | Eventual is fine  | Mixed            | Strong consistency required| Domain, data & risk |
| security    | Security / compliance need       | Standard          | Elevated         | Strict (regulated data)    | Domain, data & risk |
| legacy      | Legacy integration burden        | None / greenfield | Some             | Heavy legacy coupling      | Domain, data & risk |
| devops      | DevOps / platform maturity       | Low               | Medium           | Mature (CI/CD, monitoring) | Domain, data & risk |

Write accurate `help` text for every factor (EN+ID).

---

## 5. Factor → QA influence matrix (step 1 of scoring)

As factor levels rise, they raise the priority weight of certain QAs. Encode this as editable
config. Below are the NON-ZERO influences (everything else = 0). Contribution of a factor to a
QA weight = `influence * level` (level 0–2), EXCEPT `budget`, which is inverted: use
`(2 - budgetLevel)` so a tight budget raises `costEfficiency`.

```
team        → deployability +2, maintainability +1
distribution→ deployability +2, maintainability +1
ttm         → timeToMarket +3, maintainability -1
budget(inv) → costEfficiency +3
lifespan    → maintainability +2, testability +1, observability +1
scale       → scalability +3, performance +1, availability +1, costEfficiency +1
dataVolume  → scalability +2, performance +1, costEfficiency +1
async       → scalability +1, availability +1, performance +1
realtime    → performance +3, availability +1
domain      → maintainability +2, testability +1
consistency → dataConsistency +3
security    → security +3
legacy      → interoperability +3, maintainability +1
devops      → deployability +1, observability +1
```

After summing, **normalize** QA weights so they sum to 100 (display as percentages). Clamp
negatives to 0 before normalizing. These normalized weights ARE the "utility tree."

In expert mode, the user can override any QA weight directly (and lock it so factor changes
don't overwrite it). Document this as the ATAM-style stakeholder prioritization step.

---

## 6. Architecture dimensions & options (step 2 of scoring)

A recommendation spans 5 orthogonal dimensions. Each dimension has options; each option has an
`id`, `name`, `summary` (EN+ID), full educational metadata (section 7), a `qaFit` vector
(integer 1–5 per QA: 1 = poor fit, 5 = excellent), and a list of `risks` (section 9).

> **Canonical values.** Every `qaFit` vector below is reproduced from the
> [Model Data Sheet](../03-blueprint/model-data-sheet.md) Section 4, which is the **single source of
> truth** (machine-verified by [`verify-model.mjs`](../../scripts/verify-model.mjs)). Build the
> `config/dimensions.ts` values from the Model Data Sheet, not by eye from this prose — if anything
> ever differs, the Model Data Sheet wins.

Composite score of an option = `Σ_QA ( normalizedWeight[QA]/100 * qaFit[option][QA] )`.
Within each dimension, rank options by composite score. Round all displayed numbers.

**Dimension D1 — Deployment Granularity** *(Guided label: "How it's split into apps")*. Provide full qaFit vectors (order:
perf, scal, avail, sec, maint, deploy, test, obs, dataCons, interop, cost, ttm):

```
Layered / N-Tier      : 4,3,3,4,3,2,3,3,5,3,4,4
Monolith              : 4,2,3,4,3,2,4,4,5,3,4,5
Modular Monolith      : 4,3,3,4,4,3,4,4,5,3,4,4
Microservices         : 3,5,4,4,4,5,3,3,2,4,2,2
Serverless (FaaS)     : 3,5,4,3,3,4,3,3,3,3,4,4
```

**Dimension D2 — Communication Style** *(Guided label: "How the parts talk")*. Provide qaFit for the differentiating QAs; default any
unlisted QA to 3.

```
Synchronous (req/resp): perf 4, scal 2, avail 2, dataCons 5, maint 4, obs 4, ttm 5
Async messaging       : perf 3, scal 4, avail 4, dataCons 3, maint 3, obs 3, ttm 3
Event-driven (pub/sub): perf 3, scal 5, avail 5, dataCons 2, maint 3, obs 2, ttm 2
Streaming             : perf 5, scal 5, avail 4, dataCons 2, maint 2, obs 2, ttm 2
```

**Dimension D3 — Data Management** *(Guided label: "Where data lives")*. qaFit for differentiating QAs; default unlisted = 3.

```
Single shared DB      : dataCons 5, scal 2, maint 3, perf 4, cost 4, ttm 5, deploy 2
Database-per-service  : dataCons 2, scal 5, maint 4, deploy 5, cost 3, ttm 3
CQRS                  : scal 5, perf 5, dataCons 3, maint 3, ttm 2, cost 3
Event Sourcing        : dataCons 4, scal 4, maint 2, obs 5, ttm 2, cost 2
Polyglot persistence  : perf 4, scal 4, maint 3, cost 2, ttm 3, interop 4
```

**Dimension D4 — Code Structure** *(Guided label: "How each app is organized inside")*. Options: Layered, Hexagonal (Ports & Adapters),
Clean Architecture, Vertical Slice. These differ mainly on maintainability/testability/ttm.
**Use the ratified qaFit vectors in the [Model Data Sheet](../03-blueprint/model-data-sheet.md) Section 4**
(interim-ratified, [ADR-0001](../adr/0001-ratify-d4-d5-qafit.md)) — do not re-invent them. The encoded
rationale: simpler structures favor `ttm`; Hexagonal/Clean favor `maintainability`/`testability` at
some `ttm` cost; `domain` complexity is what makes the extra structure pay off.

**Dimension D5 — Frontend Architecture** *(Guided label: "How the screens are built"; optional, show only if relevant)*. Options:
Monolithic SPA, Server-side rendering (SSR/SSG), Micro-frontends. **Use the ratified qaFit vectors in
the [Model Data Sheet](../03-blueprint/model-data-sheet.md) Section 4** ([ADR-0001](../adr/0001-ratify-d4-d5-qafit.md)) —
do not re-invent them. Rationale: micro-frontends favor `deployability`/`scalability` for
large/distributed teams at a `maintainability`/`ttm` cost.

Allow unlisted qaFit entries to default to a neutral 3 so the config stays maintainable.

---

## 7. Educational metadata (every option in every dimension)

For each option provide (EN+ID): `definition` (2–3 sentences), `pros` (list), `cons` (list),
`whenToUse` (bullet conditions), `whenToAvoid` (bullets), `realWorldPattern` (one neutral,
generic line — do NOT assert specific named companies as fact), `commonMistakes` (list), and
`learnMore` (array of `{label, url}` to reputable public docs/articles). Be balanced — every
option has real downsides. This content is a primary reason a professional would trust the tool.

---

## 8. Analysis layer (what makes it professional — step 3)

Compute and display all of the following:

1. **QA priority chart** — bar/horizontal chart of the normalized QA weights (the utility tree).
2. **Per-dimension ranking** with composite scores normalized to 0–100 within the dimension.
3. **Radar chart** — for the top 2–3 options of D1 (and on demand any dimension), overlay their
   `qaFit` across all 12 QAs so trade-offs are visible at a glance (hand-built SVG radar).
4. **QA contribution breakdown** — for a selected option, a table: QA, weight%, fit(1–5),
   weighted points, sorted by contribution. Must reconcile to the composite score.
5. **Trade-off / comparison mode** — pick 2–3 options (across or within dimensions) and compare
   side-by-side across all QAs in a table + overlaid radar.
6. **Close-call detection** — if top two within 10% in any dimension, flag "no clear winner;
   weigh team judgment and context this tool can't capture," and show both.
7. **Sensitivity / robustness analysis** — for D1, determine which SINGLE factor change (±1
   level) would flip the #1 recommendation, and report it: e.g. "Recommendation is sensitive to
   `team`: lowering it to Small would make Modular Monolith win." If no single change flips it,
   label the result "robust."
8. **Risk register** — surface the `risks` of the currently chosen options as a table with
   `likelihood` (Low/Med/High), `impact` (Low/Med/High), and `mitigation`.
9. **Anti-pattern detection** — rule-based warnings on the chosen COMBINATION (section 10).
10. **Fitness functions** — generate suggested, measurable fitness functions tied to the
    top-weighted QAs, so the team can validate the architecture over time (evolutionary
    architecture). Section 11.
11. **Cost & operational-complexity indicators** — qualitative Low/Med/High badges per D1 option
    (operational overhead, infra cost profile), with a one-line caveat each.
12. **Migration path** — optional `currentArchitecture` selector; if set, suggest an incremental
    evolution path to the recommendation (e.g. Monolith → Modular Monolith → extract highest-
    churn bounded context → Microservice), referencing Strangler Fig where legacy is heavy.

---

## 9. Risks (data per option)

Give each option 2–4 `risks`, each `{ description (EN+ID), likelihood, impact, mitigation }`.
Examples to model after (write real ones for every option):
- Microservices: "Operational complexity outpaces team capability" (High/High → "Invest in
  platform/observability before splitting; start with a modular monolith").
- Event Sourcing: "Schema/event evolution and replay complexity" (Med/High → "Versioned events
  + upcasters; snapshotting").
- Serverless: "Vendor lock-in and cold-start latency" (Med/Med → "Abstract handlers; provisioned
  concurrency for latency-critical paths").

---

## 10. Anti-pattern rules (rule-based combination warnings — implement all)

Each rule: a boolean condition over factors + chosen options, a severity (info/warning/danger),
and a message (EN+ID).

- **danger** — Premature microservices: D1=Microservices AND `team<=0` AND `devops<=0`.
  "High operational burden without the org maturity to support it; likely a distributed monolith."
- **danger** — Distributed monolith: D1=Microservices AND D3=Single shared DB.
  "Services sharing one database cannot deploy or scale independently."
- **warning** — Synchronous coupling at scale: D1=Microservices AND D2=Synchronous AND `scale>=1`.
  "Synchronous service chains create cascading-failure risk; add async/circuit breakers/timeouts."
- **warning** — Over-engineering an MVP: `lifespan==0` AND `ttm==2` AND D1 ∈ {Microservices} OR
  D3 ∈ {CQRS, Event Sourcing}. "Bias to the simplest viable option for a short-lived MVP."
- **warning** — Consistency conflict: `consistency==2` AND (D2=Event-driven OR D3=Event Sourcing
  as the PRIMARY data store). "Eventual consistency conflicts with a strong-consistency need;
  isolate the strongly-consistent core."
- **warning** — Legacy without a plan: `legacy==2` AND D1 ∈ {Microservices, Serverless} AND no
  migration path chosen. "Adopt Strangler Fig incremental migration rather than big-bang rewrite."
- **info** — Strict security on shared-responsibility infra: `security==2` AND D1=Serverless AND
  `devops<=1`. "Clarify the cloud shared-responsibility model and compliance boundaries."

---

## 11. Fitness functions (generate from top QAs)

For each of the top ~4 weighted QAs, suggest one or two concrete, measurable fitness functions
(EN+ID). Examples to template from:
- scalability → "Load test sustains target N req/s at p99 latency < X ms under autoscaling."
- deployability → "Each unit deploys independently in < N min via CI; build fails on cyclic
  dependencies (enforce with an automated dependency/architecture test)."
- availability → "Chaos test: tolerate single-node/AZ loss within the error budget; SLO tracked."
- security → "SAST/DAST + secret scanning gate the pipeline; dependency CVE budget enforced."
- performance/realtime → "p99 latency continuously monitored; alert when it breaches X ms."
- maintainability → "Architecture/dependency tests prevent layering violations; track change
  failure rate and lead time (DORA)."
- dataConsistency → "Contract + concurrency tests; assert no lost updates under parallel writes."

---

## 12. Build phases (do in order; each leaves the app runnable)

- **Phase 1 — Core engine.** Scaffold; QAs(12); factors(14); factor→QA matrix; QA-weight
  derivation + normalization; D1 options + qaFit; composite scoring; ranked D1 results with
  bars; QA priority chart; defaults (all level 0 except ttm=1 and budget=2 — the no-signal level
  of the inverted budget factor); localStorage; permanent disclaimer. Useful already.
- **Phase 2 — Multi-dimensional.** D2, D3, D4 (and D5 conditionally); coherent per-dimension
  recommendations; combination view; anti-pattern detection (section 10).
- **Phase 3 — Professional analysis.** Radar chart; QA contribution breakdown; comparison mode;
  close-call; sensitivity/robustness; risk register; fitness functions; cost/ops indicators;
  "How it works" + methodology panel (ISO 25010:2023, ATAM, ADD, fitness functions) with
  citations/links.
- **Phase 4 — UX for everyone.** Guided wizard mode vs expert mode; scenario presets
  (startup MVP, regulated/enterprise, high-traffic e-commerce, IoT/streaming, internal tool);
  glossary; tooltips; EN/ID i18n + toggle; dark mode; factor grouping/collapsibles.
- **Phase 5 — Outputs & sharing.** ADR export in MADR format (Title, Status, Context & Problem
  Statement, Decision Drivers, Considered Options, Decision Outcome, Consequences good/bad,
  Links); full report export (Markdown + print stylesheet) including factor inputs, QA priorities,
  per-dimension recommendations, QA scorecard, trade-offs, risks, anti-pattern warnings, fitness
  functions, migration path, alternatives, references; C4-style diagram stub reflecting
  the chosen D1 style; share-via-URL; import/export a custom config JSON (extensibility).
- **Phase 6 — Polish & trust.** Migration paths; optional multi-stakeholder QA weighting (each
  stakeholder profile weights QAs; aggregate by average) ; accessibility pass; unit tests
  (scoring, normalization, sensitivity, URL round-trip, ADR generation); CI workflow;
  README + DECISIONS.md + EXTENDING.md.

---

## 13. Code organization

```
src/
  App.tsx
  context/ (AppStateContext, ThemeContext, LangContext)
  i18n/dict.ts
  config/qualityAttributes.ts     // 12 QAs (sec 3)
  config/factors.ts               // 14 factors (sec 4)
  config/factorQaMatrix.ts        // factor→QA influences (sec 5)
  config/dimensions.ts            // D1–D5 options, qaFit, metadata, risks (sec 6,7,9)
  config/antiPatterns.ts          // rules (sec 10)
  config/fitnessFunctions.ts      // QA→fitness templates (sec 11)
  config/presets.ts               // scenario presets
  config/migrationPaths.ts
  lib/scoring.ts                  // pure: deriveQaWeights, normalize, compositeScores, contributions
  lib/sensitivity.ts              // robustness/flip analysis
  lib/antiPatternEngine.ts
  lib/adr.ts                      // MADR markdown
  lib/report.ts                   // full report markdown
  lib/c4.ts                       // C4 stub (hand-built SVG)
  lib/urlState.ts                 // encode/decode (sec 2)
  lib/customConfig.ts             // import/export config JSON
  hooks/ (usePersistedState, useUrlSyncedState)
  components/ (Header, Disclaimer, ModeToggle, PresetBar, FactorGroup, FactorControl, Tooltip,
    QaWeightPanel, QaWeightChart, DimensionResults, ResultRow, RadarTradeoff, ContributionTable,
    ComparisonMode, SensitivityCard, RiskRegister, AntiPatternAlerts, FitnessFunctions,
    CostOpsBadges, MigrationPath, MethodologyPanel, Glossary, Toolbar, ReportPreview, C4Preview)
```

All math lives in pure, unit-tested functions in `lib/`. Keep every weight, qaFit value, rule,
and string in `config/` or `i18n/` — never hard-coded in components — so the model is auditable
and extensible.

---

## 14. Acceptance criteria (verify before finishing)

1. `npm install && npm run dev` runs clean; `npm run test` and `npm run build` pass; CI workflow present.
2. Changing any factor instantly updates QA weights, all dimension rankings, charts, and analyses.
3. Defaults (all 0 except ttm=1, budget=2) → D1 top = **Monolith**; QA weights show `timeToMarket` highest.
4. team=2, distribution=2, scale=2, devops=2, ttm=0 → D1 top = **Microservices**.
5. domain=2, team=0, ttm=0 → D1 top = **Modular Monolith**; D4 favors Hexagonal/Clean (both score 5.0).
6. async=2, realtime=2 → D2 favors **Event-driven/Streaming**; scalability & performance lead QA weights.
7. consistency=2 → `dataConsistency` dominates QA weights; D3 favors **Single shared DB**;
   choosing Event Sourcing triggers the consistency-conflict anti-pattern warning.
8. Selecting Microservices (D1) + Single shared DB (D3) triggers the **distributed monolith** danger.
9. team=0, devops=0 + Microservices triggers the **premature microservices** danger.
10. Contribution table for any option reconciles exactly to its composite score.
11. Sensitivity card names a flipping factor OR labels the result "robust," correctly.
12. Radar chart overlays top options across all 12 QAs; comparison mode compares 2–3 options.
13. Language toggle updates ALL strings (no untranslated keys); dark mode fully styled.
14. "Share link" round-trips to identical state; "Export ADR" downloads valid MADR markdown;
    "Export report" downloads a complete report; C4 stub renders; custom-config import/export round-trips.
15. Fully keyboard-operable; controls have accessible names; AA contrast in both themes.
16. Every QA, factor, option, rule, and fitness template is in config and documented in EXTENDING.md.

---

## 15. Deliverables

- `README.md` — what it does, how to run, the methodology it implements, and the honesty caveat
  that scores are tunable heuristics, not facts.
- `EXTENDING.md` — how to add/edit QAs, factors, the factor→QA matrix, dimensions/options/qaFit,
  anti-pattern rules, presets, and translations; how to import/export a custom config JSON.
- `DECISIONS.md` — any unspecified choices you made. (The D4/D5 qaFit values are **not** among them —
  they are ratified in the [Model Data Sheet](../03-blueprint/model-data-sheet.md) Section 4; use those.)
- Final chat summary — files created, run instructions, acceptance criteria verified.

Begin now. Build all phases in order; do not stop halfway.

---

## 16. Method references

The methods this specification operationalizes (full IEEE-style list: charter Section 13):

- ISO/IEC 25010:2023, *SQuaRE — Product quality model* — the 12-QA spine (section 3).
- R. Kazman, M. Klein, and P. Clements, "ATAM: Method for Architecture Evaluation," SEI, CMU/SEI-2000-TR-004, 2000 — utility tree & stakeholder prioritization (section 5).
- R. Wojcik et al., "Attribute-Driven Design (ADD), Version 2.0," SEI, CMU/SEI-2006-TR-023, 2006 — QA-driven option selection (section 6).
- N. Ford, R. Parsons, and P. Kua, *Building Evolutionary Architectures*, O'Reilly, 2017 — fitness functions (section 11).
- N. Forsgren, J. Humble, and G. Kim, *Accelerate*, IT Revolution, 2018 — the DORA metrics referenced in section 11.
- *MADR — Markdown Architectural Decision Records*, adr.github.io/madr — the ADR export format (Phase 5).
- The exact computation rules and frozen values: [Scoring Algorithm Specification](../03-blueprint/scoring-algorithm.md) · [Model Data Sheet](../03-blueprint/model-data-sheet.md).
