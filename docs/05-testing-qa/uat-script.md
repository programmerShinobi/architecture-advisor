# UAT Script — Architecture Advisor

> **User-Acceptance Testing (L5).** Automated tests prove the tool is *correct*; UAT proves it is
> *useful and clear* to the two audiences it is built for. This is the moderator script, the task
> scenarios, the success criteria, and a results template. Run it before tagging a release once the
> flow is feature-complete. See the [Test Plan](test-plan.md) for where UAT sits among the layers.

## 1. Goal & method

Confirm that a **newcomer** can reach and *understand* a recommendation unaided, and that an
**architect** can *justify* a decision with the tool's evidence. Method: moderated, think-aloud,
one participant at a time; the moderator gives the scenario, then stays silent except to prompt
"what are you thinking?" / "what would you do next?".

- **Participants:** ≥3 per persona (≥6 total). Newcomers = developers new to architecture
  trade-offs; architects = people who make these calls.
- **Environment:** the deployed app (or `npm run dev`), latest `main`, default (Guided) on load.
- **Per task capture:** completed unaided? (Y / N / with-prompt), time, errors/confusion, verbatim
  quotes, and a post-task clarity rating **1–5** ("I understand *why* this was recommended").

## 2. Success criteria (exit)

UAT passes when, across participants:

- **≥80%** complete each core task unaided (no moderator help beyond "keep going").
- Median **clarity ≥ 4 / 5** per persona.
- **No critical usability blocker** recurs (same point of confusion for ≥2 participants).
- Every architect can name the **top contributing factor** for their recommendation in their own
  words, and find the **close-call / sensitivity** caveat.

## 3. Scenarios

### Persona A — Newcomer (Guided mode)

> *"You're building a small internal tool for one team, on a tight deadline. Use this app to decide
> roughly how to build it — and be ready to tell me **why**."*

| # | Task | Pass when… |
|---|------|------------|
| A1 | Describe the project with the factor controls (or a preset) | reaches Step 3 with a recommendation showing |
| A2 | Say what the tool recommends and **why**, in your own words | references a priority/driver (not just the option name) |
| A3 | Find what *the good / the cost* of the top pick is | reads the "what this means for you" narrative |
| A4 | Decide whether you trust it | notices the close-call / "decision support, not an oracle" disclaimer |

### Persona B — Architect (Expert mode)

> *"Justify choosing a **Modular Monolith over Microservices** for a regulated, high-scale product —
> and produce something you could paste into a decision record."*

| # | Task | Pass when… |
|---|------|------------|
| B1 | Switch to Expert; set the factors for that context | weights + rankings update live |
| B2 | Explain the top pick from the **contribution bars** | cites the highest weight × fit drivers |
| B3 | Check how robust the pick is | uses the **sensitivity** card and the radar close-call |
| B4 | Override a QA weight and observe the effect | sees the others redistribute; can revert |
| B5 | Export a decision record | downloads the **ADR (MADR)** and/or the full report |
| B6 | Share the exact scenario with a colleague | copies the share link (and trusts it round-trips) |

## 4. Results template (copy per session)

```
Participant: ____    Persona: A / B    Date: ____    Moderator: ____
Build/commit: ____   Browser/OS: ____

Tasks (Y / N / prompted · time · notes)
  A1/B1: __   A2/B2: __   A3/B3: __   A4/B4: __   (B5: __  B6: __)

Clarity (1–5): "I understand WHY this was recommended" → __
Top confusion / friction:
Best quote:
Bugs / blockers (severity):
Would they use it again? (1–5): __
```

## 5. After the sessions

- Aggregate against Section 2; record pass/fail in the [Test Plan](test-plan.md) Section 4 row for
  the relevant ACs (AC-2/11/12 clarity in practice) and open issues for any recurring blocker.
- Feed wording/flow fixes back into the [SRS](../02-requirement-analysis/software-requirements-specification.md)
  and the UI copy; re-test the changed path.

## 6. Readiness (facilitator dry-run)

Before recruiting participants, a moderator dry-run confirmed **every task path is functional in
v1.0.0** on the live app — so a failed task in a real session reflects *usability*, not a broken
build. Each path is also covered by an automated test, so it stays functional:

| Task | Path works (evidence) |
|---|---|
| A1 / B1 reach a live recommendation; factors update it | `e2e/smoke.spec` (preset recomputes) + `App.test` (factor reactivity) |
| A2 / A3 "why" narrative + good/cost | rendered in the Guided detail (DimensionDetail) |
| B2 contribution bars · B3 sensitivity / close-call | `RadarPanel.test` + `SensitivityCard.test` |
| B4 override a weight → others redistribute | `QaOverridePanel.test` + `App.test` (redistribution) |
| B5 export ADR / report | `e2e/smoke.spec` (ADR `.md` downloads) + `exports.test` |
| B6 share link round-trips | `e2e/share.spec` (deep-link restores state) |

**Status: ready to run.** Outstanding = scheduling ≥3 participants per persona and recording the
Section 4 results; until then AC-2/11/12 "clarity in practice" stays unproven by real users.

---

| Version | Date | Notes |
|---|---|---|
| 0.1 | 2026-06-20 | Initial UAT script: method, exit criteria, Guided/Expert scenarios, results template. Not yet executed (≥3 participants per persona pending). |
| 0.2 | 2026-06-20 | Added the facilitator dry-run / readiness check — every task path verified functional in v1.0.0 (mapped to the automated tests). Script is ready to run; participant sessions still pending. |
