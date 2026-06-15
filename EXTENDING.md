# EXTENDING

Every quality attribute, factor, weight, option, `qaFit` value, rule, preset, fitness template,
and string lives in **`src/config/`** or **`src/i18n/`** — never hard-coded in components. The
scoring math is pure and lives in `src/lib/scoring.ts`. So the model is auditable and extensible:
edit data, not UI.

> **Canonical source.** The numeric model is frozen in
> [`docs/03-blueprint/model-data-sheet.md`](docs/03-blueprint/model-data-sheet.md) and the
> computation in [`scoring-algorithm.md`](docs/03-blueprint/scoring-algorithm.md). The bilingual
> educational copy is in [`option-content-sheet.md`](docs/03-blueprint/option-content-sheet.md).
> When you change a model value in code, change it in the Model Data Sheet too and re-run the
> guards (below) so the docs and the app never drift.

## Where things live

| You want to change… | Edit | Notes |
|---|---|---|
| Quality attributes (the 12 QAs) | `src/config/qualityAttributes.ts` | Keep `QA_ORDER` and the `qaFit` vector order in sync |
| Project factors (the 14) | `src/config/factors.ts` | `label`/`levels`/`help` are canonical; `question`/`gloss`/`primary` are guided-mode UI copy |
| Factor → QA influence matrix | `src/config/factorQaMatrix.ts` | `budget` is inverted in the engine — don't add a sign here |
| Dimension options + `qaFit` | `src/config/dimensions.ts` | Vectors in `QA_ORDER`; option order = tie-break order |
| Default factor levels | `src/config/defaults.ts` | All 0 except `ttm:1`, `budget:2` |
| Scenario presets | `src/config/presets.ts` | Full 14-level sets; must hit the SRS §5.3 targets |
| Anti-pattern rules | `src/config/antiPatterns.ts` | Pure predicate over factors + selected options |
| Fitness-function templates | `src/config/fitnessFunctions.ts` | One per QA |
| Risk register data | `src/config/risks.ts` | Keyed `"<dim>:<optId>"`; ported from the Option Content Sheet |
| Cost/ops indicators | `src/config/costOps.ts` | Per D1 option (defensible defaults — see DECISIONS.md) |
| Detail narrative + option blurbs | `src/config/dimensionContent.ts` | "good / cost / know" + per-option one-liners |
| Migration paths | `src/config/migrationPaths.ts` | fresh / big / mix step lists |
| Glossary terms | `src/config/glossary.ts` | Method terms (QAs come from `qualityAttributes.ts`) |
| Methodology references | `src/config/references.ts` | Surfaced in the "How it works" panel |
| UI chrome strings | `src/i18n/dict.ts` | `{ en, id }`; add a key, use `t('key')` |

## Adding a translation

All copy is `{ en, id }`. To add a third language: widen the `Lang` type in `src/types.ts`, add the
language to every `Bilingual` value (config + `dict.ts`), and add a toggle option in the header.
A `t(key)` / `tr(bilingual)` helper from `useI18n()` resolves the active language.

## Import / export a setup

The toolbar (and command palette) export the current setup as JSON (`scenario` = factors +
selections + overrides + mode + language) and re-import it; the full state is also encoded in the
share-URL hash. See `src/lib/scenarioIO.ts` and `src/lib/urlState.ts`.

## Guards — run after any model change

```bash
node scripts/verify-model.mjs      # the math + fixtures + all 25 preset targets hold
node scripts/cross-check-docs.mjs  # the docs agree with each other and the prototype
npm run test                       # the engine's TypeScript twin (fixtures A–C, overrides, presets)
npm run lint && npm run build      # types + lint + production build
```

If a model change breaks a preset target, **adjust the preset levels — not the targets** — and
re-run, per the Model Data Sheet §6.
