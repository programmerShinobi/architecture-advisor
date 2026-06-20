---
name: Model review / challenge
about: Question or propose a change to the scoring model (qaFit, weights, influence, rules)
title: '[model] '
labels: model
---

The model is meant to be **challenged** — it's a transparent set of defensible defaults, not
ground truth. Please ground the proposal in evidence or methodology.

**What to change**
- Which value(s): e.g. a D-dimension option's `qaFit`, a factor→QA influence, a preset, an
  anti-pattern rule, or a fitness template.
- Current value → proposed value.

**Rationale / evidence**
Why the proposed value is more defensible (standards, literature, real-world experience).

**Expected effect**
Which recommendation/scenario changes, and whether any
[preset target](https://github.com/programmerShinobi/architecture-advisor/blob/main/docs/03-blueprint/model-data-sheet.md) or fixture would be affected.

**Checklist**
- [ ] I checked the canonical values in the [Model Data Sheet](https://github.com/programmerShinobi/architecture-advisor/blob/main/docs/03-blueprint/model-data-sheet.md)
      and [Scoring Algorithm](https://github.com/programmerShinobi/architecture-advisor/blob/main/docs/03-blueprint/scoring-algorithm.md).
- [ ] I understand a change must keep `node scripts/verify-model.mjs` and `cross-check-docs.mjs`
      green (adjust presets/levels, not the targets — see [EXTENDING.md](https://github.com/programmerShinobi/architecture-advisor/blob/main/EXTENDING.md)).
