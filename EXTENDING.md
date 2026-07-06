# EXTENDING

Every quality attribute, factor, weight, option, `qaFit` value, rule, preset, fitness template,
and string lives in **`src/config/`** or **`src/i18n/`** — never hard-coded in components. The
scoring math is pure and lives in `src/lib/scoring.ts`. So the model is auditable and extensible:
edit data, not UI.

> **Canonical source.** The numeric model is frozen in
> [`docs/03-blueprint/model-data-sheet.md`](docs/03-blueprint/model-data-sheet.md) and the
> computation in [`scoring-algorithm.md`](docs/03-blueprint/scoring-algorithm.md). The bilingual
> educational copy is in [`option-content-sheet.md`](docs/03-blueprint/option-content-sheet.md).
> When you change a model value in code, change it in the Model Data Sheet too and re-run the
> guards (below) so the docs and the app never drift.

## Where things live

| You want to change… | Edit | Notes |
|---|---|---|
| Quality attributes (the 12 QAs) | `src/config/qualityAttributes.ts` | Keep `QA_ORDER` and the `qaFit` vector order in sync |
| Project factors (the 14) | `src/config/factors.ts` | `label`/`levels`/`help` are canonical; `question`/`gloss`/`primary` are guided-mode UI copy |
| Factor → QA influence matrix | `src/config/factorQaMatrix.ts` | `budget` is inverted in the engine — don't add a sign here |
| Dimension options + `qaFit` | `src/config/dimensions.ts` | Vectors in `QA_ORDER`; option order = tie-break order |
| Default factor levels | `src/config/defaults.ts` | All 0 except `ttm:1`, `budget:2` |
| Scenario presets | `src/config/presets.ts` | Full 14-level sets; must hit the SRS Section 5.3 targets |
| Anti-pattern rules | `src/config/antiPatterns.ts` | Pure predicate over factors + selected options |
| Fitness-function templates | `src/config/fitnessFunctions.ts` | One per QA |
| Risk register data | `src/config/risks.ts` | Keyed `"<dim>:<optId>"`; ported from the Option Content Sheet |
| Cost/ops indicators | `src/config/costOps.ts` | Per D1 option (defensible defaults — see DECISIONS.md) |
| Detail narrative + option blurbs | `src/config/dimensionContent.ts` | "good / cost / know" + per-option one-liners |
| Migration paths | `src/config/migrationPaths.ts` | fresh / big / mix step lists |
| Glossary terms | `src/config/glossary.ts` | Method terms (QAs come from `qualityAttributes.ts`) |
| Methodology references | `src/config/references.ts` | Surfaced in the "How it works" panel |
| UI chrome strings | `src/i18n/dict.ts` | `{ en, id }`; add a key, use `t('key')` |

## Adding a translation

All copy is `{ en, id }`. To add a third language: widen the `Lang` type in `src/types.ts`, add the
language to every `Bilingual` value (config + `dict.ts`), and add a toggle option in the header.
A `t(key)` / `tr(bilingual)` helper from `useI18n()` resolves the active language.

## Import / export a setup

The toolbar (and command palette) export the current setup as JSON (`scenario` = factors +
selections + overrides + mode + language) and re-import it; the full state is also encoded in the
share-URL hash. See `src/lib/scenarioIO.ts` and `src/lib/urlState.ts`.

## Adding a content article (the "Insights" layer)

Articles are Markdown files under **`content/<section>/<slug>.md`** (git-as-CMS; PR-reviewed). They
are the teaching layer around the Advisor — plain-language for newcomers, deeper for experts — and
every article is **bound to the frozen model**.

1. Create `content/<section>/<slug>.md` (`<section>` ∈ catalog · playbook · review · library; more
   sections are defined in `src/config/sections.ts` but gated `available: false` until built).
2. Fill the **frontmatter** — the contract is `src/config/contentSchema.ts`:
   `title_id/_en`, `slug` (must equal the filename), `section`, `audience` (`awam`/`expert`),
   `summary_tldr_id/_en`, `evidence_strength` (`strong`/`moderate`/`emerging`), `last_reviewed`
   and `review_due = last_reviewed + 12 months`, `translation_status` (must include `en` —
   English-first content, decision 2026-07),
   `related_advisor` ({dimensions, options} — **every id must exist in `src/config/dimensions.ts`**),
   `sources` (≥1 with a well-formed URL/DOI), `status`, `author`.
3. Write the body: TL;DR → explanation → deep dive → "Try in the Advisor" → the credibility block
   renders sources + evidence badge + review date automatically. Diagrams: **hand-built SVG or
   static images only — no Mermaid** (see DECISIONS.md).
4. Validate: `npm run content:validate` (the "Minimum Viable Article" gate — schema, primary
   source, review dates, unique slug, and the `related_advisor` ↔ model check). It runs in CI.

**Guided / Expert layers.** Wrap depth in `:::expert` … `:::` (and plain intros in `:::guided` …
`:::`) — the safe renderer maps these to the app's `.expert-only` / `.guided-only` classes, so the
Insights header's Guided/Expert toggle tailors the reading for newcomers vs experts.

**The per-architecture pages are data-driven, not Markdown.** All four sections render an entry
for **every** architecture the Advisor evaluates (all 21 D1–D5 options) from four datasets keyed by
the frozen model:

- **Catalog** — `src/config/readerContent.ts` (what it is / when it fits / what it costs / deeper,
  plus `READER_CITATIONS`).
- **Playbook** — `src/config/insightPlaybooks.ts` (goal, prerequisites, steps, best practices,
  pitfalls).
- **Review** — `src/config/insightReviews.ts` (overview, pros/cons, performance, scalability,
  developer experience, use cases, verdict).
- **Library** — `src/config/insightLibrary.ts` (definition, key concepts, related patterns,
  terminology).

To extend an architecture's coverage, edit its `'D<n>:<optionId>'` entry in the matching dataset —
do **not** add a per-architecture Markdown file. A unit test (`LearnView.test.tsx`) asserts 21×4
parity, so a missing entry fails the build. Hand-authored Markdown is for **cross-cutting** guides,
methods, and Library further-reading articles.

Article bodies are **English** (the site's default language; ID titles/TL;DRs stay in frontmatter
for the language toggle); content never re-copies model data — reference `src/config` so it can't
drift from the engine. Link liveness (`links:check`) and review cadence (`content:review`) are
separate **non-blocking** checks, not build gates (deferred to a later wave).

## Extending Roadmap / Academy / Lab (Wave C)

These sections **curate and exercise** the content above — they never carry their own explanations:

- **Add a learning path** — append to `LEARNING_PATHS` in `src/config/insightRoadmaps.ts`. Steps
  are `{ kind: 'arch', dim, optionId, lens }`, `{ kind: 'article', slug }`, or `{ kind: 'advisor' }`;
  every target must already exist (`src/config/waveC.test.ts` resolves them all, so a typo fails
  the build).
- **Add a quiz module/question** — edit `ACADEMY_QUIZZES` in `src/config/academyQuizzes.ts`.
  `answer` is an index into `choices`; give every question an `explain` and a `review` deep link to
  the page that teaches it (both unit-tested). Scoring stays client-side — no persistence.
- **Add a Lab experiment** — append to `LAB_EXPERIMENTS` in `src/config/labExperiments.ts`. Set
  **all 14 factors** in `levels` (values 0–2, validated against `FACTORS` by the unit test), state
  the hypothesis, what to watch, and the takeaway. "Run it" loads the levels into the live Advisor.

## SEO snapshots & sitemap

`npm run build` ends with `scripts/generate-seo.mjs`, which writes `dist/sitemap.xml` and a static
HTML snapshot per article (`dist/insights/<section>/<slug>/`) — new articles are picked up
automatically. If the deployed origin ever changes, update `SITE_URL` in `src/config/site.ts` **and**
the canonical tag in `index.html` **and** `public/robots.txt` — the script fails the build until all
three agree.

## Guards — run after any model change

```bash
node scripts/verify-model.mjs      # the math + fixtures + all 25 preset targets hold
node scripts/cross-check-docs.mjs  # the docs agree with each other and the prototype
npm run test                       # the engine's TypeScript twin (fixtures A–C, overrides, presets)
npm run lint && npm run build      # types + lint + production build
```

If a model change breaks a preset target, **adjust the preset levels — not the targets** — and
re-run, per the Model Data Sheet Section 6.
