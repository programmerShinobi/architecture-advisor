# Mobile Experience Plan — Architecture Advisor

**Status:** **Implemented** 2026-07-14 (written 2026-07-13, before implementation, per the maintainer's docs-first rule)
**Owner:** Faqih Pratama Muhti · **Relates to:** ADR-009 (Aurora Slate), FR-SHELL-1/2/3/11, design-spec §6.1, [`prototype-v2/preview-modern.html`](prototype-v2/preview-modern.html)

## 1. Goal

Make the **core Advisor and Insights** (and the Home landing) feel like a **genuinely mobile app** on
phones — not a desktop layout squeezed small — while keeping the exact decision-model flow and all
logic unchanged. Concretely, on phones (≤640px):

- A **fixed bottom tab bar** for primary navigation (thumb-zone), the mobile convention — replacing
  the top tab row that currently wraps.
- A **sticky bottom primary action** on the Advisor (the "main button at the bottom" pattern) that
  drives the process flow (factors → priorities → plan → save).
- **First-class, reachable controls** for the three product toggles — **theme (light/dark)**,
  **language (EN/ID)**, and **Guided/Expert** — surfaced in a mobile **settings sheet** (the header
  control cluster is cramped on phones).
- Mobile-native spacing/typography/hit-targets and safe-area handling.

Desktop (≥641px) is unchanged (top nav + header controls as today).

## 2. Non-negotiables

- **No change to the flow or the model.** Same four steps, same scoring, same content — only the
  *presentation/navigation* changes on phones. All model/content guards and the 102 unit + 14 e2e
  tests stay green (e2e updated for the new mobile chrome where needed).
- **No new runtime dependency.** Token-based (`--color-*`, `--aa-*`), `aa-`/`lp-` class conventions,
  no `!important`, reuse the existing `<dialog>`-based sheet pattern if present or a small one.
- **Accessibility:** bottom-nav items ≥44px, `aria-current` on the active tab, `env(safe-area-inset-*)`,
  visible focus, `prefers-reduced-motion` respected, WCAG AA in both themes (axe-gated).
- **Budget:** stay within the initial-JS/CSS and total-JS budgets (mobile chrome is small CSS + a
  little JS).

## 3. Components & changes (planned)

| Area | Change |
|---|---|
| **`MobileTabBar`** (new) | Fixed bottom bar, phone-only (`aa-only-phone`), 3 tabs **Home · Advisor · Insights** (icon + label), `aria-current`, safe-area padding. Drives the same `mainView` state. The top tab row gets `aa-hide-phone`. |
| **`MobileSettingsSheet`** (new) | A bottom sheet (slide-up) holding **Theme**, **Language**, **Guided/Expert** as large, labelled controls. Opened from a compact header button (gear) shown on phones. Closes on backdrop/Esc; focus-trapped. |
| **Header** | On phones, collapse the control cluster (⌘K/?/save already hidden via `aa-hide-phone`); keep brand + theme quick-toggle + the settings (gear) button. Desktop unchanged. |
| **`AdvisorMobileBar`** (new) | Phone-only sticky bottom action bar (above the tab bar): a **contextual primary button** that advances the flow — *See what matters* → *Get your plan* → *Save & share* — by scrolling to that section (the Advisor stays one page; the bar is the mobile "next"). Uses the existing StepTracker sections as anchors. |
| **Advisor layout** | Content gets bottom padding = `tabbar + actionbar + safe-area` so nothing hides behind the fixed chrome. Cards/inputs already responsive; verify one-column, comfortable tap targets. |
| **Insights layout** | Already card-based/stacks; ensure bottom padding for the tab bar and that section/detail navigation is thumb-reachable. |
| **Landing** | Already responsive (radar-first, reflowing bento); add bottom padding for the tab bar; CTAs unaffected. |
| **CSS** | New `aa-only-phone` / `aa-hide-phone` usage; `.aa-tabbar`, `.aa-mobile-actionbar`, `.aa-sheet` under the ≤640 breakpoint; all token-based. |

## 4. Interaction / flow (unchanged semantics)

- **Navigation:** bottom tab bar switches `mainView` exactly like the top tabs (Home/Advisor/Insights);
  a shared `#s=…` link still opens the Advisor.
- **Advisor bottom action (contextual):**
  1. On the Factors area → primary button **"See what matters"** scrolls to Priorities.
  2. Past Priorities → **"Get your plan"** scrolls to the Recommendation.
  3. At the plan → **"Save & share"** opens the export/share.
  The determination is by scroll position / which section is in view — no state-machine change; the
  single-page flow is preserved (this is navigation sugar, not a wizard rewrite).
- **Toggles:** the settings sheet mutates the same `theme` / `lang` / `mode` state used everywhere;
  changes apply instantly and persist (localStorage), identical to the header controls.

## 5. Breakpoint & tokens

- ~~Phone tier: **≤640px** (canonical, design-spec §6.1). Bottom nav + action bar + settings sheet are
  phone-only; ≥641px keeps the current top-nav desktop layout.~~ **Updated (Fase 2b, 2026-07-16):**
  the navigation chrome now switches at **≤1024px** — tablets share the phone's bottom nav /
  action bar / settings sheet / compact top bar so the app bar never wraps; only content-density
  rules stay on the 640px phone tier (design-spec §6.1).
- Safe area: `padding-bottom: env(safe-area-inset-bottom)` on the fixed bars; the viewport already
  uses `viewport-fit=cover`? (verify/set in index.html).

## 6. Testing (planned)

- **Unit:** a small render test for `MobileSettingsSheet` (toggles call the right setters) and that
  the bottom tab bar switches views.
- **e2e (`responsive.spec.ts`):** at the 360px viewport, assert the bottom tab bar is visible and
  switches Home/Advisor/Insights; the settings sheet opens and toggles theme/lang/mode; no horizontal
  scroll; the Advisor bottom action advances the flow. Desktop specs unchanged.
- **a11y:** axe on the mobile chrome (both themes); bottom-nav roles/`aria-current`; focus trap in the
  sheet.

## 7. Rollout

Incremental, each step gate-green: (1) bottom tab bar + hide top nav on phones; (2) settings sheet +
header gear; (3) Advisor sticky bottom action; (4) padding/polish for Insights & Landing; (5) e2e +
a11y + screenshots (both themes), docs, PR. Documented in CHANGELOG + design-spec on completion; this
plan is the pre-implementation record.

## 8. Implementation notes (as built, 2026-07-14)

- **`MobileChrome`** renders the bottom tab bar (**Home · Advisor · Insights · More**) and the
  settings sheet; the "More" tab opens the sheet with **Theme · Language · Reading mode** as
  segmented controls. `useTheme` was **lifted to `App`** and passed to both the header and
  `MobileChrome` (they share one theme state — `usePersistedState` does not sync across instances).
- **`AdvisorMobileBar`** is the phone-only sticky primary action; an `IntersectionObserver` on
  `#adv-plan` flips it from **Get your plan** → **Save & share** as the recommendation reaches the
  viewport's middle band. Anchors `#adv-plan` / `#adv-save` added to the Advisor sections.
- The desktop **top nav** and the header **theme/language/mode cluster** move to CSS classes
  (`.aa-topnav`, `.aa-desktop-controls`) that hide ≤640px — avoiding the inline-`display` footgun
  that beats `aa-hide-phone` (DECISIONS.md). Content clears the fixed bars via `.aa-page` /
  `.aa-page.has-actionbar` bottom padding + `env(safe-area-inset-bottom)`; `index.html` gained
  `viewport-fit=cover`.
- **Tests:** e2e `responsive.spec.ts` updated to assert the bottom bar + settings sheet on phones;
  the two App-level a11y unit tests select the first nav match (top nav + bottom bar both render
  under `css:false`). Desktop specs unchanged. All gates green; budget total JS 193.2/200 kB.
