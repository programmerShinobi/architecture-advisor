# scripts/

Two Node scripts (no dependencies — Node ≥ 18) guard the decision model. They run in CI via
[`.github/workflows/docs-integrity.yml`](../.github/workflows/docs-integrity.yml) and locally:

| Script | What it guarantees | Run |
|---|---|---|
| **[`verify-model.mjs`](verify-model.mjs)** | The math is **correct**: recomputes the whole scoring pipeline from the [Model Data Sheet](../docs/03-blueprint/model-data-sheet.md) and asserts the fixtures, all 25 preset targets with their margins, largest-remainder display rounding, expert override/lock semantics, and 500 randomized property tests. | `node scripts/verify-model.mjs` |
| **[`cross-check-docs.mjs`](cross-check-docs.mjs)** | The documents **agree**: parses the model values out of each document and diffs them — qaFit vectors, influence matrix, preset levels, preset targets (Model Data Sheet ↔ verify-model.mjs ↔ SRS Section 5.3), default levels, anti-pattern rule IDs, and fitness-template coverage. | `node scripts/cross-check-docs.mjs` |

Both exit `0` on success and `1` on any failure. Run **both** after any change to the model values
([Model Data Sheet](../docs/03-blueprint/model-data-sheet.md)), the computation contract
([Scoring Algorithm Specification](../docs/03-blueprint/scoring-algorithm.md)), the formulation
([Model Formulation](../docs/03-blueprint/model-formulation.md)), or the SRS preset targets — and
log model changes via an ADR (Charter Section 14.4).
