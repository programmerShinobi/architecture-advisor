# Phase 6 — Deployment / Release

> 🚧 **Not started.** Phase 6 of 7. A complete deployment guide already exists.

Releasing to production through a **CI/CD pipeline**, ideally with a **staging** step before going
live. For this project the target is free static hosting on **GitHub Pages** with **GitHub Actions**.

**Expected outputs**

- CI workflow (lint + test + build) and a Pages deploy workflow.
- A live public URL: `https://<username>.github.io/architecture-advisor/`.
- Reproducible builds; every release recorded in a changelog (see charter [§15.4](../01-discovery-and-planning/discovery-and-planning.md)).

**References**

- ✅ [Deployment Guide — GitHub Pages](../guides/deployment-github-pages.md) — step-by-step free
  hosting + CI/CD, already written and ready to follow.
- [Build Spec v3 §2](../specs/build-spec-v3.md#2-tech-stack-use-exactly-this) — the CI workflow requirement.

Contributions are welcome — see [`../../CONTRIBUTING.md`](../../CONTRIBUTING.md).
