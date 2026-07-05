# Phase 7 — Maintenance & Iteration

> 🔄 **Ongoing** (since the v1.0.0 launch). Phase 7 of 7. The app is
> [live](https://programmershinobi.github.io/architecture-advisor/); this phase keeps it correct,
> current, and secure, and evolves the decision model as standards change.

Monitoring, bug fixes, dependency upkeep, and new features driven by feedback — plus keeping the
**decision model** defensible over time.

## Release process

- **Versioning:** [SemVer](https://semver.org/) for the app (`package.json`); the scoring **model**
  has its own version in the [ADR log](../adr/) (charter
  [Section 15](../01-discovery-and-planning/discovery-and-planning.md#15-versioning-policy--evolution-roadmap)).
- **Changelog:** every notable change is recorded in [`CHANGELOG.md`](../../CHANGELOG.md)
  (Keep a Changelog). Tag releases `vX.Y.Z`.
- **Ship:** merge to `main` → `deploy.yml` re-runs tests + build and publishes to GitHub Pages.
  Backward compatibility: old share-URLs / exports must keep loading (charter 15.3) — covered by the
  share round-trip tests.

## Monitoring & quality gates

This is a **static, client-side** app with **no backend and no telemetry** (privacy by design), so
"monitoring" is the automated gate set plus GitHub-managed Pages uptime — not server dashboards:

- **CI on every PR/push:** `ci.yml` (app-config · **content-validate** · lint · test · build ·
  bundle-size budget · prod-dep audit), `e2e.yml` (Playwright), `docs-integrity.yml` (the three model
  guards). `content:validate` enforces the "Minimum Viable Article" gate and keeps every article's
  `related_advisor` bound to the frozen model.
- **Content review cadence & link liveness are deliberately non-blocking** (WARN / scheduled), so
  CI never turns red on its own months later with no code change (see
  [DECISIONS.md](../../DECISIONS.md)).
- **Deploy gate:** `deploy.yml` re-runs tests + build before publishing.
- **Dependencies:** [Dependabot](../../.github/dependabot.yml) opens weekly npm + Actions update
  PRs; `npm run audit:prod` fails CI on a high/critical production-dependency advisory.
- **Security:** see [`SECURITY.md`](../../SECURITY.md) for the policy and private reporting.

## Triage & contribution

- Issues use templates (bug / feature / **model review**); PRs use a checklist tied to the gates.
- The model is meant to be challenged — propose changes with evidence via the model-review template;
  changes must keep the guards green (adjust presets/levels, not targets — see
  [EXTENDING.md](../../EXTENDING.md)).

## Open backlog (tracked)

- **UAT execution** — the kit is **ready to run**: [script v0.3](../05-testing-qa/uat-script.md) aligned to the current app (incl. Insights tasks + a phone-tier session), bilingual [session form](../05-testing-qa/uat-session-form.md) with **SUS-10** (NFR-USE-1: mean ≥ 70), and a [summary sheet](../05-testing-qa/uat-summary.md); facilitator dry-run re-verified all 11 task paths on the live build (2026-07-05). Outstanding: schedule **≥3 participants per persona** and record the sessions.
- **Major dev-tooling upgrades — one cluster at a time.**
  - ✅ **Prerequisite (2026-07-05): Node baseline aligned to 24 (LTS)** — pinned in
    [`.nvmrc`](../../.nvmrc), read by every workflow via `node-version-file`, `engines.node >=24`.
  - ✅ **Cluster 1 (2026-07-05): Vite 5→8 · @vitejs/plugin-react 4→6 · Vitest 2→4 · jsdom 25→29** —
    zero source changes needed (config options all still valid); all gates green; **`npm audit` is
    now fully clean (0 vulnerabilities incl. dev)** — the old dev-only Vite/esbuild dev-server
    advisory is gone; bundle slightly smaller (initial ~107 kB).
  - ✅ **Cluster 2 (2026-07-05): ESLint 8→10 · typescript-eslint 7→8 (meta package) ·
    eslint-plugin-react-hooks 4→7 · eslint-plugin-react-refresh 0.4→0.5** — migrated to **flat
    config** (`.eslintrc.cjs` → `eslint.config.js`, same rule intent). react-hooks v7's stricter
    rules caught two legacy patterns (a ref written during render; a setState inside an effect) —
    both fixed properly rather than silenced.
  - ✅ **Cluster 3 (2026-07-05): TypeScript 5→6** — landed via Dependabot PR #15; verified together
    with the ESLint 10 / typescript-eslint 8 stack (build, lint, and all tests green).
  **All deferred tooling majors are now complete.** GitHub Actions are already current — the Node-20
  runner deprecation is resolved.
- **Content rollout — later waves (deferred).** Wave B (Library trend articles), Wave C (Roadmap,
  Academy, Lab), and the **SSG/SEO** layer (sitemap/robots/hreflang/JSON-LD) are each their own
  reviewed proposal once Wave A proves its value; link-liveness + review-cadence become scheduled,
  non-blocking jobs. See [content rollout plan](../03-blueprint/content-rollout-plan.md).
- **Annual model review** against the latest standards, recorded as ADRs (charter 15.5).

**References:** charter [Section 15](../01-discovery-and-planning/discovery-and-planning.md#15-versioning-policy--evolution-roadmap)
(versioning & roadmap), [Section 20](../01-discovery-and-planning/discovery-and-planning.md)
(sustainability), and the [Feature-Maturity Playbook](../guides/feature-maturity-playbook.md)
(`TECH-09` maintainability, `TECH-10` observability).

Contributions are welcome — see [`../../CONTRIBUTING.md`](../../CONTRIBUTING.md).
