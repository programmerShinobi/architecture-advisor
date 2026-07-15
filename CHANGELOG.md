# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/) (charter
[Section 15](docs/01-discovery-and-planning/discovery-and-planning.md#15-versioning-policy--evolution-roadmap)).
The decision **model** carries its own version, recorded in the
[ADR log](docs/adr/).

## [Unreleased]

### Changed (Full bilingualisation + light-theme polish — 2026-07-15)

- **Light theme softened** — the page background is now an off-white slate (`#e8ecf4`) instead of
  stark white, cards read as lighter/elevated, fills/tracks are deeper, and the info-violet was
  deepened (`#5733c6`) to keep every combination ≥ WCAG AA on the softer background (a11y gate 7/7).
- **Mode-aware Home** — the landing lede and the three "how it works" steps now have distinct
  **Guided** vs **Expert** copy (`.guided-only` / `.expert-only`), so selecting a reading mode
  changes the Home page too, not just the Advisor/Insights.
- **Insights content going fully bilingual (EN/ID)** — reversing the earlier *English-first content*
  decision so **every** Insights surface responds to the language toggle down to the deepest
  sub-level. Datasets are being converted from `string` to `Bilingual { en, id }` and rendered via
  `tr()`. **Done so far:** all six Insights datasets — **Lab** (`labExperiments.ts`), **Roadmap**
  (`insightRoadmaps.ts`), **Playbook** (`insightPlaybooks.ts`), **Review** (`insightReviews.ts`),
  **Library** (`insightLibrary.ts`, prose translated; pattern/term proper-nouns kept canonical), and
  **Academy** quizzes (`academyQuizzes.ts`) — with their renderers (`LabView`, `RoadmapView`,
  `LearnView`, `AcademyView`) reading through `tr()`.
- **All 18 Markdown articles are now bilingual** — each body carries the English text, a
  `<!-- lang:id -->` delimiter, then the Indonesian translation (`docBody(doc, lang)` splits per
  language; markdown structure, `:::guided`/`:::expert` fences, tables, and the decision-map code
  block preserved). `translation_status` is `id+en` and the content gate **requires** both languages
  plus the delimiter. SEO snapshots keep the English canonical (body above the delimiter).
- **Docs reconciled** — the *English-first content* decision is reversed to *fully bilingual* across
  DECISIONS.md, the SRS (v1.7 + FR-LEARN-2), the design spec, and the content-rollout plan.
- **Budget:** total-JS gzip budget raised 200→260 kB (the EN+ID content lives in the lazy Insights
  chunk; initial-load JS untouched at ~114 kB, NFR cap 300). Now ~114 initial / ~237 total / ~23 CSS.

### Added (Genuinely-mobile experience — 2026-07-14)

- **A real mobile UI for the whole app** (plan: [mobile-experience-plan.md](docs/03-blueprint/mobile-experience-plan.md),
  written *before* implementation) — not a shrunk desktop layout. On phones (≤640px):
  - **Fixed bottom tab bar** (`MobileChrome`) — **Home · Advisor · Insights · More** (thumb-zone
    navigation); the desktop top-nav hides.
  - **Settings sheet** (slides up from "More") with **Theme · Language · Reading mode** as
    first-class segmented controls — so all three product toggles are reachable on mobile (the header
    cluster is hidden there). `useTheme` is lifted to `App` and shared, so header + sheet never
    desync.
  - **Sticky bottom primary action** on the Advisor (`AdvisorMobileBar`) — a contextual
    **"Get your plan" → "Save & share"** button (the "primary button at the bottom" pattern) that
    scrolls the one-page flow forward via an `IntersectionObserver`. It's navigation sugar; the flow,
    steps, and model are unchanged.
  - Decluttered mobile header (brand + Guide); safe-area insets (`viewport-fit=cover`,
    `env(safe-area-inset-bottom)`); content padding clears the fixed bars.
  - Desktop (≥641px) is unchanged. Both themes verified. e2e updated for the mobile chrome; budget
    total JS 193.2/200 kB, CSS 22.9/25 kB.

### Added (Home landing page — 2026-07-13)

- **A proper Home landing page** (`LandingView` + `HeroRadar`), now the **default view**, mirroring
  the composition of the approved [`prototype-v2/preview-modern.html`](docs/03-blueprint/prototype-v2/preview-modern.html)
  — closing the gap between the prototype's *layout* and the app (the Aurora reskin had applied the
  prototype's *style* but kept the tool-first structure).
  - **Hero:** gradient headline, eyebrow badge, lede, primary/secondary CTAs, hero-meta stats, and
    the decorative 5-dimension **radar motif** with floating chips (static brand art, distinct from
    the Advisor's functional radar).
  - **Pattern Library bento:** four **real** architectures from the frozen model (Event-driven,
    Modular Monolith, Serverless, CQRS — names from `dimensions.ts`, blurbs bilingual in the dict),
    each **deep-linking into its Insights Catalog page**.
  - **How it works:** the three real Advisor steps.
  - Fully **bilingual** (EN/ID via the dict), **responsive** (radar-first on mobile, bento reflows),
    reveal-on-scroll (reduced-motion safe), and pointer-glow cards — all reusing the Aurora tokens.
  - Top nav is now **Home · Advisor · Insights** (Home default). A shared `#s=…` link still opens the
    Advisor directly. CTAs drive the Advisor; "All architectures" opens Insights.
  - Kept light: the landing uses `DIMENSIONS` + dict strings (no `readerContent` pulled into the
    initial bundle); initial JS+CSS 134.1 kB, total JS 191.9 kB — within budget. +3 unit tests
    (`LandingView.test.tsx`); e2e updated for the new default view. All gates green.

### Added (PWA resilience polish — 2026-07-13)

- **Stale-chunk auto-recovery.** A tab left open across a deploy could 404 on an old lazy chunk
  (GitHub Pages replaces the hashed files; the auto-updating SW drops the old precache). `main.tsx`
  now listens for Vite's `vite:preloadError` and reloads once to fetch the fresh chunks — time-boxed
  (10 s) so a genuinely missing chunk can never cause a reload loop. Closes review item **S1**.
- **Theme-aware `theme-color`.** The browser / installed-PWA chrome colour now tracks the theme
  (`#05060f` dark ↔ `#ffffff` light) instead of being dark-only — updated in `useTheme` alongside the
  `html.light` toggle. Closes review item **S2**.

### Fixed (Aurora Slate palette consistency — 2026-07-13)

- **Two data bars still rendered the pre-reskin green/purple.** `PrioritiesCard` (the "what matters
  most" weight bars) and `DimensionDetail` (the Expert per-attribute contribution bar) hardcoded the
  old radar hexes (`#1D9E75`/`#7F77DD`), which the ADR-009 token remap couldn't reach — so they
  clashed with the Aurora palette. Both now use the theme-aware `--color-text-*` tokens (accent for
  emphasis, muted for the rest), consistent in both themes. Colour-token-only change; no logic.

### Added (PWA — installable + offline — 2026-07-13)

- **The app is now an installable PWA that works offline**, via `vite-plugin-pwa` (Workbox
  `generateSW`, a build-time devDependency). `registerType: 'autoUpdate'` → a new deploy's service
  worker skip-waits and claims clients, so there's **no stale-version footgun** on GitHub Pages
  (`cleanupOutdatedCaches` drops old precaches).
  - **Manifest** (`manifest.webmanifest`): name/short_name, `start_url`/`scope` `./` (subpath-safe),
    `display: standalone`, Aurora `theme_color`/`background_color` `#05060f`, and 192 / 512 /
    maskable-512 icons — generated from a node-tree brand glyph on the Aurora gradient
    (`public/favicon.svg` + `public/icons/*`, rendered headlessly, no image-lib dependency).
    `index.html` gains the favicon, apple-touch-icon, and `theme-color`.
  - **Caching:** the app shell (JS/CSS/HTML/SVG + icons) is precached; **fonts are runtime-cached**
    (CacheFirst) so the install stays lean; the crawlable SEO snapshots under `insights/` are
    excluded (network-served). Verified in a production preview — SW **activated** at the
    `/architecture-advisor/` scope, manifest valid.
  - `devOptions.enabled: false` keeps the SW out of the dev server (local dev + Playwright e2e
    unaffected). Bundle budgets stay green (total JS 188.5/200 kB); registerSW is ~0.2 kB.
- **Test hardening:** the a11y/contrast e2e now emulates `prefers-reduced-motion` before scanning,
  so a theme-toggle's colour transition can't leave a half-toggled frame under axe (a race exposed
  on slower hardware; the settled contrast was already AA). All gates green: build, lint, 99 unit,
  **a11y both themes**, size, 14 e2e.

### Changed ("Aurora Slate" visual reskin — 2026-07-12)

- **A full visual reskin applied *in place*** (ADR-009) — the deep-navy + violet/cyan **"Aurora
  Slate"** look, from the approved [`prototype-v2/preview-modern.html`](docs/03-blueprint/prototype-v2/preview-modern.html).
  The blueprint's proposed vanilla/MPA rewrite was **rejected**: the scoring engine, the
  21-architecture model, the seven-section Insights area, and all **99 tests** are unchanged — only
  the look changed.
  - **Palette** applied by remapping the existing `--color-*` token *values* (dark `:root` +
    `html.light`), so every component and Tailwind utility inherited it with no hardcoded hex; the
    accent moved from blue to a violet tuned for **WCAG AA in both themes** (axe contrast gate
    green). New tokens: `--aa-accent{,-2,-3}`, `--aa-grad-accent`, `--font-display`, `--aa-ease`,
    theme-aware `--radar-1..5`.
  - **Space Grotesk** display face on headings (self-hosted via `@fontsource`, woff2 as separate
    assets — CSS budget stays green).
  - **Two signatures:** an **aurora background** (`AuroraBackground.tsx` — fixed, blurred, drifting;
    `aria-hidden`, transform-only, disabled under `prefers-reduced-motion`, frozen via
    `aurora-static` on ≤4-core devices) rendered ambient behind the frame so dense content stays
    readable; and the **existing comparison radar** restyled with the aurora accent family, kept
    theme-aware and categorical so up to five overlaid options remain distinct and legible.
  - **Restrained polish:** gradient brand chip + display-font wordmark, an active-tab pill, a faint
    pointer-following glow on Insights cards, and a subtle scroll-reveal on the landing cards — all
    fine-pointer / reduced-motion guarded, and never leaving content hidden. Title text is *not*
    gradient-filled (would fail AA on light).
  - Stack-specific blueprint items (vanilla rewrite, multi-file MPA + `ROOT` helper + anti-FOUC
    script, cross-document View Transitions, hand-rolled SW/manifest, `.card`/`.nav` rename) were
    **dropped** as inapplicable to the React SPA; PWA remains an optional follow-up. All gates green:
    build, lint, 99 unit, a11y/contrast both themes, size (total JS 188.4/200 kB), 14 e2e.

### Added (Insights Wave C: Roadmap · Academy · Lab + SEO — 2026-07-06)

- **All seven Insights sections are now live.** Wave C completes the area with three sections built
  **on top of** the four lenses — they curate and exercise the content, never duplicate it — and
  each carries the same **21-architecture holistic parity** as the lenses (unit-tested, so no
  mismatch is possible):
  - **Roadmap** — 8 guided learning paths (newcomer → practitioner → architect,
    `src/config/insightRoadmaps.ts`); every step deep-links into an existing architecture lens
    page, Markdown article, or the Advisor, and **every one of the 21 architectures appears in at
    least one path**. A unit test resolves every target and asserts the coverage (anti-drift).
  - **Academy** — 6 quiz modules / 32 questions (one module per dimension + methods,
    `src/config/academyQuizzes.ts`), scored **entirely client-side** (no accounts, no telemetry);
    each answer explains itself and links back to the page that teaches it, and **every one of the
    21 architectures is reviewed by at least one question** (links + coverage unit-tested).
  - **Lab** — 7 hypothesis-driven experiments (`src/config/labExperiments.ts`) spanning D1–D5; each
    prepares valid levels for **all 14 model factors** (unit-tested) and loads them into the
    Advisor via the same path presets use — the claim is tested on the **live engine**, not a
    canned result. Each experiment lists its **"architectures in play"** as deep-link chips, and
    **the union covers all 21** (unit-tested).
- **SEO / SSG-lite (FR-SEO-1).** Discoverability without changing the SPA architecture:
  `scripts/generate-seo.mjs` (dependency-free, runs after `vite build`) emits `sitemap.xml` and
  **static crawlable HTML snapshots** of all 18 articles (`dist/insights/<section>/<slug>/`,
  self-canonical, JSON-LD `TechArticle`, `hreflang` en/x-default, linking into the app);
  `public/robots.txt` plus canonical/Open-Graph/Twitter/JSON-LD (`WebApplication`) on the app
  shell; `<html lang>` fixed to `en` (English default). The script doubles as a **guard** — the
  build fails if the canonical/robots URLs drift from `SITE_URL`. Pure HTML: zero impact on the JS
  budgets (total JS 186.5 kB / 200 kB after Wave C).
- **Tests:** +12 (Vitest 87 → **99**): `src/config/waveC.test.ts` (9 — every Roadmap/Academy/Lab
  target resolves; quiz answers in range; Lab levels valid for all 14 factors; unique ids; and
  **three 21-architecture parity tests**, one per section) and 3 new LearnView cases (Roadmap path
  → article deep link; Academy quiz feedback + review link; Lab run calls the Advisor with the
  prepared levels).

### Changed (Insights holistic coverage + English-first — 2026-07-06)

- **Every one of the 21 architectures now appears in all four Insights sections** — Catalog,
  Playbook, Review, **and Library** — as four *distinct structured reading experiences*, forming the
  knowledge journey **discover → implement → evaluate → reference**:
  - **Playbook** pages are real step-by-step implementation guides: goal, prerequisites, numbered
    steps, best practices, pitfalls to avoid (`src/config/insightPlaybooks.ts`).
  - **Review** pages are structured objective evaluations: overview, pros/cons, performance,
    scalability, developer experience, suitable use cases, and a final verdict
    (`src/config/insightReviews.ts`).
  - **Library** pages are evergreen reference cards: definition, key concepts, related patterns,
    terminology (`src/config/insightLibrary.ts`) — alongside the existing Wave B trend articles,
    now listed as "Further reading".
  - A new per-page **lens navigation** (Catalog · Playbook · Review · Library chips) walks one
    architecture through all four lenses; it replaces the earlier one-way "Full explanation in the
    Catalog →" cross-link. The thin `readerAngles.ts` (two paragraphs per lens) is **removed**,
    superseded by the three datasets above; a unit test asserts **21×4 parity** with the frozen
    model so coverage can never go partial.
- **English consistency across the site.** The default language is now **English** (the ID toggle
  stays fully functional for UI chrome); all **18 Markdown articles** ship English bodies
  (`translation_status: en`, ID titles/summaries kept in frontmatter); the three lens datasets are
  English; and the content gate (`check-content.mjs`) now requires **at least the `en` version**
  instead of `id`. Section descriptions were rewritten to state each section's purpose
  (discover / implement / evaluate / reference).

### Changed (UI redesign — in progress on `redesign/ui-ux`)

- **Stage 1 — design tokens.** New `--aa-*` token layer (fluid spacing/type via `clamp()`, soft
  elevation, 44 px touch targets, global `:focus-visible` ring) + base classes (`aa-page/frame/
  surface/panel/card/wrap/touch`), mirrored into Tailwind utilities. Documented in design-spec §6.1;
  the "prototype-exact look" decision is superseded (*look only* — copy, features, and the model are
  unchanged; see DECISIONS.md). Canonical breakpoints: ≤640 / 641–1024 / ≥1025 px.

- **Stage 2 — Advisor restyle.** App shell moves to the fluid aa- classes (aa-page/frame/surface/
  panel); Header, nav, and StepTracker paddings tokenized; keyboard-only chrome (⌘K, ?, save status)
  marked `aa-hide-phone` for the phone tier; dimension cards get soft elevation + token padding.
- **Stage 3 — Insights restyle.** LearnView wrappers move to `.aa-panel` (fluid padding); card and
  landing-card paddings + headings tokenized (`--aa-card-pad`/`--aa-fs-xl/2xl` fluid type); the
  card hover shadow now uses the theme-aware `--aa-shadow-md` token instead of a hardcoded rgba.
- **Stage 4 — responsiveness, a11y & tests.** Phone tier (≤640 px): `aa-hide-phone` chrome hidden,
  tighter dividers, phone-friendly overlay padding; overflow safety (`img/svg max-width`, prose
  `pre` scrolls, long words wrap); 44 px touch targets extended to chips + mode toggle on coarse
  pointers. New `e2e/responsive.spec.ts` gates **no horizontal scroll at 360/768/1440 px** on the
  Advisor and an Insights article (E2E suite: 10 → **14**). Lighthouse mobile
  (production build, measured): **Performance 93 · Accessibility 100 · Best-practices 96 · SEO 100**, CLS 0.

### Fixed (redesign follow-up)

- **Phone tier: the save indicator now actually hides.** Its inline `display: flex` was defeating
  `.aa-hide-phone`'s `display: none` (inline styles beat classes; `!important` is banned) — caught
  by a **visual cross-engine pass on Firefox**, not by the assertions. Layout moved to the `.aa-wrap`
  class; `e2e/responsive.spec.ts` now asserts the indicator is hidden at 360 px so it can't regress.
- **Cross-engine E2E config** ([`pw-cross.config.ts`](pw-cross.config.ts), optional/local): re-runs
  the E2E suite on Firefox (Gecko) + Safari (WebKit, incl. iPhone emulation) for pre-release checks
  of the evergreen baseline. Verified 2026-07-05: Firefox 12/13 (1 = documented theme-transition artifact), **WebKit + Safari-iOS 26/26**; results + the quirk recorded in the test plan.

### Added

- **Insights Wave B — the Library section is live** with **5 trend articles**, each with real,
  current sources and honest `evidence_strength`: *GenAI & software architecture* (emerging —
  Copilot RCT, DORA 2024, Fowler/Böckeler memos), *green/carbon-efficient architecture* (moderate —
  **SCI, ISO/IEC 21031:2024**, Green Software Foundation, AWS sustainability pillar),
  *architectural technical debt* (strong — Cunningham 1992, Kruchten/Nord/Ozkaya IEEE SW 2012 +
  SEI book, Dagstuhl 16162), *the monolith→microservices decision map* (strong), and *Conway's Law
  & Team Topologies* (moderate — Conway 1968, mirroring-hypothesis study, Skelton & Pais). All pass
  `content:validate` (18 articles total). Article-only sections render **without** repeating the
  21-architecture grid (no redundancy; regression-tested), and section cards show article counts.
  Total-JS budget deliberately raised 160→200 kB (content is lazy; initial JS untouched at ~107 kB;
  NFR cap 300).
- **Browser-support guidance + unsupported-browser fallback.** Documented the recommended browsers
  (latest Chrome / Edge / Firefox / Safari, desktop & mobile; not IE) in the README and the
  deployment docs, pointing at the canonical [SRS §2.3](docs/02-requirement-analysis/software-requirements-specification.md#23-operating-environment).
  `index.html` now ships a `nomodule` script + `<noscript>` block that render a readable, bilingual
  "use a modern browser" message instead of a blank page — implementing `FR-EDGE-4` (previously a
  documented "Should" without an implementation). A subtle, always-visible footer ("Best viewed in
  the latest Chrome / Edge / Firefox / Safari") appears on both the Advisor and Insights tabs.

- **Insights content area (Wave A + pipeline)** — a new **Insights** tab (top nav: Advisor · Insights) with
  cited, dual-audience content about the architectures the tool evaluates. Ships **client-rendered and
  lazy-loaded** (SSG deferred by decision).
  - **Every architecture appears in all three sections — Catalog, Playbook, and Review.** All are
    **data-driven from the frozen model** — the full **21 options across D1–D5**, grouped by decision
    — so coverage can never be partial or drift from the engine. Each section is a different lens on
    the same architecture: **Catalog** = what it is / when it fits / what it costs; **Playbook** = how
    to adopt it; **Review** = what to check when evaluating it (`src/config/readerAngles.ts`). **No
    content is duplicated across lenses** — only the Catalog carries the explanation; Playbook/Review
    show their angle plus a "Full explanation in the Catalog →" cross-link. Each architecture cites
    **multiple trusted references** (standards, seminal books, and peer-reviewed journals/surveys —
    Newman, Kleppmann, Fowler, Richardson, plus IEEE/JSS/VLDB/CACM papers). No fabricated sources.
  - **Guided / Expert reading mode in Insights** — reuses the Advisor's mode (a single control in the
    header, no duplicate toggle); newcomers read the plain layers, experts additionally get the
    *Deeper* notes, mechanism, and cited journals. Markdown articles support `:::guided` / `:::expert`
    blocks. Engaging card UI (hover cue, icon chips, ref counts) for both audiences.
  - **Cross-cutting guides & methods (Markdown)** — Playbook adds 7 decision guides (writing good
    ADRs · Strangler-Fig migration · choosing communication / data / code-structure / frontend · when
    to use microservices); Review adds 6 methods (ATAM checklist · detecting a distributed monolith ·
    fitness functions · data-consistency review · serverless readiness · avoiding premature
    microservices). Each with several trusted sources, validated by the **content gate**
    (`npm run content:validate`, wired into CI) — schema, primary sources, review dates, and that
    **every `related_advisor` id resolves to the frozen model**.
  - Pipeline is **dependency-free** (hand-built safe Markdown renderer + frontmatter parser). Rollout
    plan + rationale: [content rollout plan](docs/03-blueprint/content-rollout-plan.md);
    see [DECISIONS.md](DECISIONS.md) for the SSG-deferred / no-router / dependency-free / data-driven-Catalog choices.
- **Detailed architecture explanations in the Manual/Guide** — the in-app Guide now includes a
  plain-language, evidence-grounded explanation of **every architecture the Advisor evaluates** (all
  five decisions, D1–D5) plus a bibliography, so the Guide is a genuine deep-dive rather than a
  summary. Each option gets *What / When it fits / What it costs / Deeper* — written for newcomers
  **and** experts, bilingual EN/ID, AA-clean in both themes. Grounded in recognised standards and the
  software-architecture literature (Bass · Newman · Kleppmann · Fowler · Richards & Ford · SEI ·
  peer-reviewed surveys) with real, linked citations — no fabricated sources. Canonical write-up:
  [`docs/03-blueprint/architecture-reader.md`](docs/03-blueprint/architecture-reader.md); in-app
  content in [`src/config/readerContent.ts`](src/config/readerContent.ts). The **Manual is now
  lazy-loaded** (a separate on-demand chunk), so this depth adds **nothing** to first-load JS (initial
  gzip actually dropped ~110kB → ~107kB); the bundle guard now budgets initial vs. total JS separately.

### Changed

- **Tooling majors, cluster 3: TypeScript 5→6** — landed via Dependabot PR #15 and verified together
  with the new ESLint 10 / typescript-eslint 8 stack (build, lint, tests all green). All deferred
  tooling majors are now complete.
- **Tooling majors, cluster 2: ESLint 8→10 (flat config) · typescript-eslint 7→8 ·
  eslint-plugin-react-hooks 4→7 · eslint-plugin-react-refresh 0.4→0.5.** `.eslintrc.cjs` is replaced
  by `eslint.config.js` (same rule intent: js/ts/react-hooks recommended + react-refresh, identical
  ignore scope); the legacy `@typescript-eslint/{parser,eslint-plugin}` pair is replaced by the
  `typescript-eslint` meta package. react-hooks v7's stricter rules surfaced two real legacy
  patterns — a ref written during render (App shortcuts) and a setState inside an effect
  (CommandPalette query reset) — both **fixed with sanctioned patterns**, not silenced. CI path
  filters updated. `npm audit` stays at 0.
- **Tooling majors, cluster 1: Vite 5→8 · @vitejs/plugin-react 4→6 · Vitest 2→4 · jsdom 25→29.**
  Zero source changes required (every config option in `vite.config.ts` is still valid); all 85
  unit tests, 14 E2E, and every guard pass unchanged. **The full `npm audit` (dev deps included) is
  now 0 vulnerabilities** — the long-tracked dev-only Vite/esbuild dev-server advisory is resolved
  (SECURITY.md + test-plan §8 updated). Bundle slightly smaller (initial ~107 kB / total ~148 kB
  gzip). Remaining clusters (ESLint 10 flat-config + typescript-eslint 8, then TypeScript 6) are
  tracked in the [maintenance backlog](docs/07-maintenance/README.md).
- **Node baseline → 24 (LTS).** The Node version is now pinned in `.nvmrc` (24.18.0) as the single
  source of truth: all four workflows (`ci`, `e2e`, `deploy`, `docs-integrity`) read it via
  `node-version-file` (previously hardcoded `20`), `package.json` gains `engines.node >=24`, and the
  README/deployment guide document the prerequisite. All gates verified green under Node 24. This is
  the groundwork for the deferred major tooling upgrades (Vite/Vitest/ESLint/TypeScript), whose next
  majors require a modern Node. Only the runner version changed in `docs-integrity.yml` — the guard
  steps themselves are untouched.
- **React 18 → 19** (with matching `@types`). No source changes (the app already uses `createRoot`);
  bundle grew ~115kB → ~129kB gzip, still within the CI budget.
- **CI:** GitHub Actions bumped to current majors (checkout v7, cache v5, upload-artifact v7,
  configure-pages v6, deploy-pages v5) — clears the Node-20 runner deprecation.
- **Dependabot** now groups only minor/patch updates; each major opens its own PR (so breaking
  bumps like Vite/Vitest/ESLint/Tailwind/TypeScript are reviewed one at a time).

### Fixed

- **WCAG AA color-contrast** across both themes — raised the tertiary-text tokens, the light-theme
  success green, and the de-emphasised opacities (off-state radar chips, dimmed ranking rows). The
  E2E a11y suite now gates **full** color-contrast in a real browser (no more `fixme`); the same
  tokens are mirrored in the UI prototype and the README previews.

### Known / tracked

- **UAT** — the execution kit is ready: script v0.3 aligned to the current app (new Insights tasks
  A5/B7, ≥1 phone-tier session per persona), a bilingual session form with **SUS-10** (the SRS
  NFR-USE-1 metric, mean ≥ 70), a summary/exit-criteria sheet, and a facilitator dry-run re-verified
  on the live build (all 11 task paths, 2026-07-05). Outstanding: **≥3 participants per persona**.

## [1.0.0] — 2026-06-20

First public release — **live at <https://programmershinobi.github.io/architecture-advisor/>**.

### Added

- Client-side decision-support app (Vite + React + TypeScript): the four-step flow — project
  factors → quality priorities → recommendation across 5 dimensions → export — with the trade-off
  radar, anti-pattern detection, sensitivity & migration paths, fitness functions, risk register,
  cost/ops indicators, methodology, a C4-style diagram stub, and a glossary.
- Guided / Expert modes, EN/ID i18n, and dark / light themes.
- Exports: ADR (MADR), full report, Print/PDF, CSV, JSON, a shareable URL, and scenario import.
- A transparent scoring engine — a TypeScript twin of the verified reference model
  ([`scripts/verify-model.mjs`](scripts/verify-model.mjs)); the model itself is documented in the
  [Blueprint](docs/03-blueprint/).
- Quality gates: 62 unit / component / a11y tests (Vitest), Playwright E2E (smoke, share deep-link,
  structural a11y, keyboard), three model-integrity guards, and CI gates for the bundle-size budget
  and a production-dependency audit. Deployed to GitHub Pages via GitHub Actions.
- Maintenance scaffolding: this changelog, a [security policy](SECURITY.md), Dependabot (npm +
  GitHub Actions, weekly), and issue / pull-request templates.

**Model:** interim baseline (ADR-0001) — the qaFit vectors, factor→QA influence matrix, presets,
and anti-pattern rules as documented in the
[Model Data Sheet](docs/03-blueprint/model-data-sheet.md).

[Unreleased]: https://github.com/programmerShinobi/architecture-advisor/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/programmerShinobi/architecture-advisor/releases/tag/v1.0.0
