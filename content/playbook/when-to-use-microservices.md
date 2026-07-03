---
title_id: "Kapan (dan Kapan Tidak) Memakai Microservices"
title_en: "When (and When Not) to Use Microservices"
slug: when-to-use-microservices
section: playbook
audience: [awam, expert]
summary_tldr_id: "Microservices membayar dividen pada organisasi besar dengan bagian yang skalanya benar-benar berbeda dan DevOps yang matang. Untuk kebanyakan tim, mulailah dengan monolith (atau modular monolith) dan ekstrak layanan hanya saat batasnya terbukti. Distribusi dini adalah kesalahan yang mahal."
summary_tldr_en: "Microservices pay off for large organisations with parts that genuinely scale differently and mature DevOps. For most teams, start monolithic (or modular-monolith) and extract services only once boundaries are proven. Premature distribution is a costly mistake."
evidence_strength: strong
last_reviewed: 2026-07-02
review_due: 2027-07-02
translation_status: id
related_advisor:
  dimensions: [D1]
  options: [monolith, modular-monolith, microservices, serverless]
sources:
  - { label: "Fowler — MonolithFirst", venue: "martinfowler.com", year: 2015, url: "https://martinfowler.com/bliki/MonolithFirst.html" }
  - { label: "Newman — Building Microservices, 2nd ed.", venue: "O'Reilly", year: 2021, url: "https://www.oreilly.com/library/view/building-microservices-2nd/9781492034018/" }
  - { label: "Dragoni et al. — Microservices: Yesterday, Today, and Tomorrow", venue: "Springer", year: 2017, url: "https://doi.org/10.1007/978-3-319-67425-4_12" }
  - { label: "Soldani et al. — The pains and gains of microservices", venue: "Journal of Systems and Software", year: 2018, url: "https://doi.org/10.1016/j.jss.2018.09.082" }
  - { label: "Bogner et al. — Microservices in Industry", venue: "IEEE ICSA-C", year: 2019, url: "https://doi.org/10.1109/ICSA-C.2019.00041" }
status: published
author: Architecture Advisor
---

## Godaan dan jebakannya

Microservices sering dipilih karena tren, bukan kebutuhan. Padahal manfaatnya **bersyarat** — dan
biayanya nyata sejak hari pertama.

:::guided
**Kapan cocok:** organisasi besar/terdistribusi; bagian-bagian yang benar-benar butuh skala berbeda;
tim yang sudah punya otomasi, observability, dan DevOps matang.

**Kapan sebaiknya tidak:** produk awal, tim kecil, domain yang belum stabil. Di sini monolith atau
**modular monolith** biasanya lebih cepat dan lebih murah.
:::

## Aturan praktis

1. **Mulai monolitik.** Buktikan produk dan temukan batas domainnya dulu.
2. **Tegakkan batas modul** (modular monolith) di dalam satu proses.
3. **Ekstrak layanan** hanya saat ada kebutuhan nyata: skala independen, deploy independen, atau tim
   independen — sepanjang *bounded context*, memakai Strangler Fig.
4. **Ukur biayanya:** jaringan, konsistensi eventual, tracing, dan operasional.

:::expert
**Lebih dalam.** Survei (Dragoni et al.) dan tinjauan sistematis (Soldani et al.) menunjukkan manfaat
microservices bergantung pada kematangan organisasi; keluhan teratas konsisten: kompleksitas
operasional dan konsistensi data. Studi industri (Bogner et al.) mencatat dampak beragam pada
maintainability. Hukum Conway berlaku: batas layanan cenderung mengikuti batas tim — rancang keduanya
bersama.
:::

## Coba di Advisor

Faktor *scale*, *team*, dan *devops* di Advisor menggeser D1 — lihat apakah microservices benar-benar
unggul untuk skenariomu, atau justru modular monolith.
