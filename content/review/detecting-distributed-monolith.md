---
title_id: "Mendeteksi 'Distributed Monolith' Sebelum Ia Menyakitimu"
title_en: "Detecting the 'Distributed Monolith' Before It Hurts You"
slug: detecting-distributed-monolith
section: review
audience: [awam, expert]
summary_tldr_id: "Distributed monolith adalah kegagalan microservices paling klasik: layanan yang terpisah tetapi harus dideploy bersama — membayar seluruh biaya sistem terdistribusi tanpa satu pun manfaatnya. Kenali tandanya lewat basis data bersама, deploy yang terkopling, dan komunikasi sinkron yang berantai."
summary_tldr_en: "A distributed monolith is microservices' most classic failure: services that are split yet must deploy together — paying all the cost of a distributed system for none of its benefits. Spot it via a shared database, coupled deploys, and chatty synchronous chains."
evidence_strength: strong
last_reviewed: 2026-07-02
review_due: 2027-07-02
translation_status: id
related_advisor:
  dimensions: [D1, D3]
  options: [microservices, single-db]
sources:
  - { label: "Taibi & Lenarduzzi — On the Definition of Microservice Bad Smells", venue: "IEEE Software", year: 2018, url: "https://doi.org/10.1109/MS.2018.2141031" }
  - { label: "Taibi, Lenarduzzi & Pahl — Architectural Patterns for Microservices", venue: "CLOSER", year: 2018, url: "https://doi.org/10.5220/0006798302210232" }
  - { label: "Newman — Building Microservices, 2nd ed.", venue: "O'Reilly", year: 2021, url: "https://www.oreilly.com/library/view/building-microservices-2nd/9781492034018/" }
status: published
author: Architecture Advisor
---

## Kenapa ini penting

Banyak tim memecah monolith menjadi "microservices", lalu heran mengapa segalanya jadi lebih sulit,
bukan lebih mudah. Biasanya penyebabnya sama: mereka membangun **monolit terdistribusi**.

:::guided
**Analogi sederhana:** kamu memisahkan dapur, ruang tamu, dan kamar ke gedung berbeda — tetapi semua
tetap berbagi satu saklar listrik dan satu pintu. Sekarang kamu punya semua kerumitan gedung
terpisah, tanpa satu pun kebebasannya.
:::

## Checklist tanda bahaya

- [ ] Beberapa layanan **berbagi satu basis data** (atau tabel yang sama).
- [ ] Satu perubahan sering **memaksa beberapa layanan dideploy bersama**.
- [ ] Alur umum berupa **rantai panggilan sinkron** yang panjang antar layanan.
- [ ] Layanan **tidak bisa dirilis atau diskalakan sendiri-sendiri**.
- [ ] Tim harus berkoordinasi ketat untuk hampir setiap perubahan.

Semakin banyak yang tercentang, semakin besar kemungkinan kamu punya distributed monolith.

:::expert
**Lebih dalam.** Akar penyebab tersembunyi paling lazim adalah **basis data bersama** — ia diam-diam
mengopling ulang layanan yang seharusnya independen. Perbaikannya: pisahkan kepemilikan data
(*database-per-service*), ganti transaksi lintas-layanan dengan **saga** + **transactional outbox**,
dan kurangi rantai sinkron dengan peristiwa asinkron. Taibi & Lenarduzzi memberi definisi *bad smell*
yang bisa diuji; secara empiris, distributed monolith konsisten muncul sebagai anti-pola teratas.
:::

## Coba di Advisor

**Advisor** menandai kombinasi ini lewat **peringatan anti-pattern** (mis. microservices di atas satu
basis data bersama). Uji skenariomu dan lihat apakah peringatan itu muncul.
