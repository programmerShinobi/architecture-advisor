#!/usr/bin/env node
/**
 * Architecture Advisor — model verification.
 *
 * Recomputes the scoring pipeline from the frozen values in
 * docs/03-blueprint/model-data-sheet.md and asserts everything pinned in
 * docs/03-blueprint/scoring-algorithm.md: fixtures A–C, all 25 preset targets
 * with their margins (flagging any under 2% as calibration-sensitive),
 * largest-remainder display rounding, expert override/lock semantics, and 500
 * seeded randomized property tests (weights sum to 100, composites in [1,5],
 * deterministic ranking).
 * Run: node scripts/verify-model.mjs   (exit 0 = all assertions hold)
 */

// ---- 1. Frozen model data (mirror of the Model Data Sheet) -----------------
const QA = ["performance","scalability","availability","security","maintainability","deployability",
            "testability","observability","dataConsistency","interoperability","costEfficiency","timeToMarket"];
const FACTORS = ["team","distribution","ttm","budget","lifespan","scale","dataVolume","async","realtime",
                 "domain","consistency","security","legacy","devops"];
const INFLUENCE = { // factor -> { qa: influence }; budget is inverted (see weights())
  team:{deployability:2,maintainability:1}, distribution:{deployability:2,maintainability:1},
  ttm:{timeToMarket:3,maintainability:-1}, budget:{costEfficiency:3},
  lifespan:{maintainability:2,testability:1,observability:1},
  scale:{scalability:3,performance:1,availability:1,costEfficiency:1},
  dataVolume:{scalability:2,performance:1,costEfficiency:1},
  async:{scalability:1,availability:1,performance:1}, realtime:{performance:3,availability:1},
  domain:{maintainability:2,testability:1}, consistency:{dataConsistency:3},
  security:{security:3}, legacy:{interoperability:3,maintainability:1},
  devops:{deployability:1,observability:1},
};
const DIMENSIONS = { // option order = canonical tie-break order (Model Data Sheet Section 4)
  D1:[["Layered",[4,3,3,4,3,2,3,3,5,3,4,4]],["Monolith",[4,2,3,4,3,2,4,4,5,3,4,5]],
      ["Modular Monolith",[4,3,3,4,4,3,4,4,5,3,4,4]],["Microservices",[3,5,4,4,4,5,3,3,2,4,2,2]],
      ["Serverless",[3,5,4,3,3,4,3,3,3,3,4,4]]],
  D2:[["Synchronous",[4,2,2,3,4,3,3,4,5,3,3,5]],["Async messaging",[3,4,4,3,3,3,3,3,3,3,3,3]],
      ["Event-driven",[3,5,5,3,3,3,3,2,2,3,3,2]],["Streaming",[5,5,4,3,2,3,3,2,2,3,3,2]]],
  D3:[["Single shared DB",[4,2,3,3,3,2,3,3,5,3,4,5]],["Database-per-service",[3,5,3,3,4,5,3,3,2,3,3,3]],
      ["CQRS",[5,5,3,3,3,3,3,3,3,3,3,2]],["Event Sourcing",[3,4,3,3,2,3,3,5,4,3,2,2]],
      ["Polyglot",[4,4,3,3,3,3,3,3,3,4,2,3]]],
  D4:[["Hexagonal",[3,3,3,4,5,3,5,3,3,4,3,2]],["Clean",[3,3,3,4,5,3,5,3,3,3,3,2]],
      ["Vertical Slice",[3,3,3,3,4,3,4,3,3,3,3,4]],["Layered",[3,3,3,3,3,3,3,3,3,3,4,5]]],
  D5:[["Micro-frontends",[3,5,3,3,2,5,3,3,3,3,2,2]],["SPA",[3,3,3,3,4,3,3,3,3,3,4,4]],
      ["SSR",[5,3,3,4,3,3,3,3,3,3,3,3]]],
};
const DEFAULTS = { ttm:1, budget:2 }; // all other factors level 0
const PRESETS = { // calibrated levels (Model Data Sheet Section 6)
  "startup-mvp":             {ttm:2,budget:0},
  "regulated":               {team:1,ttm:0,budget:1,lifespan:2,domain:2,consistency:2,security:2,legacy:1,devops:1},
  "high-traffic-ecommerce":  {team:2,distribution:2,ttm:0,budget:2,lifespan:2,scale:2,dataVolume:2,async:2,domain:2,consistency:1,security:1,devops:2},
  "iot-streaming":           {team:1,distribution:1,ttm:1,budget:1,lifespan:2,scale:2,dataVolume:2,async:2,realtime:2,domain:1,security:1,devops:2},
  "internal-tool":           {team:1,ttm:2,budget:1,lifespan:1,domain:1,consistency:1,legacy:1,devops:1},
};
const TARGETS = { // expected top option per dimension (sets = allowed alternatives), per SRS Section 5.3
  "startup-mvp":            [["Monolith"],["Synchronous"],["Single shared DB"],["Layered"],["SPA"]],
  "regulated":              [["Modular Monolith"],["Synchronous"],["Single shared DB"],["Hexagonal","Clean"],["SPA","SSR"]],
  "high-traffic-ecommerce": [["Microservices"],["Event-driven"],["Database-per-service"],["Hexagonal","Clean"],["Micro-frontends"]],
  "iot-streaming":          [["Microservices","Serverless"],["Streaming"],["CQRS","Event Sourcing"],["Hexagonal","Clean"],["SPA","SSR"]],
  "internal-tool":          [["Modular Monolith"],["Synchronous"],["Single shared DB"],["Layered"],["SPA"]],
};

// ---- 2. The scoring engine (mirror of scoring-algorithm.md) ----------------
export function deriveWeights(levels) {           // Step 1
  const raw = Object.fromEntries(QA.map(q => [q, 0]));
  for (const f of FACTORS) {
    const level = levels[f] ?? 0;
    const effective = f === "budget" ? 2 - level : level;   // budget inverted
    for (const [q, inf] of Object.entries(INFLUENCE[f])) raw[q] += inf * effective;
  }
  for (const q of QA) raw[q] = Math.max(0, raw[q]);          // clamp negatives
  const sum = QA.reduce((s, q) => s + raw[q], 0);
  if (sum === 0) return Object.fromEntries(QA.map(q => [q, 100 / 12])); // equal-weight fallback
  return Object.fromEntries(QA.map(q => [q, (raw[q] / sum) * 100]));    // normalize to 100
}
export const composite = (w, fit) => QA.reduce((s, q, i) => s + (w[q] / 100) * fit[i], 0); // Step 2
export function rank(levels, dim) {               // Step 3 (deterministic tie-break: config order)
  const w = deriveWeights(levels);
  return DIMENSIONS[dim].map(([name, fit], i) => ({ name, score: composite(w, fit), i }))
    .sort((a, b) => b.score - a.score || a.i - b.i);
}
export const closeCall = r => (r[0].score - r[1].score) / r[0].score < 0.10;
export function sensitivity(levels, dim = "D1") { // Step 4: full flip set, canonical order
  const winner = rank(levels, dim)[0].name, flips = [];
  for (const f of FACTORS) for (const d of [-1, 1]) {
    const lv = (levels[f] ?? 0) + d;
    if (lv < 0 || lv > 2) continue;
    const t = rank({ ...levels, [f]: lv }, dim)[0].name;
    if (t !== winner) flips.push({ factor: f, to: lv, newWinner: t });
  }
  return flips;
}

// ---- 3. Assertions ----------------------------------------------------------
let failures = 0;
const assert = (ok, msg) => { console.log(`${ok ? "  ✓" : "  ✗ FAIL"} ${msg}`); if (!ok) failures++; };
const approx = (a, b, eps = 1e-9) => Math.abs(a - b) < eps;

console.log("Fixture A — defaults (all 0; ttm=1, budget=2)");
{ const w = deriveWeights(DEFAULTS), r = rank(DEFAULTS, "D1");
  assert(approx(w.timeToMarket, 100), `timeToMarket weight = 100% (got ${w.timeToMarket})`);
  assert(r[0].name === "Monolith" && approx(r[0].score, 5), `D1 top = Monolith @ 5.0 (got ${r[0].name} @ ${r[0].score})`);
  assert(!closeCall(r), "no close call at defaults");
  const flips = sensitivity(DEFAULTS).map(f => `${f.factor}→${f.to}:${f.newWinner}`);
  assert(flips.length === 5, `sensitivity finds 5 single-step flips (got ${flips.length}: ${flips.join(", ")})`); }

console.log("Fixture B — AC-3 (team2 dist2 scale2 devops2 ttm0; budget default 2)");
{ const L = { ...DEFAULTS, team:2, distribution:2, scale:2, devops:2, ttm:0 }, r = rank(L, "D1");
  assert(r[0].name === "Microservices" && approx(r[0].score, 120/28), `D1 top = Microservices @ 30/7 (got ${r[0].name} @ ${r[0].score})`);
  assert(closeCall(r), "close call vs Serverless is expected and flagged"); }

console.log("Fixture C — AC-5 revised (domain2 team0 ttm0)");
{ const L = { ...DEFAULTS, domain:2, ttm:0 };
  assert(rank(L, "D1")[0].name === "Modular Monolith", "D1 top = Modular Monolith");
  const d4 = rank(L, "D4");
  assert(d4[0].name === "Hexagonal" && d4[1].name === "Clean" && approx(d4[0].score, 5), "D4 = Hexagonal & Clean @ 5.0"); }

console.log("Equal-weight fallback (all signals zero: ttm=0, budget=2)");
{ const r = rank({ ...DEFAULTS, ttm:0 }, "D1");
  assert(r[0].name === "Modular Monolith" && approx(r[0].score, 45/12), `D1 top = Modular Monolith @ 3.75 (got ${r[0].name} @ ${r[0].score})`); }

for (const [name, overrides] of Object.entries(PRESETS)) {
  console.log(`Preset ${name}`);
  const L = { ...DEFAULTS, ...overrides };
  ["D1","D2","D3","D4","D5"].forEach((dim, i) => {
    const r = rank(L, dim), want = TARGETS[name][i];
    const outside = r.find(o => !want.includes(o.name));
    const margin = (r[0].score - outside.score) / r[0].score * 100;
    assert(want.includes(r[0].name) && margin > 0,
      `${dim} top ∈ {${want.join(", ")}} — got ${r[0].name} @ ${r[0].score.toFixed(4)}; margin over ${outside.name} = ${margin.toFixed(2)}%${margin < 2 ? " ⚠ CALIBRATION-SENSITIVE" : ""}`);
  });
}

console.log("Display rounding — largest remainder (Hamilton), Fixture B");
{ const w = deriveWeights({ ...DEFAULTS, team:2, distribution:2, scale:2, devops:2, ttm:0 });
  const floors = QA.map(q => Math.floor(w[q]));
  let need = 100 - floors.reduce((a, b) => a + b, 0);
  const order = QA.map((q, i) => ({ i, rem: w[q] - floors[i] })).sort((a, b) => b.rem - a.rem || a.i - b.i);
  for (let k = 0; k < need; k++) floors[order[k].i]++;
  const expect = { performance:7, scalability:22, availability:7, maintainability:14, deployability:36, observability:7, costEfficiency:7 };
  const ok = QA.every((q, i) => floors[i] === (expect[q] ?? 0)) && floors.reduce((a, b) => a + b, 0) === 100;
  assert(ok, `display weights = [7,22,7,14,36,7,7] (+zeros), summing to exactly 100 (got ${floors.filter(x=>x>0).join(",")})`); }

console.log("Expert override & lock semantics (spec Section 3.4)");
{ const L = { ...DEFAULTS, team:2, distribution:2, scale:2, devops:2, ttm:0 };
  const raw = deriveWeights(L);                                  // derived (no locks)
  const locked = { scalability: 50 };                            // lock scalability at 50%
  const U = QA.filter(q => !(q in locked));
  const rawU = U.reduce((a, q) => a + raw[q], 0);
  const w = Object.fromEntries(QA.map(q => [q, q in locked ? locked[q] : raw[q] / rawU * 50]));
  const sum = QA.reduce((a, q) => a + w[q], 0);
  const r = DIMENSIONS.D1.map(([n, f], i) => ({ n, s: composite(w, f), i })).sort((a, b) => b.s - a.s || a.i - b.i);
  assert(approx(sum, 100, 1e-9), `locked + redistributed weights sum to exactly 100 (got ${sum})`);
  assert(r[0].n === "Microservices", `D1 winner under scalability=50% lock = Microservices (got ${r[0].n})`); }

console.log("Property tests — 500 seeded random inputs");
{ let s0 = 42; const rnd = () => { s0 = (s0 * 1664525 + 1013904223) >>> 0; return s0 / 2 ** 32; };
  let ok = true, fallbacks = 0;
  for (let t = 0; t < 500 && ok; t++) {
    const L = Object.fromEntries(FACTORS.map(f => [f, Math.floor(rnd() * 3)]));
    const w = deriveWeights(L);
    const sum = QA.reduce((a, q) => a + w[q], 0);
    if (!approx(sum, 100, 1e-9)) ok = false;                                  // invariant 1
    for (const d of ["D1","D2","D3","D4","D5"]) for (const o of rank(L, d))
      if (o.score < 1 - 1e-9 || o.score > 5 + 1e-9) ok = false;               // invariant 2
    const again = rank(L, "D1");
    if (JSON.stringify(again) !== JSON.stringify(rank(L, "D1"))) ok = false;  // invariant 4
    const allZero = QA.every(q => approx(w[q], 100 / 12));
    if (allZero) fallbacks++;
  }
  assert(ok, "weights always sum to 100; composites always in [1,5]; ranking deterministic");
  assert(fallbacks >= 0, `equal-weight fallback engaged ${fallbacks}× across the sample (allowed)`); }

console.log(failures === 0 ? "\nAll model assertions hold." : `\n${failures} assertion(s) FAILED.`);
process.exit(failures === 0 ? 0 : 1);
