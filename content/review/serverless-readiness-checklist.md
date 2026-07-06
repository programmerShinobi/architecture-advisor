---
title_id: "Checklist Kesiapan Serverless (FaaS)"
title_en: "A Serverless (FaaS) Readiness Checklist"
slug: serverless-readiness-checklist
section: review
audience: [awam, expert]
summary_tldr_id: "Serverless brilian untuk beban bergelombang, event-driven, dan tim yang enggan mengurus server — dengan skala-ke-nol dan bayar-per-pakai. Tapi hati-hati cold start, batas eksekusi, pengujian/observabilitas yang lebih sulit, dan keterikatan vendor. Nilai kesiapanmu sebelum berkomitmen."
summary_tldr_en: "Serverless shines for spiky, event-driven workloads and teams that would rather not run servers — with scale-to-zero and pay-per-use. But beware cold starts, execution limits, harder testing/observability, and vendor lock-in. Assess your readiness before committing."
evidence_strength: moderate
last_reviewed: 2026-07-02
review_due: 2027-07-02
translation_status: en
related_advisor:
  dimensions: [D1]
  options: [serverless]
sources:
  - { label: "Jonas et al. — Cloud Programming Simplified: A Berkeley View on Serverless Computing", venue: "UC Berkeley / arXiv", year: 2019, url: "https://arxiv.org/abs/1902.03383" }
  - { label: "Castro et al. — The rise of serverless computing", venue: "Communications of the ACM", year: 2019, url: "https://doi.org/10.1145/3368454" }
  - { label: "Baldini et al. — Serverless Computing: Current Trends and Open Problems", venue: "Springer", year: 2017, url: "https://doi.org/10.1007/978-981-10-5026-8_1" }
status: published
author: Architecture Advisor
---

## When serverless makes sense

Serverless is not "smaller microservices" — it is a different execution model with its own
trade-offs.

:::guided
**A good fit for:** sharply fluctuating or unpredictable load, event-driven glue (e.g. process an
image when it's uploaded), and small teams that want to focus on code, not servers.

**A poor fit for:** long-running, latency-critical, or heavily stateful workloads.
:::

## Readiness checklist

- [ ] The workload is **spiky / event-driven** (scale-to-zero genuinely pays off).
- [ ] Functions are **short & as stateless as possible**; state lives in managed services.
- [ ] **Cold starts** are tolerable on latency-sensitive paths (or mitigated).
- [ ] There is a strategy for **local testing & observability** (distributed tracing).
- [ ] **Vendor lock-in** is understood and acceptable; execution limits are checked.
- [ ] The **cost model** is projected at sustained high volume (it can flip to more expensive).

:::expert
**Deeper.** The *Berkeley View* frames serverless as simplified cloud programming with open
problems: state, latency, and portability. Castro et al. (CACM) give a balanced overview; Baldini et
al. map the trends & open issues. The common pattern: use FaaS for the bursty, event-driven edges,
with a more stable core in other services.
:::

## Try it in the Advisor

The *scale*, *realtime*, and *budget* factors shift where **Serverless** lands in D1 — compare it
with monolith/microservices on the Advisor's radar.
