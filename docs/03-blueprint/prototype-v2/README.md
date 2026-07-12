# Prototype v2 — "Aurora Slate" visual reference

[`preview-modern.html`](preview-modern.html) is the approved visual source of truth for the Aurora
Slate reskin (design-spec **ADR-009**).

> Status: **applied.** The palette, Space Grotesk display face, the two signatures (aurora
> background + the restyled radar), and the restrained polish have been applied *in place* to the
> React app — see [DECISIONS.md → "Aurora Slate" visual reskin](../../../DECISIONS.md) and
> [design-spec ADR-009](../design-specification.md#8-key-design-decisions-adrs). The blueprint's
> vanilla/MPA rewrite was **not** adopted (the engine, model, Insights, and tests are preserved).
> The earlier prototype at [`../prototype/`](../prototype/) is a historical SDLC artefact and is
> left untouched.
>
> Note: this reference file keeps the prototype's Google-Fonts `<link>` and `data-theme` toggle;
> the production app self-hosts fonts (`@fontsource`) and uses the existing `html.light` theme
> mechanism — reconciliations recorded in ADR-009.
