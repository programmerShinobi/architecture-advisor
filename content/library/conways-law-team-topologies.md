---
title_id: "Hukum Conway & Team Topologies: Arsitektur Mengikuti Struktur Tim"
title_en: "Conway's Law & Team Topologies: Architecture Follows Team Structure"
slug: conways-law-team-topologies
section: library
audience: [awam, expert]
summary_tldr_id: "Sistem cenderung meniru struktur komunikasi organisasi yang membuatnya (Hukum Conway, 1968) — dan riset empiris mendukungnya. Konsekuensinya bisa dipakai dua arah: rancang tim seperti arsitektur yang kamu inginkan ('Inverse Conway Maneuver'). Team Topologies memberi kosakata praktisnya: stream-aligned, platform, enabling, complicated-subsystem."
summary_tldr_en: "Systems tend to mirror the communication structure of the organization that builds them (Conway's Law, 1968) — and empirical research backs it. You can use it in reverse: shape teams like the architecture you want (the 'Inverse Conway Maneuver'). Team Topologies supplies the practical vocabulary: stream-aligned, platform, enabling, complicated-subsystem."
evidence_strength: moderate
last_reviewed: 2026-07-05
review_due: 2027-07-05
translation_status: id
related_advisor:
  dimensions: [D1, D5]
  options: [microservices, modular-monolith, micro-frontends]
sources:
  - { label: "Conway — How Do Committees Invent?", venue: "Datamation", year: 1968, url: "https://www.melconway.com/Home/Committees_Paper.html" }
  - { label: "Skelton & Pais — Team Topologies: Organizing Business and Technology Teams for Fast Flow", venue: "IT Revolution", year: 2019, url: "https://teamtopologies.com/book" }
  - { label: "MacCormack, Baldwin & Rusnak — Exploring the Duality between Product and Organizational Architectures (the 'mirroring' hypothesis)", venue: "Research Policy", year: 2012, url: "https://doi.org/10.1016/j.respol.2012.04.011" }
  - { label: "Bass, Clements & Kazman — Software Architecture in Practice, 4th ed.", venue: "Addison-Wesley (SEI)", year: 2021, url: "https://www.oreilly.com/library/view/software-architecture-in/9780136885979/" }
status: published
author: Architecture Advisor
---

## Hukumnya

> *"Organisasi yang merancang sistem … dibatasi untuk menghasilkan desain yang meniru struktur
> komunikasi organisasi itu."* — Mel Conway, 1968

Bukan slogan: studi *mirroring hypothesis* (MacCormack dkk.) menemukan produk dari organisasi yang
longgar-terkopling memang lebih modular daripada produk dari organisasi yang rapat-terkopling.

:::guided
**Analogi:** kalau tiga tim membangun satu rumah tanpa saling bicara, hasilnya rumah dengan tiga
gaya dapur. Software sama: batas layanan diam-diam mengikuti batas obrolan tim.
:::

## Dipakai dua arah

- **Diagnosis:** arsitektur "berantakan" sering kali cermin struktur komunikasi — memperbaiki kode
  tanpa memperbaiki tim hanya menunda kambuh.
- **Inverse Conway Maneuver:** tentukan dulu arsitektur target, lalu **susun tim mengikuti batas
  itu** — tim per bounded context menghasilkan layanan per bounded context.

## Kosakata Team Topologies (2019)

| Jenis tim | Peran |
|---|---|
| **Stream-aligned** | memiliki satu alur nilai ujung-ke-ujung (mayoritas tim) |
| **Platform** | menyediakan layanan internal self-service agar stream-aligned cepat |
| **Enabling** | melatih/menularkan kemampuan, lalu pergi |
| **Complicated-subsystem** | memiliki bagian yang butuh keahlian langka |

Plus tiga mode interaksi: *collaboration*, *X-as-a-service*, *facilitating* — dipilih sadar, karena
setiap kolaborasi permanen adalah kopling organisasi (dan, per Conway, akan jadi kopling sistem).

:::expert
**Lebih dalam.** Inilah alasan faktor **team/distribution** menggerakkan D1 di Advisor: microservices
"berhasil" ketika batas layanan = batas tim stream-aligned dengan *cognitive load* yang pas — bukan
sebaliknya. Gejala arsitektural dari topologi yang salah: layanan yang selalu dirilis bersama
(kopling tim tersembunyi), platform yang jadi bottleneck tiket (bukan self-service), dan
micro-frontends tanpa tim UI yang benar-benar terpisah. Untuk organisasi kecil, kesimpulannya
menenangkan: satu tim → satu deployable (modular monolith) bukan kompromi, melainkan Conway yang
sedang berpihak padamu.
:::

## Coba di Advisor

Ubah faktor **ukuran tim** dan **distribusi tim** di Advisor lalu perhatikan D1/D5 bergeser — itulah
Hukum Conway yang sedang dihitung.
