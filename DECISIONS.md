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
- **English-first (2026-07) → fully bilingual (reversed 2026-07-15).** The **default language is
  English** (`aa.lang` defaults to `'en'`; the toggle stays fully functional). The earlier
  English-only decision for the Insights *content layer* is **reversed**: the language toggle now
  reaches **every** Insights surface down to the deepest sub-level. All six Insights datasets
  (`insightPlaybooks`, `insightReviews`, `insightLibrary`, `insightRoadmaps`, `academyQuizzes`,
  `labExperiments`) are `Bilingual { en, id }` rendered via `tr()`; all 18 Markdown articles carry
  both bodies (English above, Indonesian below a `<!-- lang:id -->` delimiter) and ship
  `translation_status: id+en`; the content gate now **requires** `id+en` + the delimiter. In the
  Library lens, translated prose (definition/concepts/glossary explanations) sits alongside
  **canonical proper nouns kept in English** (pattern names, glossary terms) — standard i18n, not a
  gap. Rationale (superseding the old one): the user asked for no EN/ID mismatch anywhere; the
  model's canonical vocabulary stays English *within* Indonesian prose, which reads as correct
  localisation rather than an unfinished mix. Indonesian copy is **interim** — a professional
  translator review is welcome (charter Section 14.2).

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
- **Wave C carries the same 21-architecture parity as the lenses (2026-07-06).** Coverage is not
  left to editorial luck: per-section unit tests assert that **every one of the 21 architectures**
  appears in ≥1 Roadmap path, is reviewed by ≥1 Academy question, and is "in play" (the
  experiment's `focus` deep-link chips) in ≥1 Lab experiment — so the Wave C sections can never
  mismatch the lenses' 21×4 coverage.
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
  `dist/insights/<section>/<slug>/` (self-canonical, JSON-LD `TechArticle`, English — the crawlable
  snapshot takes the English body above the `<!-- lang:id -->` delimiter), plus canonical/OG/JSON-LD
  on the app shell and `public/robots.txt`. It doubles as a **guard**: the build fails if the
  canonical or robots URLs drift from `SITE_URL` (`src/config/site.ts`). `hreflang` is `en` +
  `x-default` only — the app serves both languages from **one URL** via the client-side toggle (the
  bilingual bodies are not separate pages), so English stays the crawlable canonical. Full SSG of
  the app stays deferred.
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

## "Aurora Slate" visual reskin (2026-07)

- **A reskin *in place*, not a rewrite (ADR-009).** The "Aurora Slate" blueprint proposed replacing
  React with a vanilla/MPA stack (its "ADR-000"); that was **rejected**. The scoring engine, the
  21-architecture model, the seven-section Insights area, and all 99 tests are preserved — only the
  *look* changes. Visual source of truth: [`docs/03-blueprint/prototype-v2/preview-modern.html`](docs/03-blueprint/prototype-v2/preview-modern.html).
- **Palette via token *values*, not a parallel system.** The Aurora palette (deep-navy surfaces,
  violet/cyan/mint accent) is applied by **remapping the existing `--color-*` token values** in
  `:root` (dark) and `html.light`; because Tailwind and every component reference those vars, the
  whole app inherited the new look with no per-component churn and **no hardcoded hex**. The accent
  (`--color-text-info`) moved from blue to a violet tuned for **AA in both themes** (verified by the
  axe contrast gate). New tokens added: `--aa-accent{,-2,-3}`, `--aa-grad-accent`, `--font-display`,
  `--aa-ease`, and theme-aware `--radar-1..5`.
- **Display type:** Space Grotesk (self-hosted via `@fontsource`, headings only) alongside the
  existing Inter/JetBrains Mono. woff2 are separate assets — the CSS budget stays green.
- **Two signatures, everything else calm** (per the prototype's own discipline):
  1. **Aurora background** — a fixed, blurred, drifting glow (`AuroraBackground.tsx` + `.aa-aurora`)
     rendered *ambient* behind the app frame (the opaque content panels are untouched, so dense
     forms stay readable). Guards: `aria-hidden`, transform-only animation, disabled under
     `prefers-reduced-motion`, and an `aurora-static` freeze on ≤4-core devices.
  2. **Radar** — the app's existing hand-built comparison radar restyled with the aurora accent
     family. It stays a **theme-aware categorical** palette (vibrant on dark, deeper on light) so up
     to five overlaid options remain distinct and legible; it was *not* collapsed to a single accent
     (it's a comparison chart, not the prototype's single decorative shape).
- **Restrained polish:** gradient brand chip + display-font wordmark, an active-tab pill, a faint
  pointer-following glow on Insights cards (fine-pointer + reduced-motion guarded), and a subtle
  scroll-reveal on the Insights landing cards (instant under reduced-motion; never leaves content
  hidden). **The title text is *not* gradient-filled** — a light gradient would fail AA on the light
  theme, so the gradient lives on the decorative brand chip instead.
- **Blueprint items dropped as stack-specific** (they targeted a greenfield vanilla MPA, not this
  SPA): the vanilla rewrite, the multi-file `@layer`/`js/` split + `ROOT` depth helper + per-page
  anti-FOUC script, cross-document View Transitions, a hand-rolled service worker/manifest, and the
  `.card`/`.nav` class rename. PWA remains an optional future follow-up.
- **The prototype's *layout* now ships too — as a Home landing (2026-07-13, FR-SHELL-11).** The
  reskin first applied only the prototype's *style*; a follow-up added a real **Home landing view**
  (`LandingView` + `HeroRadar`) mirroring the prototype's composition (hero + Pattern Library +
  how-it-works). It is the **default** view (top nav Home · Advisor · Insights). Reconciliations vs
  the prototype (a marketing mockup): the Pattern Library features **real** model architectures
  (deep-linking into Insights), copy is **bilingual** via the dict, and the decorative hero radar is
  a *separate* static motif — **not** the Advisor's functional 12-attribute radar (M13 discipline:
  one radar visual system, two uses). The landing deliberately avoids importing `readerContent`
  (uses `DIMENSIONS` + dict strings) so the now-default view doesn't pull the content layer into the
  initial-JS budget. A shared `#s=…` link sets `aa.main=advisor` pre-render so it opens the Advisor.

## PWA — installable + offline (2026-07)

- **`vite-plugin-pwa` (Workbox `generateSW`), not a hand-rolled service worker.** The blueprint's SW
  targeted a static file list, which breaks against Vite's content-hashed filenames; the plugin
  generates the precache manifest from the real build output every time, so there is no stale
  hardcoded shell list. It is a **build-time devDependency** — the runtime cost is a ~0.2 kB
  `registerSW.js` + the generated `sw.js` (both outside the JS bundle budget, which stays green).
- **`registerType: 'autoUpdate'`** so a new deploy's SW skip-waits and claims clients — the
  GitHub-Pages caching footgun (users stranded on an old version) is avoided; `cleanupOutdatedCaches`
  drops superseded precaches.
- **Lean precache, runtime-cache the rest.** The app shell (JS/CSS/HTML/SVG + the PWA icons) is
  precached; **fonts (`.woff2`) are runtime-cached CacheFirst** on demand rather than precached (the
  app ships many script-subset font files — precaching all of them would bloat the install). The
  crawlable **SEO snapshots under `insights/` are excluded** from both precache and
  `navigateFallback` (they are network-served for crawlers; the SPA shell handles real navigations).
- **Subpath-safe:** `start_url`/`scope` are `./` and the SW registers under the
  `/architecture-advisor/` base — verified in a production preview (SW *activated*, manifest valid).
- **Dev/e2e untouched:** `devOptions.enabled: false` keeps the SW out of the dev server, so local
  dev and the Playwright suite never fight a cache.
- **Icons** are generated from a single node-tree brand glyph on the Aurora gradient (`public/favicon.svg`
  → 192/512/maskable PNGs), rendered headlessly — no image-processing dependency added.

## Fase 1 — "Aurora Glass" borderless evolution + identity (2026-07)

Documented **before** implementation per the project's docs-first rule; each point below is a
commitment the code must match (cross-checked by review, gates, and tests).

- **Component tree grouped by feature area, guards untouched.** `src/components/` (40 flat files)
  is reorganised into `chrome/ · landing/ · advisor/ · insights/ · overlays/` (see
  [design-specification §3](docs/03-blueprint/design-specification.md)). `src/config/`, `src/lib/`
  and every frozen artifact keep their exact paths — the frozen guard scripts reference
  `src/config/*` only, so the restructure cannot touch the model. Tests move *with* their
  components; no test was weakened.
- **Borderless design language ("Aurora Glass"), applied via tokens again — not a second reskin.**
  Three characteristics, mirroring the modern full-bleed idiom:
  1. **Full-bleed canvas** — the aurora background already spans the viewport; the app frame drops
     its hard outer border/box so content sits directly on the canvas.
  2. **Whitespace as the separator** — visible hairline dividers (`.f-div`, hard card borders)
     are replaced by spacing rhythm; cards keep elevation via translucent fills + shadow, not
     stroke. Implemented by retuning `--color-border-*` token *values* toward transparency and a
     spacing bump — not by per-component surgery.
  3. **Glassmorphism** — the top nav + mobile tab bar float as translucent, `backdrop-blur` glass
     panels over the canvas; overlays (palette, modals) share the same glass recipe. Guards:
     contrast stays AA (axe gate), `backdrop-filter` has an opaque fallback via `@supports`, and
     blur is dropped under `prefers-reduced-transparency`-like constraints (low-core devices reuse
     the existing `aurora-static` freeze).
- **Hero radar badges must never clip — and invite, not spec.** The floating chips on the Home
  hero (`landing/HeroRadar`) get layout room (no absolute overflow past the card edge at any
  breakpoint). Copy: after trying model-computed values ("Fit score · 68/100"), the owner chose
  **general, inviting copy** instead — each badge teases a real feature area (the Advisor's free
  instant analysis · the 21-architecture Insights library) to make visitors curious (bilingual,
  dict-driven). Complementary labels across the app share one **modern badge system** (`.aa-badge`
  glass pills + `.aa-kbd` key caps): the guided "New here?" banner, the header save indicator,
  landing eyebrow/tags, preset chips, and gradient step-number coins.
- **Logo: one brand glyph everywhere.** A new simple, unique SVG mark — a pentagon radar +
  decision-node motif on the Aurora gradient (the project's own iconography: 5 dimensions, one
  recommendation). Single source (`public/favicon.svg` + a `BrandMark` component), reused for
  header wordmark, favicon and regenerated PWA icons (192/512/maskable) via the existing headless
  render script — no image dependency added.
- **Copyright & identity.** A footer identity line — `© 2026 Faqih Pratama Muhti (programmerShinobi).
  All rights reserved.` — plus the same notice in `site.ts` config, the SEO snapshots, the README
  and the print report. **Scope note:** code stays MIT and docs CC BY 4.0 (unchanged LICENSE
  files); the copyright line asserts *identity/attribution* of the work, it does not re-license it.

## Fase 2 — richer scenarios & factor guidance, full-feature Guide, calm futuristic chrome (2026-07)

Documented **before** implementation (docs-first). The frozen model stays frozen — every point
below is content or presentation, never scoring.

- **Presets grow 5 → 10; the calibrated five stay bit-exact.** The five ADR-0002 presets are
  pinned by the frozen guards (`verify-model.mjs` fixtures + `cross-check-docs.mjs`, which assert
  exactly those five against the Model Data Sheet Section 6) and are NOT touched. Five new
  **helper scenarios** (B2B SaaS · consumer mobile backend · data/analytics platform · legacy
  modernization · real-time collaboration) live only in `src/config/presets.ts`, marked
  `calibrated: false` — they are conveniences that pre-fill the 14 factors, not part of the
  ratified model. `check-app-config.mjs` (not frozen) is extended: the calibrated five must still
  match `verify-model.mjs` exactly; helper presets are validated structurally (14 factors, levels
  0–2). A unit test pins each helper's top pick per dimension so any future drift fails the build.
- **Factors stay 14 — enriched, not extended.** Adding a scoring factor would change the frozen
  model (influence matrix, MDS, SRS cross-checks — all guard-pinned), so instead every factor
  gains bilingual **per-level real-world examples** (`examples`) shown as a hint under the
  selected level in the Advisor: more relevant guidance per question with zero model impact.
- **The Guide becomes a full-feature manual.** `ManualBook` gains a "what's in the app" feature
  map covering everything shipped since it was written: Home landing, Advisor guided/expert flow
  (presets, priorities/overrides, radar, sensitivity, A/B compare, anti-patterns, migration,
  risks, fitness functions, C4, exports, share links), Insights' seven lenses, command palette &
  shortcuts, EN/ID, themes, install/offline (PWA), and the copyright/identity line.
- **Calm gradients (owner feedback: "terlalu mencolok").** Gradient-filled text (`.lp-grad`
  "evidence", the eyebrow's "Always explains why", and any sibling accent text) switches to a
  **muted, theme-tuned** two-stop gradient — deeper/desaturated on light, softer pastel on dark —
  tuned separately per theme so neither glares.
- **Modern app bar: nav left, controls right.** The centered nav pill moves to the **top-left
  corner** as futuristic segmented badges; the header controls (save status, Guide, ⌘K, ?, mode,
  language, theme) dock to the **right** of the same bar with the brand mark; the title/tagline
  live on the Home hero + document title (the bar stays one row). The guided "New here?" strip
  becomes a slimmer, calmer inline hint.
- **Brand mark v5: monochrome compass.** Per owner direction the glyph becomes a minimal modern
  **compass** (ring + needle + hub) in a single color on a **transparent** background — black in
  the light theme (elegant), automatically light in dark contexts via `currentColor` (in-app) and
  an SVG-embedded `prefers-color-scheme` rule (favicon), so it is never invisible. PWA PNG icons
  keep a solid tile (maskable requirement): black compass on a soft white tile.

## Custom Architecture Wizard + honest Step-3 analysis stepper (Master Blueprint, 2026-07-18)

Two decisions taken with the owner (AskUserQuestion) while executing the "Master Blueprint" overhaul.
Both are chosen precisely to preserve the Zero-Mismatch invariant.

- **The Custom Wizard maps onto the FROZEN engine — one scoring model, not two.** The guided builder
  captures four universal variables (Primary System Goal · Domain/Industry · Hard Constraints
  [budget/team/timeline] · prioritized NFRs) but does **not** score them itself. A pure, unit-tested
  bridge (`src/lib/customWizard.ts` → `wizardToLevels`) derives the frozen model's 14 factor levels
  from the answers; the same `rank()` does the scoring. A **parallel 4-variable model was rejected**
  — it would duplicate decision logic, sit outside the frozen guards, and create two sources of truth
  to keep in sync (the exact long-term debt the blueprint forbids). The wizard **schema is typed,
  injectable config** (`src/config/customWizard.ts`): new options/questions inject there and the UI
  + mapping iterate it — no component edits (Blueprint Phase 1.1). Combine rule: ordered override
  from a **moderate baseline** (all factors = 1), Goal → Domain → NFRs → Constraints, so an explicit
  hard constraint always wins and a vague/empty wizard still yields a valid, balanced recommendation
  (Phase 3.2 resilience). Every nudge is validated against the model by a unit test.
- **The Step-3 "processing" state is HONEST — it never fakes latency.** The blueprint asked for a
  "Progressive Terminal Readout"; the engine computes in <1 ms, and this file already records that
  the prototype's *artificial* skeleton-on-recompute was omitted as misleading. Reconciliation
  (`AnalysisStepper.tsx`): on an **explicit analyze action** (applying a preset card or the wizard)
  it briefly surfaces the **real** pipeline stages the engine actually runs — *derive QA weights →
  score 21 options → check anti-patterns → rank dimensions* — as a developer-centric terminal
  readout, then reveals the result. It is **skippable**, and under `prefers-reduced-motion` it
  renders nothing (instant). **Live factor edits stay instant** (no stepper) — the reveal is reserved
  for the "run a scenario" gesture. So this *extends* the honesty stance (real stages, real values)
  rather than reversing it; a full theatrical delay was explicitly declined.
- **The Scenario Card Gallery supersedes the preset dropdown** (Blueprint Phase 1.3): searchable,
  tag-filterable cards with a **dominant, dashed, terminal-styled "Build custom system"** card.
  Preset tags (`src/config/presetTags.ts`) are **pure UI metadata** kept out of `presets.ts`, so the
  frozen preset-level guards are untouched. The wizard modal is **lazy-loaded**, keeping the initial
  Advisor bundle under budget.
