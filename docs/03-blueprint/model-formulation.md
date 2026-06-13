# Architecture Advisor — Formal Model Formulation

**Blueprint Phase · Mathematical Specification (peer-reviewable)**

| Field | Detail |
|---|---|
| **Document type** | Formal model formulation — the decision model as mathematics, open to expert correction |
| **Version** | 0.2 |
| **Date** | 2026-06-13 |
| **Status** | Baseline — formulation stable; coefficients pending Domain-Advisor ratification (Charter Section 14.4) |
| **Author / Owner** | Faqih Pratama Muhti, B.Sc. Computer Science |
| **Audience** | Software architects, MCDA researchers, reviewers — anyone auditing or challenging the model |
| **Derived from** | [Scoring Algorithm Specification](scoring-algorithm.md) (computation contract) · [Model Data Sheet](model-data-sheet.md) (coefficients) |
| **License** | [CC BY 4.0](../../LICENSE-docs.md) |

**Document history**

| Version | Date | Summary |
|---|---|---|
| 0.1 | 2026-06-13 | Initial formal formulation: sets, parameters, the pipeline as equations, properties with proof sketches, per-construct literature grounding, and an explicit "how to correct this" section |
| 0.2 | 2026-06-13 | Usability pass: added a by-audience reading guide, a renderer-independent worked example (Section 3.6, = Fixture A), and a note on reading the math in viewers without MathJax; simplified `cases` spacing for robust rendering |

---

## Table of Contents

- [1. Purpose and how to read this](#1-purpose-and-how-to-read-this)
- [2. Sets, indices, and data](#2-sets-indices-and-data)
- [3. The model as equations](#3-the-model-as-equations)
- [4. The recommendation as a function](#4-the-recommendation-as-a-function)
- [5. Formal properties (with proof sketches)](#5-formal-properties-with-proof-sketches)
- [6. Methodological grounding — every construct, every source](#6-methodological-grounding--every-construct-every-source)
- [7. Assumptions open to correction](#7-assumptions-open-to-correction)
- [8. How to challenge or correct this formulation](#8-how-to-challenge-or-correct-this-formulation)
- [9. References](#9-references)

---

## 1. Purpose and how to read this

This document states the Architecture Advisor decision model in **precise mathematical form**, so a
software architect or decision-analysis researcher can (a) understand exactly what is computed,
(b) check it against the established literature, and (c) **correct it** where they disagree — with
a clear governance path for doing so (Section 8).

The model is an instance of **Multi-Attribute Value Theory (MAVT)** — specifically an *additive
value model* [1], [3] — wrapped around the **quality-attribute reasoning** of ATAM [15] and
Attribute-Driven Design [16], [17]. It operationalizes "choose the structure whose quality-attribute
profile best fits the prioritized quality attributes" as arithmetic. It is **decision support, not
an oracle** [13]; the coefficients are defensible expert estimates, not measured facts (Charter
Section 21).

The *computation* (rounding, tie-breaking, float precision, fixtures) lives in the
[Scoring Algorithm Specification](scoring-algorithm.md); the *coefficients* live in the
[Model Data Sheet](model-data-sheet.md). This document is the *theory* that ties them together, and
every equation here is the one the verification script `scripts/verify-model.mjs` exercises.

**Read by who you are.** You do not need all of it:

- **Practitioner / engineer** → Section 3 (the four steps) and the [worked example](#36-worked-example--one-full-pass-the-default-scenario) (3.6). That is the whole model in one read.
- **Software architect** → add Section 5 (what the model guarantees) and Section 7 (where it simplifies).
- **Decision-analysis / MCDA researcher** → Sections 5, 6, and 9 (proofs, grounding, and the sources to check).
- **Proposing a change** → Section 8 (how a correction is made and accepted).

> **Reading the math.** The formulas below render as mathematics on GitHub. In an editor or viewer
> without math support you will see the raw `$…$` source; the same steps are also written in plain
> ASCII — fully renderer-independent — in the [worked example](#36-worked-example--one-full-pass-the-default-scenario) (3.6)
> and in [Scoring Algorithm Specification](scoring-algorithm.md) Sections 3–4.

## 2. Sets, indices, and data

**Sets.**

- $Q = \{q_1, \dots, q_{12}\}$ — the quality attributes, indexed by $j$ (ISO/IEC 25010:2023 [14]).
- $F = \{f_1, \dots, f_{14}\}$ — the project factors, indexed by $i$.
- $D = \{\mathrm{D1}, \dots, \mathrm{D5}\}$ — the five orthogonal decision dimensions.
- $O_d = \{o_1, \dots, o_{n_d}\}$ — the options of dimension $d$, indexed by $k$ ($n_d \in \{3,4,5\}$).

**User input.** A factor-level vector

$$\ell = (\ell_1, \dots, \ell_{14}), \qquad \ell_i \in \{0, 1, 2\}.$$

**Model parameters (static configuration; [Model Data Sheet](model-data-sheet.md)).**

- Influence matrix $A = [a_{ij}] \in \mathbb{Z}^{14 \times 12}$, where $a_{ij}$ is the influence of
  factor $i$ on quality attribute $j$ (most entries are $0$; one entry, $\texttt{ttm}\to\texttt{maintainability}$, is negative).
- For each dimension $d$ and option $k$, a fit vector $\varphi^{(d)}_{k} = (\varphi^{(d)}_{k1}, \dots, \varphi^{(d)}_{k,12})$ with $\varphi^{(d)}_{kj} \in \{1,2,3,4,5\}$ (unspecified entries default to $3$).
- A distinguished **inverted factor** $b = \texttt{budget}$ (a *tight* budget is the strongest cost signal).
- A close-call threshold $\tau = 0.10$ and a rule set $\Pi$ of anti-pattern predicates (Section 4).

## 3. The model as equations

### 3.1 Step 1 — quality-attribute weights (the "utility tree")

Effective level (the budget inversion):

$$\hat{e}_i = \begin{cases} 2 - \ell_i & i = b \;(\texttt{budget}) \\ \ell_i & \text{otherwise} \end{cases}$$

Raw weight, clamp, normalize, with an equal-weight fallback when there is no signal:

$$r_j = \sum_{i=1}^{14} a_{ij}\,\hat{e}_i, \qquad \tilde{r}_j = \max(0,\, r_j), \qquad S = \sum_{j=1}^{12} \tilde{r}_j,$$

$$w_j = \begin{cases} \dfrac{\tilde{r}_j}{S} \cdot 100 & S > 0 \\ \dfrac{100}{12} & S = 0 \end{cases}$$

The weight vector $w = (w_1, \dots, w_{12})$ lives on the scaled simplex
$\Delta = \{\, w : w_j \ge 0,\ \sum_j w_j = 100 \,\}$ — it is the prioritized utility tree of ATAM [15].

### 3.2 Step 2 — composite value of an option

For option $k$ in dimension $d$:

$$V_d(k) = \sum_{j=1}^{12} \frac{w_j}{100}\,\varphi^{(d)}_{kj}.$$

This is the **additive value function** of MAVT [1], [3]. The per-attribute terms
$c_{kj} = \tfrac{w_j}{100}\,\varphi^{(d)}_{kj}$ are the contribution-breakdown rows shown to the user; by
construction $\sum_j c_{kj} = V_d(k)$ (FR-REC-4).

### 3.3 Step 3 — ranking, close call

Within each dimension, the recommendation is the maximizer

$$k^*(d) = \arg\max_{k \in O_d} V_d(k),$$

with ties broken by canonical option index (a fixed total order, so the result is deterministic).
Let $V_{(1)} \ge V_{(2)} \ge \dots$ be the ordered values; the dimension is a **close call** when

$$\frac{V_{(1)} - V_{(2)}}{V_{(1)}} < \tau = 0.10.$$

### 3.4 Step 4 — sensitivity (robustness)

With $e_i$ the $i$-th unit vector and $\mathrm{clamp}(\cdot)$ projecting each level back into $\{0,1,2\}$, dimension $d$ is **robust** iff no single one-level factor change moves the winner:

$$\text{robust}_d \iff \forall i \in F,\ \forall \delta \in \{-1,+1\} : \quad k^*\!\big(d;\ \mathrm{clamp}(\ell + \delta e_i)\big) = k^*(d;\ \ell).$$

Otherwise the model returns the set of *flipping* perturbations $\{(i,\delta)\}$ — the single
changes that would alter the recommendation [8].

### 3.5 Expert override and lock (optional)

Let $L \subseteq Q$ be the user-locked attributes with chosen values $v_q \in [0,100]$, and
$U = Q \setminus L$. The remainder $R = \max\!\big(0,\ 100 - \sum_{q \in L} v_q\big)$ is split over the
unlocked attributes in proportion to their derived raw weights:

$$w_q = \begin{cases} v_q & q \in L \\ \dfrac{\tilde{r}_q}{\sum_{q' \in U} \tilde{r}_{q'}}\,R & q \in U \end{cases}$$

(degenerate cases — all unlocked raw weights zero, or $\sum_{q\in L} v_q > 100$ — are pinned in
[Scoring Algorithm Specification](scoring-algorithm.md) Section 3.4). This is an analyst-driven
re-weighting, the spirit of ATAM's stakeholder prioritization [15].

### 3.6 Worked example — one full pass (the default scenario)

To make the equations concrete — and to show they read fine even without a math renderer — here is
the default scenario step by step. It is **Fixture A** in `scripts/verify-model.mjs`:

```
Input:   all 14 factors = level 0, except  ttm = 1  and  budget = 2

Step 1 — weights
  Among influencing factors only ttm is non-zero:
      ttm → timeToMarket +3 ,  ttm → maintainability −1
  budget's effective level = 2 − 2 = 0  → contributes nothing
  raw    = { timeToMarket: 3, maintainability: −1, all others: 0 }
  clamp  = { timeToMarket: 3,                       all others: 0 }   (−1 → 0)
  S = 3  →  w = { timeToMarket: 100%, all others: 0% }

Step 2 — composites for D1 (100% weight on timeToMarket ⇒ V = that option's ttm-fit)
  Monolith          ttm-fit 5  →  V = 5.0
  Layered / Modular / Serverless   ttm-fit 4  →  V = 4.0
  Microservices     ttm-fit 2  →  V = 2.0

Step 3 — winner = Monolith ;  gap = (5.0 − 4.0) / 5.0 = 20% ≥ 10%  →  not a close call

What-if — set ttm = 0 as well → every signal is now 0 → equal-weight fallback (wⱼ = 100/12)
          → winner shifts to Modular Monolith (mean fit 3.75)
```

The lesson in one line: **change a factor and the weights — and often the winner — change; the
coefficients themselves never move** (the note on dynamism in Section 4). Every number above is
re-derived and asserted by the verification script, so this example cannot silently drift from the
model.

## 4. The recommendation as a function

The whole engine is a deterministic, pure function of the input (and the static parameters):

$$\mathcal{R}(\ell) = \Big(\, k^*(\mathrm{D1}),\ k^*(\mathrm{D2}),\ k^*(\mathrm{D3}),\ k^*(\mathrm{D4}),\ k^*(\mathrm{D5}) \,\Big), \qquad k^*(d) = \arg\max_{k\in O_d}\, V_d\big(k;\, w(\ell)\big).$$

The chosen combination is then screened by the anti-pattern layer: each $\pi_m \in \Pi$ is a boolean
predicate over $(\ell, \mathcal{R})$ with a severity in $\{\textsf{info},\textsf{warning},\textsf{danger}\}$.
$\Pi$ is a **constraint/advisory layer, separate from the value model** — it never changes a score,
it only warns. This mirrors how ATAM treats *risks* and *non-risks* alongside the utility analysis [15].

> **Note on dynamism.** $A$ and $\varphi$ are fixed per model version; the *outputs* $w(\ell)$,
> $V_d$, and $\mathcal{R}(\ell)$ are recomputed live from $\ell$. The model does not learn or
> self-adapt — it is a deterministic function re-evaluated on new input.

## 5. Formal properties (with proof sketches)

**P1 — Normalized weights.** $\sum_{j} w_j = 100$ always.
*Proof.* If $S>0$, $\sum_j w_j = \tfrac{100}{S}\sum_j \tilde r_j = \tfrac{100}{S}\,S = 100$. If $S=0$, $\sum_j \tfrac{100}{12} = 100$. $\;\square$

**P2 — Bounded score.** $V_d(k) \in [1,5]$ for every option and every input.
*Proof.* Let $\lambda_j = w_j/100$. By P1, $\lambda_j \ge 0$ and $\sum_j \lambda_j = 1$, so
$V_d(k) = \sum_j \lambda_j \varphi^{(d)}_{kj}$ is a convex combination of values in $[1,5]$; hence
$\min_j \varphi^{(d)}_{kj} \le V_d(k) \le \max_j \varphi^{(d)}_{kj}$, and both bounds lie in $[1,5]$. $\;\square$

**P3 — No rank reversal (independence of irrelevant alternatives).** For any two options $k, k'$ in
a dimension, the sign of $V_d(k) - V_d(k')$ does not depend on which other options exist.
*Proof.* $V_d(k) - V_d(k') = \sum_j \lambda_j\big(\varphi^{(d)}_{kj} - \varphi^{(d)}_{k'j}\big)$, a function of
$k, k', w$ only. Adding or removing a third option changes neither $w$ (it is derived from $\ell$,
not from the option set) nor the difference. Hence pairwise order is invariant. $\;\square$
This is the decisive structural advantage over the eigenvector method of AHP, which is known to
permit rank reversal when alternatives are added or removed [6], [7].

**P4 — Exact reconciliation.** The contribution breakdown sums to the composite: $\sum_j c_{kj} = V_d(k)$
by definition of $c_{kj}$ — an identity, so the displayed table can never "fail to add up" (after the
documented largest-remainder rounding [12]).

**P5 — Compositional coupling (a caveat, not a bug).** Because $w$ is closed to a constant sum
($\sum_j w_j = 100$), raising one factor's contribution to attribute $j$ raises $\tilde r_j$ but, after
normalization, **lowers every other** $w_{j'}$. Normalized weights are therefore *not independently
monotone* in factor levels — they are compositional data [11]. **Consequence for readers and the
UI:** weights must be read *relatively* (priority share), never as absolute, independent magnitudes.
The raw scores $\tilde r_j$ are monotone in $\hat e_i$ for non-negative influences; the normalized
$w_j$ are not. This is mathematically unavoidable for any sum-to-100 weighting and is mitigated by
transparency, the contribution breakdown, and the sensitivity analysis.

## 6. Methodological grounding — every construct, every source

| Construct in this model | What it is, formally | Established basis |
|---|---|---|
| Additive composite $V_d(k)=\sum_j \lambda_j \varphi_{kj}$ | Additive multi-attribute value function | Keeney & Raiffa [1]; Fishburn (additive utilities) [3]; Dyer & Sarin (measurable value functions) [2] |
| Weights $w$ on the simplex | Criteria importance weights summing to a constant | Belton & Stewart [4]; the SMART/SMARTER weighting tradition, Edwards & Barron [5] |
| Factors → weights (matrix $A$) | Context variables setting the weight vector | Operationalizes ATAM's utility-tree prioritization [15] and ADD's QA-driven selection [16], [17] |
| Options' $\varphi$ vs the QA model | Alternatives scored against quality characteristics | ISO/IEC 25010:2023 [14]; *Software Architecture in Practice* [17] |
| Ranking by $\arg\max V$ | Value-maximizing choice | Standard MAVT decision rule [1], [4] |
| Sensitivity / robustness | Stability of $\arg\max$ under input perturbation | Triantaphyllou & Sánchez [8]; Triantaphyllou [9] |
| No rank reversal (P3) | IIA from additive separability | Belton & Gear (the AHP short-coming) [6] vs Saaty [7] |
| Ordinal 0–2 / 1–5 used numerically | Interval treatment of ordinal scales | Stevens' scale theory [10] — acknowledged approximation (Section 7) |
| Sum-to-100 normalization (P5) | Closure of compositional data | Aitchison [11] |
| Decision *support*, not prescription | Aiding, not replacing, judgment | Roy, decision-aiding methodology [13]; Charter Section 21 |

## 7. Assumptions open to correction

State openly, so reviewers judge the model on its own declared terms:

1. **Preferential independence.** Additive aggregation is valid under mutual preferential independence
   of the attributes [1], [2]. Some QAs correlate in practice (e.g. deployability and
   maintainability), so this is an accepted simplification of applied MCDA [4], not an exact truth.
2. **Linear factor→weight map.** $A$ is linear in $\hat e_i$. Real influence may be non-linear or
   interact across factors; the linear form is chosen for transparency and explainability.
3. **Ordinal-as-interval.** Levels (0–2) and fits (1–5) are ordinal but used arithmetically [10].
   This is why the values are editable, the disclaimer is permanent, and sensitivity is built in.
4. **Single inverted factor.** Only `budget` is inverted. If other factors warrant inversion, $A$
   and $\hat e$ must change together.
5. **Fixed close-call threshold** $\tau = 0.10$ and the equal-weight fallback are conventions, not
   derived constants.
6. **Coefficient values.** $A$ and the $\varphi$ vectors (especially the D4/D5 baseline) are expert
   estimates pending Domain-Advisor ratification and, ultimately, empirical validation (Charter
   Section 11; roadmap v3.0).

## 8. How to challenge or correct this formulation

Every part of the model is meant to be inspectable and replaceable. To propose a correction:

- **A coefficient is wrong** (an $a_{ij}$ or a $\varphi_{kj}$) → edit the [Model Data Sheet](model-data-sheet.md),
  run `node scripts/verify-model.mjs` (it re-checks all fixtures, margins, and invariants), and open
  an ADR with rationale + a reference; a Domain Advisor reviews (Charter Section 14.4). The formulas
  here are untouched.
- **The aggregation should not be additive** (you want multiplicative MAUT, or an outranking method
  such as ELECTRE/PROMETHEE, or AHP) → that changes Section 3.2 and invalidates the P2/P3 proofs;
  raise it as an architectural decision (a new ADR) — note the trade-offs documented in
  [Scoring Algorithm Specification](scoring-algorithm.md) Section 11.
- **The factor→weight map should be non-linear** → that changes Section 3.1; the simplex property
  P1 must be re-established for any replacement.
- **The threshold/fallback conventions** ($\tau$, equal-weight) → they are named constants in
  `config/`; change with justification.

A correction is **accepted** when: the equation(s) are updated here, the affected proofs in Section 5
are re-derived, the [Scoring Algorithm Specification](scoring-algorithm.md) and
[Model Data Sheet](model-data-sheet.md) are made consistent, and `scripts/verify-model.mjs` passes
(exit 0). That single command is the guard that the theory, the coefficients, and the fixtures still
agree.

## 9. References

1. R. L. Keeney and H. Raiffa, *Decisions with Multiple Objectives: Preferences and Value Tradeoffs*. New York: Wiley, 1976.
2. J. S. Dyer and R. K. Sarin, "Measurable multiattribute value functions," *Operations Research*, vol. 27, no. 4, pp. 810–822, 1979.
3. P. C. Fishburn, "Additive utilities with incomplete product sets: Application to priorities and assignments," *Operations Research*, vol. 15, no. 3, pp. 537–542, 1967.
4. V. Belton and T. J. Stewart, *Multiple Criteria Decision Analysis: An Integrated Approach*. Boston, MA: Kluwer Academic, 2002.
5. W. Edwards and F. H. Barron, "SMARTS and SMARTER: Improved simple methods for multiattribute utility measurement," *Organizational Behavior and Human Decision Processes*, vol. 60, no. 3, pp. 306–325, 1994.
6. V. Belton and T. Gear, "On a short-coming of Saaty's method of analytic hierarchies," *Omega*, vol. 11, no. 3, pp. 228–230, 1983.
7. T. L. Saaty, *The Analytic Hierarchy Process*. New York: McGraw-Hill, 1980.
8. E. Triantaphyllou and A. Sánchez, "A sensitivity analysis approach for some deterministic multi-criteria decision-making methods," *Decision Sciences*, vol. 28, no. 1, pp. 151–194, 1997.
9. E. Triantaphyllou, *Multi-Criteria Decision Making Methods: A Comparative Study*. Dordrecht: Kluwer Academic (Springer), 2000.
10. S. S. Stevens, "On the theory of scales of measurement," *Science*, vol. 103, no. 2684, pp. 677–680, 1946.
11. J. Aitchison, *The Statistical Analysis of Compositional Data*. London: Chapman & Hall, 1986.
12. M. L. Balinski and H. P. Young, *Fair Representation: Meeting the Ideal of One Man, One Vote*. New Haven, CT: Yale University Press, 1982.
13. B. Roy, *Multicriteria Methodology for Decision Aiding*. Dordrecht: Kluwer Academic, 1996.
14. ISO/IEC 25010:2023, *Systems and software engineering — SQuaRE — Product quality model*, ISO, 2023.
15. R. Kazman, M. Klein, and P. Clements, "ATAM: Method for Architecture Evaluation," SEI, Carnegie Mellon Univ., Tech. Rep. CMU/SEI-2000-TR-004, 2000.
16. R. Wojcik et al., "Attribute-Driven Design (ADD), Version 2.0," SEI, Carnegie Mellon Univ., Tech. Rep. CMU/SEI-2006-TR-023, 2006.
17. L. Bass, P. Clements, and R. Kazman, *Software Architecture in Practice*, 4th ed. Boston, MA: Addison-Wesley, 2021.

> **In plain language:** this is the math behind the tool, written out so an expert can check every
> step and disagree with it on the record — what is computed, why each step rests on a known method
> from the decision-analysis literature, which assumptions are simplifications, and exactly how to
> propose a fix so the documents and the verification script stay in agreement.
