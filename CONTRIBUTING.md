# Contributing to Architecture Advisor

Thank you for your interest in building this tool. Contributions of all kinds are welcome:
code, documentation, translations (i18n), accessibility (a11y), and review of the
decision model itself.

> This project is in the **planning & specification** phase. Until the application is
> scaffolded, the most valuable contributions are to the documentation, the spec, and the
> decision model described in [Build Spec v3](docs/specs/build-spec-v3.md).

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
4. Ensure quality gates pass (once the app exists): lint, tests, and build must be green in CI.
5. Open a **Pull Request** with a clear description and link to the related issue.
6. A maintainer reviews; at least one approval is required before merge.

Small changes (typos, translations) follow a light path. Larger changes need discussion first.

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

For the full governance model — roles, decision-making, and onboarding — see §14 of the
[Discovery & Planning charter](docs/01-discovery-and-planning/discovery-and-planning.md#14-governance--contribution).
