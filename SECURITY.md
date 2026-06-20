# Security Policy

## Scope

Architecture Advisor is a **pure client-side** static web app — no backend, database, accounts,
secrets, payments, or AI/network calls. All state lives in the browser (`localStorage` + the URL
hash). The realistic attack surface is therefore:

- the third-party **dependencies** that ship in the bundle, and
- **client-side injection** (the app must never render untrusted input as HTML).

There is **no server to attack** and the app collects **no personal data** or telemetry.

## Supported versions

The latest release on the `main` branch (deployed to GitHub Pages) is supported. This is a v1.x
project; fixes land on `main` and redeploy automatically.

| Version | Supported |
|---------|-----------|
| 1.x (latest on `main`) | ✅ |
| < 1.0 (pre-release) | ❌ |

## Reporting a vulnerability

Please report privately via **[GitHub Security Advisories](https://github.com/programmerShinobi/architecture-advisor/security/advisories/new)**
(Security → Report a vulnerability). If that is unavailable, open a minimal issue **without**
exploit details and ask a maintainer for a private channel.

Please include: affected version/URL, steps to reproduce, impact, and any suggested fix. Expect an
acknowledgement within a few days; we aim to assess and, where warranted, patch and redeploy
promptly given the static hosting model.

## How we keep it secure

- **CI gate:** `npm run audit:prod` fails the build on a high/critical advisory in a *production*
  dependency. Production deps are intentionally minimal (React, fontsource, Tabler icons).
- **Dependabot:** weekly npm + GitHub Actions update PRs ([`.github/dependabot.yml`](.github/dependabot.yml)).
- **No `dangerouslySetInnerHTML` on user input:** the React app renders user/derived text through
  React (escaped); persisted/URL state is validated on read (corrupt snapshots are treated as
  empty) — see [DECISIONS.md](DECISIONS.md) and the [test plan](docs/05-testing-qa/test-plan.md)
  (Section 8).
- **Locked, reproducible builds:** `package-lock.json` is committed; CI uses `npm ci`.

> Note: the known `vite`/`esbuild` advisories are **dev-server only** and do not ship in the static
> bundle; they are excluded from the production audit and tracked for upstream updates via Dependabot.
