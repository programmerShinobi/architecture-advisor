# Contributing to Architecture Advisor

Thank you for your interest in building this tool. Contributions of all kinds are welcome:
code, documentation, translations (i18n), accessibility (a11y), and review of the
decision model itself.

> The app is **live** at <https://programmershinobi.github.io/architecture-advisor/> — v1.0 MVP is
> implemented. Valuable contributions include the app itself, the documentation, and the decision
> model described in [Build Spec v3](docs/specs/build-spec-v3.md).
>
> **Prerequisite:** Node **24** (LTS), pinned in [`.nvmrc`](.nvmrc) — CI reads the same file, so
> local and CI always match.

## Code of Conduct

By participating, you agree to uphold our [Code of Conduct](CODE_OF_CONDUCT.md).

## Ways to contribute

| Area | Label | Examples |
|------|-------|----------|
| First-time friendly | `good first issue` | Typos, small docs fixes, copy improvements |
| General help | `help wanted` | Features, bug fixes |
| Decision model | `model` | Factors, QA weights, fit values, anti-patterns |
| Internationalization | `i18n` | Translations (starting with ID/EN) |
| Accessibility | `a11y` | WCAG AA, keyboard, contrast |
| Documentation | `docs` | Guides, references, examples |

## Contribution flow

1. **Open an issue** first for anything non-trivial, so we can agree on the approach.
2. **Fork** the repository and create a branch from `main`.
3. Make your change. Keep every model value (factors, weights, fit vectors, rules, strings)
   in configuration — never hard-coded — so it stays auditable and testable.
4. If you touch the **decision model** (the [Model Data Sheet](docs/03-blueprint/model-data-sheet.md),
   the [Scoring Algorithm](docs/03-blueprint/scoring-algorithm.md), or the SRS preset targets), run
   both guards locally — `node scripts/verify-model.mjs` and `node scripts/cross-check-docs.mjs` —
   and log the change in an ADR (Charter Section 14.4). They also run in CI
   (`.github/workflows/docs-integrity.yml`).
5. Ensure quality gates pass: lint, tests, and build must be green in CI.
6. Open a **Pull Request** with a clear description and link to the related issue.
7. A maintainer reviews; at least one approval is required before merge.

Small changes (typos, translations) follow a light path. Larger changes need discussion first.

## Commit message convention

Commits use a typed, scoped format:

```
[type](scope): short imperative summary
```

- **type** — one of the tags in the table below.
- **scope** — the area touched (optional but encouraged), e.g. `docs`, `readme`, `charter`,
  `spec`, `prototype`, `config`, `api`, `db`, `auth`, `service`, `security`, `ci`.
- **summary** — concise, in the imperative mood ("add", not "added").

| Type | When to use |
|------|-------------|
| `[add]` | Add new files, assets, configs, classes, or dependencies |
| `[update]` | Update or improve existing functionality, logic, or content |
| `[delete]` | Remove code, files, or unused dependencies |
| `[feat]` | Introduce a new feature visible to the end user |
| `[fix]` | Fix a bug or incorrect behavior |
| `[hotfix]` | Urgent critical fix applied directly to production |
| `[refactor]` | Restructure code without changing external behavior |
| `[style]` | Code formatting, whitespace, or naming changes only |
| `[perf]` | Performance improvements |
| `[test]` | Add or update test cases |
| `[docs]` | Documentation changes only |
| `[chore]` | Build tooling, CI/CD pipeline, or dependency maintenance |
| `[revert]` | Revert a previous commit |

**Examples**

```
[docs](charter): translate discovery charter to English
[add](prototype): add interactive UI prototype and preview screenshot
[docs](contributing): add commit message convention
[chore](ci): add lint, test, and build workflow
[feat](scoring): add weighted composite score engine
[fix](url-state): sanitize state parsed from the URL hash
```

**Key distinctions**

| Type | Distinction |
|------|-------------|
| `[feat]` | A brand-new capability exposed to the end user |
| `[add]` | A supplementary addition (file, class, config) that supports a feature or fix |
| `[update]` | Modifies *existing* behavior, content, or logic |
| `[delete]` | Intentional removal of code, files, or dependencies |
| `[fix]` | Something was broken — now it is not |
| `[hotfix]` | Same intent as `[fix]`, but bypasses normal branching and goes directly to production |

## Changes to the decision model

Because this is a tool *about* documenting architecture decisions, it documents its own. Any
change to the model — factors, weights, fit values, or anti-pattern rules — **must**:

1. Include a rationale and references.
2. Be reviewed by a Domain Advisor (where available).
3. Be recorded as an **ADR** (Architecture Decision Record) in the repository.

## Recognition

Contributors are credited in release notes and the contributors list. Thank you for helping
the tool improve across versions.

---

For the full governance model — roles, decision-making, and onboarding — see Section 14 of the
[Discovery & Planning charter](docs/01-discovery-and-planning/discovery-and-planning.md#14-governance--contribution).
