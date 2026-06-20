<!-- Thanks for contributing! Keep PRs focused. See CONTRIBUTING.md. -->

## What & why

<!-- What does this change and why? Link issues with "Closes #123". -->

## Type

- [ ] Bug fix
- [ ] Feature / enhancement
- [ ] Model change (qaFit / weights / influence / rules)
- [ ] Docs / tests / tooling

## Checklist

- [ ] `npm run lint` and `npm run build` pass
- [ ] `npm run test` passes (added/updated tests for the change)
- [ ] Model/doc/config changes keep the guards green:
      `node scripts/verify-model.mjs`, `cross-check-docs.mjs`, `check-app-config.mjs`
- [ ] If UI changed: checked Guided **and** Expert, EN **and** ID, dark **and** light, ~360px;
      and `npm run test:e2e` (or noted why not)
- [ ] No new production-dependency vulnerabilities (`npm run audit:prod`) and bundle within budget (`npm run size`)
- [ ] Updated `CHANGELOG.md` (Unreleased) and any affected docs

## Notes

<!-- Screenshots, a share link (#s=…), trade-offs, or follow-ups. -->
