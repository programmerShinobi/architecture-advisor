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
translation_status: id+en
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

## The law

> *"Any organization that designs a system … is constrained to produce a design whose structure is a
> copy of the organization's communication structure."* — Mel Conway, 1968

Not just a slogan: the *mirroring hypothesis* study (MacCormack et al.) found that products from
loosely-coupled organizations really are more modular than products from tightly-coupled ones.

:::guided
**An analogy:** if three teams build one house without talking to each other, you get a house with
three kitchen styles. Software is the same: service boundaries quietly follow the boundaries of who
talks to whom.
:::

## Use it in both directions

- **Diagnosis:** a "messy" architecture is often a mirror of the communication structure — fixing
  the code without fixing the teams only postpones the relapse.
- **Inverse Conway Maneuver:** decide the target architecture first, then **shape the teams along
  those boundaries** — a team per bounded context yields a service per bounded context.

## The Team Topologies vocabulary (2019)

| Team type | Role |
|---|---|
| **Stream-aligned** | owns one end-to-end stream of value (the majority of teams) |
| **Platform** | provides self-service internal services so stream-aligned teams move fast |
| **Enabling** | teaches/transfers a capability, then leaves |
| **Complicated-subsystem** | owns a part that needs rare expertise |

Plus three interaction modes: *collaboration*, *X-as-a-service*, *facilitating* — chosen
deliberately, because every permanent collaboration is organizational coupling (and, per Conway,
will become system coupling).

:::expert
**Deeper.** This is why the **team/distribution** factors move D1 in the Advisor: microservices
"work" when service boundaries = the boundaries of stream-aligned teams with the right *cognitive
load* — not the other way round. Architectural symptoms of the wrong topology: services always
released together (hidden team coupling), a platform that becomes a ticket bottleneck (not
self-service), and micro-frontends without genuinely separate UI teams. For small organizations the
conclusion is calming: one team → one deployable (a modular monolith) is not a compromise — it is
Conway's Law working in your favour.
:::

## Try it in the Advisor

Change the **team size** and **team distribution** factors in the Advisor and watch D1/D5 shift —
that is Conway's Law being computed.

<!-- lang:id -->

## Hukumnya

> *"Organisasi mana pun yang merancang sebuah sistem … terpaksa menghasilkan desain yang strukturnya
> merupakan salinan struktur komunikasi organisasi itu."* — Mel Conway, 1968

Bukan sekadar slogan: studi *mirroring hypothesis* (MacCormack dkk.) menemukan bahwa produk dari organisasi
berkopling-longgar memang lebih modular daripada produk dari organisasi berkopling-ketat.

:::guided
**Sebuah analogi:** jika tiga tim membangun satu rumah tanpa saling bicara, kamu mendapat rumah dengan tiga
gaya dapur. Perangkat lunak sama saja: batas layanan diam-diam mengikuti batas siapa berbicara dengan siapa.
:::

## Pakai dalam dua arah

- **Diagnosis:** arsitektur yang "berantakan" sering merupakan cermin struktur komunikasi — memperbaiki kode
  tanpa memperbaiki tim hanya menunda kambuhnya.
- **Inverse Conway Maneuver:** tentukan arsitektur target lebih dulu, lalu **bentuk tim sepanjang batas
  tersebut** — satu tim per bounded context menghasilkan satu layanan per bounded context.

## Kosakata Team Topologies (2019)

| Jenis tim | Peran |
|---|---|
| **Stream-aligned** | memiliki satu aliran nilai ujung-ke-ujung (mayoritas tim) |
| **Platform** | menyediakan layanan internal swalayan agar tim stream-aligned bergerak cepat |
| **Enabling** | mengajarkan/mentransfer suatu kapabilitas, lalu pergi |
| **Complicated-subsystem** | memiliki bagian yang butuh keahlian langka |

Plus tiga mode interaksi: *collaboration*, *X-as-a-service*, *facilitating* — dipilih secara sengaja, karena
setiap kolaborasi permanen adalah kopling organisasi (dan, menurut Conway, akan menjadi kopling sistem).

:::expert
**Lebih dalam.** Inilah alasan faktor **team/distribution** menggeser D1 di Advisor: microservices "bekerja"
saat batas layanan = batas tim stream-aligned dengan *cognitive load* yang tepat — bukan sebaliknya. Gejala
arsitektur dari topologi yang salah: layanan yang selalu dirilis bersama (kopling tim tersembunyi), platform
yang menjadi bottleneck tiket (bukan swalayan), dan micro-frontend tanpa tim UI yang benar-benar terpisah.
Untuk organisasi kecil, kesimpulannya menenangkan: satu tim → satu deployable (modular monolith) bukan
kompromi — itu Hukum Conway bekerja untuk keuntunganmu.
:::

## Coba di Advisor

Ubah faktor **ukuran tim** dan **sebaran tim** di Advisor dan lihat D1/D5 bergeser — itulah Hukum Conway yang
sedang dihitung.
