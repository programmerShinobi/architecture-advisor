# DECISIONS

Choices made while building the application that were **not** fully pinned by the specs, plus a
few notable interpretations. The model values themselves are canonical — see the
[Model Data Sheet](docs/03-blueprint/model-data-sheet.md) and
[Scoring Algorithm Spec](docs/03-blueprint/scoring-algorithm.md); this file records the rest.

## Model

- **D4/D5 `qaFit` were not invented here.** The Build Spec left them "to assign & document," but
  they are already ratified in [Model Data Sheet Section 4](docs/03-blueprint/model-data-sheet.md)
  (interim, ADR-0001). `src/config/dimensions.ts` reproduces those exact vectors.
- **Cost & operational-complexity indicators** (`src/config/costOps.ts`) are **defensible expert
  defaults**, not values from the Model Data Sheet (the prototype shows none). Chosen profile per
  D1 option: Layered/Monolith/Modular-Monolith = ops *low* / infra *low*; Microservices = *high* /
  *high*; Serverless = *med* / *med* (scales to zero but variable + lock-in). Editable like any
  config; an independent reviewer may revise.
- **Display normalization** is `round(composite / 5 × 100)` (Scoring Algorithm Section 7), **not** min-max
  — min-max would always show the worst option as 0 and exaggerate small gaps.
- **`migrationPathChosen` is kept `false`** in the anti-pattern engine so the `legacy-without-plan`
  rule still fires; the migration card is informational guidance, not a model input.

## Scores & presets vs the prototype

- **(Superseded for *look*, 2026-07 — see "Responsive UI redesign" below.)** The UI originally
  matched [the prototype](docs/03-blueprint/prototype/index.html) **exactly** in look, copy,
  and features, with two deliberate exceptions (the prototype's are illustrative):
  - **Scores are computed live** from the engine, not the mockup's fixed numbers (e.g. 84%).
  - **All 5 presets** are shipped (the mockup chip bar showed 4; `internal-tool` was absent).

## UI / tech

- **Icons:** `@tabler/icons-react` (tree-shaken) instead of the prototype's full icon **webfont** —
  identical glyphs at a few KB vs a 457 KB font + 249 KB CSS, protecting the FCP budget (ADR-008).
- **All visuals are hand-built SVG/CSS** (radar, priority/score bars, **and the C4 diagram stub**);
  **`recharts` and `mermaid` were both removed**. recharts duplicated the prototype's custom radar;
  mermaid failed to render the C4 stub reliably and was a heavy lazy dependency. Hand-built SVG is
  deterministic, theme-aware, always renders, and keeps the bundle small.
- **Dark by default** (matches the prototype); light is opt-in via the `html.light` class.
- **Guided/Expert reconciliation:** the prototype has no separate analysis section, but the Build
  Spec mandates a risk register, fitness functions, cost/ops indicators, a C4 stub, methodology
  references, and a glossary. Guided mode renders **exactly** the prototype's flow; those extra
  panels are surfaced in an **expert-only** section so nothing mandated is lost.
- **Primary factors:** the 3 shown by default (`team`, `scale`, `consistency`) mirror the
  prototype's three visible questions; the other 11 sit behind "Show the other N factors".
- **Custom-config import/export** is implemented as **scenario** JSON (factors + selections +
  overrides + mode + language), the basic version per the charter; richer org-level model-config
  editing remains the deferred v2.x item.
- **Omitted prototype theater:** the mockup's artificial skeleton-on-recompute and empty state are
  not reproduced — the live engine always has a result, so an empty state would mislead.

## Content & i18n

- **Authored copy:** guided factor questions, plain QA labels, the per-dimension "good / cost /
  know" narrative, per-option blurbs, migration steps, and short radar labels were ported from the
  prototype (English) and **translated to Indonesian** to match. The 3 factor questions and 4 QA
  labels shown in the prototype are verbatim; the rest follow the same register. Indonesian copy is
  **interim** — a professional translator review is welcome (charter Section 14.2).
- **Canonical bilingual content** (factor labels/levels/help, option names, anti-pattern messages,
  fitness templates, risks) is reproduced verbatim from the Model Data Sheet and Option Content
  Sheet — see [EXTENDING.md](EXTENDING.md) for where each lives.
- **English-first (2026-07).** The **default language is English** (`aa.lang` defaults to `'en'`;
  the ID toggle stays fully functional for UI chrome) and the **Insights content layer is
  English-only**: all 18 Markdown articles ship `translation_status: en` (ID titles/summaries stay
  in frontmatter for the toggle-happy reader), the three lens datasets are plain English strings,
  and the content gate now requires **at least the `en` version**. Rationale: one consistent
  reading experience — mixing English UI copy with Indonesian article bodies read as unfinished,
  and the model's canonical vocabulary (pattern names, QA terms) is English anyway.

## Content & features rollout (the "Insights" layer)

Adapting the generic content-rollout plan to this repo (full rationale in
[content rollout plan](docs/03-blueprint/content-rollout-plan.md),
Appendix A). Direction chosen with the maintainer: **client-rendered first, Wave A + pipeline only.**

- **SSG / `react-router` deferred — not adopted now.** The app is a hash-state SPA on GitHub Pages
  (no custom domain → limited SEO upside). SSG (`vite-react-ssg`) + a path router would risk
  hydration clashes with the Advisor's `#s=` share-state and threaten the tight 120 kB initial-JS
  budget. Content is delivered as a **lazy-loaded client-rendered island** (`LearnView`); the
  Advisor is untouched and remains the default view. SSG becomes its own proposal *if* search
  discoverability is ever an explicit goal.
- **No Mermaid / react-markdown / micromark stack.** Consistent with the existing "hand-built, no
  heavy deps" decision above (Mermaid was already removed), the content pipeline is **dependency-free**:
  a small safe Markdown-subset renderer (`src/lib/markdown.tsx`, React elements only — no
  `dangerouslySetInnerHTML`, so raw HTML can't inject markup: the safety `rehype-sanitize` would
  give, at ~0 KB) and a hand-written frontmatter parser (`src/lib/frontmatter.ts`) instead of
  `gray-matter` + `js-yaml`. The whole Insights view (component `LearnView`) stays a small lazy chunk.
- **No `zod`.** Frontmatter is validated by a **dependency-free guard** (`scripts/check-content.mjs`)
  in the same style as the existing model guards (independent recompute + cross-check), rather than
  adding a runtime schema library. The guard asserts every `related_advisor` id resolves to a
  **canonical id in the frozen model** (`src/config/dimensions.ts`) — the anti-drift contract that
  binds content to the engine.
- **Navigation stays light:** a two-item top nav (Advisor · Insights) and in-view section/article
  state — **no** hash/path routes for sections (the Advisor keeps sole ownership of the URL hash).
- **`site.ts` centralizes `SITE_URL`/base** so future canonical/sitemap work never hardcodes the
  domain (custom-domain safe).
- **Review cadence + link liveness are non-blocking** by design (WARN / scheduled), never on the
  build path, so CI cannot turn red months later with no code change.
- **All four sections are data-driven, not hand-authored per architecture** (holistic coverage,
  2026-07). Each of Catalog, Playbook, Review, **and Library** renders every architecture (all 21
  D1–D5 options) from the model — `readerContent.ts` for the Catalog explanation, plus three
  structured English datasets `insightPlaybooks.ts` (goal/prerequisites/steps/practices/pitfalls),
  `insightReviews.ts` (overview/pros/cons/performance/scalability/DX/use-cases/verdict), and
  `insightLibrary.ts` (definition/concepts/patterns/terminology), keyed `${dim}:${optionId}` — so
  **coverage can never be partial or drift** (a unit test asserts 21×4 parity). These datasets
  **replace the earlier `readerAngles.ts`** (two thin paragraphs per lens), which could not carry
  the distinct section purposes. Hand-authored Markdown remains reserved for *cross-cutting* guides
  & methods; each architecture cites **multiple** real references (books + peer-reviewed sources).
- **No content is duplicated across lenses — the lens nav replaces the cross-link.** Each lens has
  its own fields (nothing is repeated verbatim), and every architecture page carries a **LensNav**
  (Catalog · Playbook · Review · Library chips) so the reader walks the **knowledge journey**
  discover → implement → evaluate → reference on one page, instead of the earlier one-way
  "Full explanation in the Catalog →" link.
- **Wave C sections curate and exercise — they never duplicate (2026-07-06).** Roadmap, Academy,
  and Lab are built **on top of** the lens content: a Roadmap step, a quiz's "review the topic"
  link, and a Lab run all **deep-link into pages/state that already exist** (an architecture lens
  page, a Markdown article, or the Advisor). Their datasets (`insightRoadmaps.ts`,
  `academyQuizzes.ts`, `labExperiments.ts`) are unit-tested so every target resolves against the
  frozen model / content index — the same anti-drift discipline as the lenses.
- **The Lab runs the real engine, not a simulation.** An experiment is a hypothesis plus prepared
  levels for **all 14 model factors** (validated by a unit test); "run it" loads those levels into
  the Advisor via the same `setLevels` path presets use. No second engine, no canned outcomes —
  if the model changes, the Lab's claims are tested against it, not against a snapshot.
- **Academy is client-side only.** Quizzes are scored in the component; no accounts, persistence,
  or telemetry (per the standing no-backend constraint). A wrong answer teaches: explanation +
  deep link, not a grade book.
- **SEO is SSG-lite, not SSG (2026-07-06).** The app remains a client-rendered SPA (no router —
  the Advisor keeps sole ownership of the URL hash; no hydration risk; budgets untouched). A
  build-time script (`scripts/generate-seo.mjs`, dependency-free like the guards) emits
  `sitemap.xml` and **static crawlable HTML snapshots** of every article under
  `dist/insights/<section>/<slug>/` (self-canonical, JSON-LD `TechArticle`, English), plus
  canonical/OG/JSON-LD on the app shell and `public/robots.txt`. It doubles as a **guard**: the
  build fails if the canonical or robots URLs drift from `SITE_URL` (`src/config/site.ts`).
  `hreflang` is `en` + `x-default` only — the content layer is English-first and UI-chrome
  bilingualism is client-side state, not separate URLs. Full SSG of the app stays deferred.
- **The reading-mode toggle lives in one place** (the header's Guided/Expert); the Insights area shows
  a one-line hint, not a second toggle — removing an earlier redundant control.
- **Guided / Expert in Insights reuses the Advisor's `mode`** and the existing `.guided-only` /
  `.expert-only` CSS — no separate state to keep in sync. Markdown articles get the same behaviour via
  a tiny `:::guided` / `:::expert` block directive in the safe renderer.
- **The bundle-size guard reads the real initial set from `dist/index.html`** (entry script +
  modulepreloads) instead of guessing by filename. When `readerContent` became a chunk shared by two
  lazy views, the old name-prefix heuristic mis-counted it as initial; reading index.html is correct
  and future-proof (any new lazy or shared async chunk is excluded automatically).

## Responsive UI redesign (2026-07)

- **Supersedes the "matches the prototype exactly in look" rule above** — *look only*: copy,
  features, the scoring model, and all business logic are unchanged (guards + tests still enforce
  copy/model fidelity). Rationale: the prototype was desktop-only (fixed 1180 px shell, no media
  queries); the live audience includes phones/tablets, and the charter's audience is newcomers, so
  the UI moves to a modern, responsive, card-based look.
- **Token-first rule for the view layer:** new/edited view code must not hardcode sizes/colors —
  sizes come from the `--aa-*` tokens (design-spec §6.1), colors from the existing `--color-*`
  tokens. New classes are namespaced **`aa-`**; **no `!important`**. Legacy inline styles are
  migrated opportunistically as components are touched (hybrid strategy agreed with the maintainer),
  not big-banged.
- **Breakpoints** are canonical values documented in design-spec §6.1 (≤640 / 641–1024 / ≥1025) —
  CSS `@media` cannot read custom properties, so they are kept in sync by documentation + review.
