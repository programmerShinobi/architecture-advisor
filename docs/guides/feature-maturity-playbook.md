# Execution Playbook — Making Features Feel "Mature"

### An execution-ready version, assisted by Claude.ai

> Purpose of this document: turn a list of factors (UX, technical, analyst) into **concrete tasks
> that can be executed without exception**. Each task is designed to be done solo or with help
> from Claude.ai, has clear completion criteria, and has an owner.

---

## How to Use This Document

**Format of each task:**
- **ID** — a unique code for tracking (e.g. `UX-01`).
- **Goal** — the end result you want to achieve.
- **Steps** — the concrete actions to take.
- **Claude.ai Prompt** — a ready-to-use sentence to request Claude's help.
- **Definition of Done (DoD)** — a checklist; the task is done ONLY if all items are met.
- **Owner** — the primary responsible role (Engineer / Architect / Analyst / Designer).

**How to involve Claude.ai in general (standard workflow):**
1. **Give context first** — paste the relevant code/spec/design before asking.
2. **Ask for one specific output** — an audit, checklist, refactor, or test cases (don't mix them).
3. **Ask Claude to flag assumptions** — "state the assumptions you made".
4. **Iterate** — ask Claude to critique its own result ("what are the weaknesses of this solution?").
5. **Verify** — don't use it as-is; test the output against the DoD in this document.

---

## PHASE 0 — Foundation (do BEFORE any feature)

### F0-01 · Establish a Design System / Design Tokens
- **Goal:** a single source for colors, spacing, typography, component sizing.
- **Steps:** define tokens (color, spacing scale, font scale, radius, shadow); create base components (button, input, modal, toast); document each component's states (default/hover/active/disabled/loading/error).
- **Claude Prompt:** *"Here are the colors and components I use now: [paste]. Organize them into consistent design tokens, flag any inconsistencies, and propose a clean spacing & typography scale."*
- **DoD:**
  - [ ] All colors/spacing/fonts come from tokens, not hard-coded values.
  - [ ] Every base component has all states defined.
  - [ ] There is one reference page (style guide) the team can access.
- **Owner:** Designer + Engineer

### F0-02 · Establish Code Standards & Linting
- **Goal:** automatic code-style consistency, reducing manual debate.
- **Steps:** install a linter + formatter; set naming rules; enable a pre-commit hook; configure CI to fail when lint fails.
- **Claude Prompt:** *"Create a linter & formatter config for the [name] stack, plus naming conventions for files, functions, variables, and endpoints."*
- **DoD:**
  - [ ] Lint & format run automatically in pre-commit and CI.
  - [ ] No lint warnings remain in new code.
- **Owner:** Engineer

### F0-03 · Establish API Contract Style Guidelines
- **Goal:** all endpoints feel "from one hand".
- **Steps:** set URL/resource patterns, status-code rules, a uniform error format, versioning rules, pagination rules, idempotency rules.
- **Claude Prompt:** *"Create an API style guide covering: resource naming conventions, a list of HTTP status codes & when to use them, a standard error-object format, a versioning strategy, and a pagination pattern. Provide request/response examples for each case."*
- **DoD:**
  - [ ] There is an agreed API style-guide document.
  - [ ] The error format has a fixed structure (`code`, `message`, `details`).
  - [ ] Status-code, pagination, and versioning rules are written with examples.
- **Owner:** Architect + Engineer

### F0-04 · Lay the Observability Foundation
- **Goal:** the system is observable from day one, not bolted on.
- **Steps:** set up structured logging with a correlation/request ID; prepare basic metrics (latency, error rate, throughput); prepare tracing if multi-service.
- **Claude Prompt:** *"Design a structured-logging schema with a correlation ID for the [name] stack. Include an example log entry, required fields, and how to propagate the ID across services."*
- **DoD:**
  - [ ] Every request can be traced via a single correlation ID.
  - [ ] Logs are structured (not free text).
  - [ ] Latency & error-rate metrics are collected.
- **Owner:** Architect + Engineer

---

## PHASE 1 — First Impression (UX in the first seconds–minutes)

### UX-01 · Audit & Enforce Consistency
- **Goal:** the same pattern behaves & looks the same across the whole app.
- **Steps:** inventory all buttons/icons/terminology/date-number formats; align them to the design system; unify terms (one concept = one word).
- **Claude Prompt:** *"Here is a list of labels, buttons, and terms from various screens: [paste]. Find inconsistencies (different terms for the same action, mixed date/number formats, action positions that change) and propose a uniform version."*
- **DoD:**
  - [ ] One action = one term across the whole app.
  - [ ] Date, number, and currency formats are uniform.
  - [ ] The position & style of primary actions is consistent across pages.
- **Owner:** Designer + Engineer

### UX-02 · Add Feedback & Loading States to Every Action
- **Goal:** the user is never unsure "is it processing or hung".
- **Steps:** add immediate feedback (<100ms) on click/hover; loading state (skeleton/spinner/progress) for operations >1 second; disable the button while submitting; debounce input.
- **Claude Prompt:** *"For the [name, e.g. submit form] flow, list every point that needs user feedback: loading, success, failure, partial. Propose the type of indicator for each and show an example implementation in [framework]."*
- **DoD:**
  - [ ] No action without a visual response.
  - [ ] Operations >1 second have a progress indicator.
  - [ ] The button is disabled during processing so there's no double-submit.
- **Owner:** Engineer + Designer

### UX-03 · Standardize Error Messages & Recovery
- **Goal:** errors become actionable, not scary.
- **Steps:** replace technical messages with guiding language; preserve form input on error; provide undo/confirmation for destructive actions; provide retry for network failures.
- **Claude Prompt:** *"Here is the current list of error messages: [paste]. Rewrite them to be clear, stating the cause and the fix, in a calm tone. Flag which errors need a retry or undo button."*
- **DoD:**
  - [ ] No raw technical message (e.g. "Error 500") reaches the user.
  - [ ] The form does not lose data on error.
  - [ ] Destructive actions have confirmation or undo.
- **Owner:** Engineer + Designer

### UX-04 · Reduce Cognitive Load
- **Goal:** the user understands without having to think hard.
- **Steps:** set smart defaults for common cases; hide advanced options (progressive disclosure); make empty states that guide the first action.
- **Claude Prompt:** *"For the [name] screen, propose sensible default values, which options can be hidden behind 'advanced', and empty-state text that points the user to the first action."*
- **DoD:**
  - [ ] Defaults are right for the majority of cases.
  - [ ] Rarely used options do not flood the main screen.
  - [ ] Every empty screen explains the next step.
- **Owner:** Designer

---

## PHASE 2 — When Tried Seriously (predictability & edge cases)

### TECH-01 · Audit & Handle Every Edge Case
- **Goal:** the main differentiator between a prototype and a product.
- **Steps:** test empty/null conditions; boundary values (0, negative, very long string, Unicode/emoji); concurrency (two users editing the same thing → optimistic locking); network failure/timeout; partial failure; double-submit.
- **Claude Prompt:** *"Here is the function/endpoint: [paste code]. Make a complete list of edge cases (empty input, null, boundaries, Unicode, race condition, network failure, partial failure, duplication). For each case, state the expected behavior and write the test case."*
- **DoD:**
  - [ ] Empty/null is handled without crashing.
  - [ ] Boundary values & extreme input are tested.
  - [ ] There is a concurrency strategy (locking/versioning).
  - [ ] Double-submit does not produce duplicate data.
- **Owner:** Engineer

### TECH-02 · Ensure Predictability (no hidden side effects)
- **Goal:** one input → one predictable output.
- **Steps:** identify operations that silently change other data; make them explicit; avoid undocumented global state.
- **Claude Prompt:** *"Review this code: [paste]. Flag all hidden side effects (global state changes, mutations of other data, implicit calls). Suggest how to make them explicit or remove them."*
- **DoD:**
  - [ ] No undocumented side effects.
  - [ ] High-impact operations are invoked explicitly.
- **Owner:** Architect + Engineer

### TECH-03 · Enforce Built-in Security
- **Goal:** security is woven into the design, not patched on.
- **Steps:** validate input on the server; check authorization per-resource (not just per-endpoint); use parameterized queries; protect against XSS/CSRF; ensure no hard-coded secrets & no sensitive data leaking in logs/responses.
- **Claude Prompt:** *"Run a security audit on this code: [paste]. Check input validation, per-resource authorization, injection risks (SQL/XSS/CSRF), sensitive-data leakage in logs/responses, and hard-coded secrets. Order findings from most critical."*
- **DoD:**
  - [ ] All input is validated server-side.
  - [ ] Authorization is checked at the resource level.
  - [ ] No hard-coded secrets; sensitive data does not appear in logs/responses.
  - [ ] Queries use parameters (injection-safe).
- **Owner:** Engineer + Architect

---

## PHASE 3 — When Integrated (API, documentation, debugging)

### TECH-04 · Align the Implementation with the API Contract
- **Goal:** the API feels consistent & predictable to its consumers.
- **Steps:** match every endpoint to the style guide (F0-03); fix wrong status codes; unify the error format; add correct idempotency & pagination.
- **Claude Prompt:** *"Compare the following endpoint against this API style guide: [paste both]. Flag deviations (wrong status code, non-uniform error format, missing pagination/idempotency) and provide a corrected version."*
- **DoD:**
  - [ ] All endpoints use the correct status codes.
  - [ ] The error format is uniform across the whole API.
  - [ ] Pagination & idempotency are applied where needed.
- **Owner:** Engineer + Architect

### TECH-05 · Create Documentation That Stays in Sync with the Code
- **Goal:** a newcomer can be running in <30 minutes; integration without guessing.
- **Steps:** generate/maintain API documentation (e.g. OpenAPI); make flow diagrams for complex processes; write a setup README; record design decisions (ADR).
- **Claude Prompt:** *"From this endpoint spec: [paste], create documentation covering description, parameters, request/response examples, and possible errors. Then write a concise setup README so a new developer can run the project."*
- **DoD:**
  - [ ] API documentation matches actual behavior.
  - [ ] Complex flows have a diagram.
  - [ ] The README is enough to run the project from scratch.
- **Owner:** Engineer + Analyst

### TECH-06 · Ensure Debuggability
- **Goal:** when something fails, the root cause is found quickly.
- **Steps:** ensure logs contain a correlation ID & enough context; ensure errors have a searchable code; provide a way to reproduce.
- **Claude Prompt:** *"For this flow: [paste], suggest logging points that make failures easy to trace, which fields to record, and error codes usable for quick searching."*
- **DoD:**
  - [ ] Every failure can be traced from the logs without guessing.
  - [ ] Errors have a searchable code.
- **Owner:** Engineer

---

## PHASE 4 — Long Term (scale, observability, maintainability)

### TECH-07 · Optimize Scalability & Performance
- **Steps:** eliminate N+1 queries (eager load/batch); set caching (what, TTL, invalidation); ensure correct DB indexing; make heavy operations async; add rate limiting.
- **Claude Prompt:** *"Review this query/logic: [paste]. Find N+1 queries, caching opportunities, columns that need indexing, and heavy operations that should be async. Propose fixes with their trade-offs."*
- **DoD:**
  - [ ] No N+1 queries on the critical path.
  - [ ] A clear caching & invalidation strategy.
  - [ ] Heavy operations don't block; rate limiting is in place.
- **Owner:** Architect + Engineer

### TECH-08 · Set Up Testing (Testability & Coverage)
- **Steps:** write unit tests for core logic; integration tests for flows; include edge-case tests from TECH-01; run them in CI.
- **Claude Prompt:** *"Create a test plan for the [name] feature: a list of unit tests, integration tests, and edge-case tests. Write the test scaffolding for [framework]."*
- **DoD:**
  - [ ] Core logic & edge cases have tests.
  - [ ] Tests run automatically in CI and fail the build on failure.
- **Owner:** Engineer

### TECH-09 · Maintain Maintainability (avoid over-engineering)
- **Steps:** review readability & complexity; separate concerns (presentation/logic/data); simplify excessive abstractions.
- **Claude Prompt:** *"Review this module: [paste]. Assess readability, separation of concerns, and whether there is excessive abstraction. Propose simplifications without changing behavior."*
- **DoD:**
  - [ ] Concerns are clearly separated.
  - [ ] No unnecessary complexity.
  - [ ] The code is understandable to a new reader without a verbal explanation.
- **Owner:** Architect + Engineer

### TECH-10 · Complete Operational Observability
- **Steps:** set up a metrics dashboard (latency/error/throughput); set up alerting on anomalies; ensure complete tracing for cross-service flows.
- **Claude Prompt:** *"Propose a dashboard & alerts for the [name] feature: which metrics to monitor, alert thresholds, and the conditions that should trigger a notification."*
- **DoD:**
  - [ ] A dashboard of key metrics is available.
  - [ ] Alerts are active for important anomalies.
- **Owner:** Architect + Engineer

---

## ANALYST LAYER (cross-phase)

### AN-01 · Traceability to Requirements
- **Steps:** map each feature to a business need; flag "dangling" functions with no requirement.
- **Claude Prompt:** *"Here is a list of features & a list of requirements: [paste both]. Map features to requirements, flag features with no requirement and requirements with no feature."*
- **DoD:**
  - [ ] Every feature is linked to a requirement.
  - [ ] No function without justification.
- **Owner:** Analyst

### AN-02 · Business-Rule & Data Consistency
- **Steps:** collect all business rules; check for contradictions; ensure uniform application; set a single source of truth for each piece of data.
- **Claude Prompt:** *"Here is a set of business rules: [paste]. Find rules that contradict each other or are applied inconsistently across modules, and propose a unification."*
- **DoD:**
  - [ ] No contradictory business rules.
  - [ ] The same rule is applied uniformly everywhere.
  - [ ] Each piece of data has a single source of truth.
- **Owner:** Analyst + Architect

### AN-03 · Auditability
- **Steps:** ensure important data changes are recorded (who, what, when).
- **Claude Prompt:** *"For the [name] entity, design an audit trail: which fields to record on create/update/delete and how to store them."*
- **DoD:**
  - [ ] Critical data changes can be traced (actor + time).
- **Owner:** Analyst + Engineer

---

## MASTER CHECKLIST — Global Definition of Done

A feature is considered **"mature & comfortable"** only if ALL are checked:

**First impression**
- [ ] Consistent in visuals, behavior, and terminology (UX-01)
- [ ] Every action has feedback & a loading state (UX-02)
- [ ] Error messages are actionable + there is recovery/undo (UX-03)
- [ ] Low cognitive load: smart defaults, guiding empty states (UX-04)

**When tried seriously**
- [ ] All edge cases handled & tested (TECH-01)
- [ ] Behavior is predictable with no hidden side effects (TECH-02)
- [ ] Security is built in: validation, authorization, injection-safe, no leaks (TECH-03)

**When integrated**
- [ ] The API matches the contract: status codes, error, pagination, idempotency (TECH-04)
- [ ] Documentation is in sync with the code + the README runs in <30 minutes (TECH-05)
- [ ] Failures are easy to trace via logs (TECH-06)

**Long term**
- [ ] Scalability & performance handled (TECH-07)
- [ ] Automated tests in CI (TECH-08)
- [ ] Maintainable, not over-engineered (TECH-09)
- [ ] Operational observability is active (TECH-10)

**Analyst layer**
- [ ] Every feature is traced to a requirement (AN-01)
- [ ] Business rules are consistent & have a single source of truth (AN-02)
- [ ] An audit trail is available (AN-03)

---

## Ready-to-Use Claude.ai Prompt Templates

**1. Thorough audit of a feature:**
> "Act as a senior reviewer. Here is the code/spec for the [name] feature: [paste]. Audit it against: consistency, UX feedback, error handling, edge cases, predictability, security, API contract, documentation, performance, testability. For each finding: state the location, the severity (critical/medium/minor), and a fix suggestion. Flag the assumptions you made."

**2. Generate edge cases + tests:**
> "For this function: [paste], create a complete list of edge cases and write automated test cases for [framework]. Include null, boundary, Unicode, concurrency, network-failure, and duplication cases."

**3. Review an API contract:**
> "Compare this endpoint with the following style guide: [paste both]. Flag all deviations and provide a corrected version with request/response examples."

**4. Self-critique (to ensure quality):**
> "What are the weaknesses, risks, and failure cases of the solution you just gave? What would a senior architect criticize?"

---

*Note: do Phase 0 first — without the foundation (design system, API standards, observability),
tasks in later phases keep colliding with inconsistency. After Phase 0, new features can follow
the Master Checklist from the design stage onward.*
