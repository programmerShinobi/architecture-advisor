# UI/UX Execution Playbook — for Technical Users, with Claude.ai

This working document translates 9 UI/UX comfort factors (for an audience of software
architects / engineers / analysts) into **tasks you can execute directly with Claude.ai**,
complete with ready-to-paste prompts, a Definition of Done (DoD), and a verification checklist.

**How to use this document:**
1. Do **Phase 0** first (context setup) — it is the foundation every later task relies on.
2. For each factor (Task 1–9), paste the **Prompt** into Claude.ai, then match the result against
   the **DoD** and the **Verification Checklist**.
3. Tick `[ ]` → `[x]` for every item that is genuinely met. **Do not move on** to the next factor
   while a critical item is still unchecked.
4. Close with **Phase 10** (final cross-factor audit).

> Note: "Claude.ai" here is used to build artifacts (HTML/React), produce a design system, write
> specs, and run audits. Replace the `{...}` placeholders with your product's details.

---

## Phase 0 — Context Setup (REQUIRED first)

Goal: give Claude consistent context so all outputs are aligned. Do this once, up front.

### Task 0.1 — Define the persona & application type

**Prompt:**
```
I am designing {application type: e.g. "an internal admin dashboard for data analysts"}.
Its primary users: {persona: e.g. "data analysts & data engineers, comfortable with SQL & spreadsheets"}.
The core tasks they perform most often (in order of frequency):
1. {most frequent task}
2. {second task}
3. {third task}
Target platform: {desktop web / mobile / both}.
Please summarize in 5 points: the users' mental model, the expectations they bring from other
tools, and what would immediately make them distrust this tool.
```

**DoD:**
- [ ] Persona, application type, and 3 core tasks are written explicitly.
- [ ] There is a list of "distrust triggers" to serve as design guardrails.

### Task 0.2 — Build the Design System / Design Tokens

**Prompt:**
```
Based on the persona above, create design tokens for a technical, high-information-density app:
- A spacing scale on a 4/8 px grid (xs, sm, md, lg, xl).
- A typography scale: at most 4 sizes + 2-3 weights. Include a monospace font for IDs/numbers/code.
- A functional color palette: neutral (background/border/text), + status colors (success/warning/error/info),
  all with at least WCAG AA contrast (>=4.5:1 for normal text).
- MUST provide both a light mode AND a dark mode.
- Present it as a token table + visual examples in a single HTML artifact.
```

**DoD:**
- [ ] Spacing, typography, and color tokens are defined and consistent.
- [ ] Dark mode is available from the start.
- [ ] Color contrast passes WCAG AA (ask Claude to check the contrast ratios).
- [ ] A monospace font is set for technical data (IDs, numbers, code, timestamps).

---

## Task 1 — Speed & Responsiveness (perceived performance)

**Target thresholds:** instant actions <100 ms, flows <1 second, >1 second must show progress,
>10 seconds must be cancelable.

**Prompt:**
```
For {component/page}, implement perceived-performance patterns:
1. Optimistic UI for {e.g. check a task, toggle, like} actions — the UI changes instantly, syncs
   in the background, rolls back + notifies on failure.
2. Skeleton screens (not spinners) for loading table/list data.
3. Transitions/animations of 150-250 ms only; no animation that blocks the next action.
4. Prevent layout shift: reserve space for content that is loading.
Build it as an artifact I can see directly, and explain where each pattern is applied.
```

**DoD:**
- [ ] Immediate actions feel instant (optimistic update + rollback on failure).
- [ ] Loading uses skeletons, not a full-screen spinner.
- [ ] Animations are 150–250 ms and do not block actions.
- [ ] No layout shift when data arrives.
- [ ] Long actions have progress + a cancel option.

**Verification Checklist (manual test):**
- [ ] Click/toggle feels instant, no lag.
- [ ] The screen does not "jump" while data loads.
- [ ] A power user does not have to wait for an animation to finish before the next action.

---

## Task 2 — Workflow Efficiency (keyboard-first)

**Prompt:**
```
Add an efficiency layer for power users to {application/component}:
1. A command palette (Cmd/Ctrl+K) that reaches ALL primary actions, with fuzzy search.
2. Keyboard navigation: j/k or arrows for lists, logical Tab order in forms, Cmd+Enter to submit, Esc to close/cancel.
3. Bulk actions: multi-select (shift+click, select-all) then a mass operation.
4. Tooltips that show the shortcut (e.g. hover "Save" -> "Ctrl+S"), plus a "?" panel listing shortcuts.
Ensure core tasks #1-3 from the persona can be completed without touching the mouse.
```

**DoD:**
- [ ] The command palette (Cmd/Ctrl+K) works and reaches all core actions.
- [ ] Core tasks can be completed fully by keyboard.
- [ ] Form Tab order is logical and does not jump around.
- [ ] Bulk actions are available for repetitive operations.
- [ ] Shortcuts are discoverable (tooltip + "?" panel).

**Verification Checklist:**
- [ ] The most frequent task is reachable in ≤2 actions from anywhere.
- [ ] Esc / Enter / Cmd+Enter behave as standard expectations dictate.

---

## Task 3 — Information Density (dense but organized)

**Prompt:**
```
Design the main data view {table/dashboard} with high information density like a technical tool (not a consumer app):
1. Data grid: row height ~32-40px, columns resizable + sortable + filterable + pinnable, sticky header.
2. Visual hierarchy via typographic contrast & thin dividers — NOT via excessive white space.
3. Progressive disclosure: key info always visible, details appear on-demand (expand row / side panel / hover).
4. Numbers use tabular figures + right-aligned; IDs/hashes/codes use monospace.
Show it with realistic sample data (at least 20 rows, several number & ID columns).
```

**DoD:**
- [ ] The table is dense but still easy to scan.
- [ ] Columns can sort/filter/resize; the header is sticky.
- [ ] Numbers are right-aligned + tabular figures; IDs/codes are monospace.
- [ ] Details are available via progressive disclosure, not hidden behind many clicks.

**Verification Checklist:**
- [ ] It does not feel "dumbed down" (no giant fonts/padding).
- [ ] Number columns are easy to compare visually.

---

## Task 4 — Transparency & Control (anti black-box)

**Prompt:**
```
Add transparency & control mechanisms to {application}:
1. An always-visible save-state indicator: "Saving... / Saved / All changes saved".
2. Undo/Redo for destructive actions, plus an "Undo" toast after delete (instead of an "Are you sure?" dialog for reversible actions).
3. Proportional confirmation: irreversible actions (permanent delete) need deliberate friction — e.g. type the resource name to confirm.
4. Preview/dry-run before big actions: show "X items will be affected" + a diff before executing.
5. (If collaborative) version history / audit trail: who changed what, when.
```

**DoD:**
- [ ] The save state is always visible (no doubt about "saved or not").
- [ ] Reversible actions → undo (not an intrusive confirmation dialog).
- [ ] Irreversible actions → deliberate friction + a clear warning.
- [ ] There is a preview/dry-run for high-impact operations.
- [ ] (If relevant) an audit trail is available.

**Verification Checklist:**
- [ ] There is no way to lose data without a warning/undo.
- [ ] The user always knows "what the system is currently doing".

---

## Task 5 — Error Handling (honest, specific, actionable)

**Prompt:**
```
Standardize error handling for {application} with a 3-layer format: WHAT is wrong -> WHY -> HOW to fix.
1. Inline validation in forms: flag the wrong field WHILE typing, message near the field (not only after submit).
2. System errors: show a clear message + error code + a copyable request ID + a Retry button + a docs link.
3. Distinguish user errors (input) from system errors (bug) — do not blame the user for a system bug.
4. Error toasts do not auto-dismiss before they can be read (or can be pinned).
Create 4 example error components: field validation, save failure, network timeout, and server error.
```

**DoD:**
- [ ] Every error message has: what is wrong, why, how to fix it.
- [ ] Inline validation while typing, not only on submit.
- [ ] System errors include an error code / request ID + a recovery path (Retry/docs).
- [ ] User errors vs system errors are clearly distinguished.
- [ ] Error toasts do not disappear before they are read.

**Verification Checklist:**
- [ ] There is no generic "Something went wrong" message without context.
- [ ] The user always has a way out of an error state.

---

## Task 6 — Consistency & Predictability (Jakob's Law)

**Prompt:**
```
Audit & tidy the consistency of {application}:
1. Follow standard conventions: Ctrl/Cmd+S to save, Cmd+Z to undo, Esc to close/cancel, Enter to confirm, Cmd+Enter to submit.
   Do not hijack standard shortcuts.
2. Consistent components: the same button/dialog/badge always looks & behaves the same.
3. Colors carry consistent meaning (red = destructive/error ACROSS the whole app).
4. Consistent terminology: one concept = one term (do not mix "project/workspace/board").
5. Predictable element positions: the primary button is always in the same place within a dialog.
Output the list of inconsistencies found + their fixes.
```

**DoD:**
- [ ] Standard shortcuts are honored, not hijacked.
- [ ] Components & colors are consistent in meaning across the whole app.
- [ ] One concept uses one consistent term.
- [ ] Button/element positions are predictable across screens.

**Verification Checklist:**
- [ ] After learning one part, the others feel familiar.
- [ ] There are no behavioral "surprises" between pages.

---

## Task 7 — Smart Defaults + Customization

**Prompt:**
```
For {application}:
1. Sensible defaults: the tool is immediately useful out-of-the-box without long mandatory setup.
2. Power-user customization: dark/light mode, adjustable panel layout, saved views/filters,
   (if relevant) keyboard remapping.
3. State persistence: remember user preferences — column widths, last filter, open panel, last tab.
4. Escape hatch: export data (CSV/JSON), and if relevant an API/webhook/CLI.
Show where each one is applied.
```

**DoD:**
- [ ] The tool is useful immediately without long setup.
- [ ] Dark mode + view customization are available.
- [ ] User preferences persist across sessions (no reset).
- [ ] Data can be exported (not "imprisoned").

**Verification Checklist:**
- [ ] There is no forced setup before seeing value.
- [ ] Column widths / filters / last tab are remembered on reopening.

---

## Task 8 — Visual Credibility (clean & coherent)

**Prompt:**
```
Run a visual QA on {application/artifact} to a technical-audience standard:
1. Consistent spacing on a 4/8 px grid — no random padding/margins.
2. Precise alignment: elements aligned; icons & text optically aligned.
3. Typography: line-height ~1.5 for body, WCAG AA contrast, at most 2-3 sizes/weights for hierarchy.
4. A controlled color palette: color only for functional meaning, not random decoration.
5. Zero visual bugs: no clipped text, overflow, misplaced icons, double borders, overlapping elements.
Output the list of findings + their fixes, then apply them.
```

**DoD:**
- [ ] Spacing & alignment are consistent on the grid.
- [ ] Typography is readable, contrast passes WCAG AA.
- [ ] Color is used only for functional meaning.
- [ ] Zero visible visual bugs.

**Verification Checklist:**
- [ ] There is no detail that makes the user conclude "the logic is probably sloppy too".
- [ ] The look feels coherent, not merely "decorative".

---

## Task 9 — Onboarding (fast to value, no fluff)

**Prompt:**
```
Design onboarding for technical users of {application}:
1. Short time-to-value: give a "skip" path and let them use it right away; do not force a long tour / profile setup first.
2. Helpful empty state: when there is no data yet, show an example, a template, or a clear first action —
   not a blank "No data" screen.
3. Contextual documentation: "?" tooltips, inline help, docs links at relevant points.
4. Sample data / playground: let them try with dummy data before committing.
Create an example empty state + 1 contextual tooltip.
```

**DoD:**
- [ ] There is a use-it-now path (skip the tour).
- [ ] The empty state guides the first action (example/template), not a blank screen.
- [ ] Contextual help is available where relevant.
- [ ] There is sample data / a playground for early exploration.

**Verification Checklist:**
- [ ] A technical user can try it right away without being blocked by a wizard.
- [ ] An empty screen is never confusing.

---

## Phase 10 — Final Cross-Factor Audit

Run this after Task 1–9 are done. Goal: ensure no factor was missed and everything is aligned.

**Prompt:**
```
Run a thorough audit of {application} against the following 9 factors, giving a score 1-5 + findings + recommendations per factor:
1) Speed & responsiveness  2) Keyboard workflow efficiency  3) Information density
4) Transparency & control  5) Error handling  6) Consistency  7) Defaults + customization
8) Visual credibility  9) Onboarding.
Mark any factor scoring <4 as "not yet passing" and give concrete remediation steps.
```

**Pass gate (all must be ✓ before being considered "comfortable" for a technical audience):**
- [ ] First seconds: **fast** + **visually coherent** (nothing looks broken).
- [ ] No way to **lose data** without a warning/undo.
- [ ] All **errors** are informative & actionable.
- [ ] **Consistent** & predictable across the whole app.
- [ ] **Keyboard-first** for core tasks.
- [ ] **Dark mode** is available.
- [ ] **Data can be exported**.
- [ ] All nine factors score ≥4.

---

## Priority Summary (if time is limited)

| Priority | Factor | Why |
|---|---|---|
| 1 | Speed + Visual credibility | Judged in the first seconds; an early trust signal |
| 2 | Transparency/control + Data safety | Lose it once = trust lost permanently |
| 3 | Error handling + Consistency | A quality marker of engineering to a technical audience |
| 4 | Keyboard efficiency + Information density | The main differentiator from a consumer app |
| 5 | Defaults+customization + Onboarding | Long-term retention & adoption |

> The psychological core: technical users judge a tool by whether it **respects their time and
> intelligence**. They forgive a plain UI as long as it is fast, honest, and never loses their
> work — not a pretty UI that is slow, opaque, or destroys data.
