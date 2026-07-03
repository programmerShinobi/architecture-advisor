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
translation_status: id
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

## Kapan serverless masuk akal

Serverless bukan "microservices yang lebih kecil" — ia model eksekusi berbeda dengan trade-off
tersendiri.

:::guided
**Cocok untuk:** beban yang naik-turun tajam atau tak terduga, perekat berbasis peristiwa (mis. proses
gambar saat diunggah), dan tim kecil yang ingin fokus ke kode, bukan server.

**Kurang cocok untuk:** beban berjalan-lama, kritis-latensi, atau sangat berkeadaan (stateful).
:::

## Checklist kesiapan

- [ ] Beban **bergelombang / event-driven** (skala-ke-nol benar-benar menguntungkan).
- [ ] Fungsi **singkat & sebisa mungkin stateless**; keadaan ditaruh di layanan terkelola.
- [ ] **Cold start** dapat ditoleransi untuk jalur yang latensi-sensitif (atau dimitigasi).
- [ ] Ada strategi **pengujian lokal & observability** (tracing terdistribusi).
- [ ] **Keterikatan vendor** dipahami dan dapat diterima; batas eksekusi diperiksa.
- [ ] **Model biaya** diproyeksikan pada volume tinggi berkelanjutan (bisa berbalik lebih mahal).

:::expert
**Lebih dalam.** *Berkeley View* membingkai serverless sebagai pemrograman cloud yang disederhanakan
dengan masalah terbuka: keadaan, latensi, dan portabilitas. Castro et al. (CACM) memberi tinjauan
seimbang; Baldini et al. memetakan tren & masalah. Pola umum: pakai FaaS untuk tepi yang bursty dan
event-driven, dengan inti yang lebih stabil di layanan lain.
:::

## Coba di Advisor

Faktor *scale*, *realtime*, dan *budget* menggeser posisi **Serverless** di D1 — bandingkan dengan
monolith/microservices di radar Advisor.
