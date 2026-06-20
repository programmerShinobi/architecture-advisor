# Phase 6 — Deployment / Release

> ✅ **Live.** Phase 6 of 7. Deployed to **GitHub Pages** via the `deploy.yml` GitHub Actions
> pipeline (checkout → `npm ci` → `npm run test` → `npm run build` → upload → deploy).
>
> 🔗 **Live URL: <https://programmershinobi.github.io/architecture-advisor/>** — verified: HTTP 200,
> the SPA mounts, and assets resolve at the `/architecture-advisor/` base path.

Releasing to production through a **CI/CD pipeline**. For this project the target is free static
hosting on **GitHub Pages** with **GitHub Actions** — the guide below is the exact path followed.

## Deliverable (prepared)

➡️ **[Deployment Guide — GitHub Pages](deployment-github-pages.md)** — step-by-step free
hosting + CI/CD (public repo → unlimited Actions minutes + free Pages).

**Expected outputs**

- CI workflow (lint + test + build) and a Pages deploy workflow.
- A live public URL: `https://<username>.github.io/architecture-advisor/`.
- Reproducible builds; every release recorded in a changelog (see charter [Section 15.4](../01-discovery-and-planning/discovery-and-planning.md)).

**References**

- [Build Spec v3 Section 2](../specs/build-spec-v3.md#2-tech-stack-use-exactly-this) — the CI workflow requirement.

Contributions are welcome — see [`../../CONTRIBUTING.md`](../../CONTRIBUTING.md).
