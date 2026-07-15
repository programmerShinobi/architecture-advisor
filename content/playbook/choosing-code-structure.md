---
title_id: "Memilih Struktur Kode (D4): Hexagonal, Clean, atau Vertical Slice"
title_en: "Choosing Code Structure (D4): Hexagonal, Clean, or Vertical Slice"
slug: choosing-code-structure
section: playbook
audience: [awam, expert]
summary_tldr_id: "Terlepas dari cara deploy, struktur internal menentukan seberapa mudah kode diuji dan diubah. Hexagonal dan Clean menjaga logika bisnis bebas dari framework/IO. Vertical Slice menata per fitur agar perubahan terlokalisasi. Berlapis itu cepat tapi bisa kusut. Pilih yang menjaga inti tetap dapat diuji tanpa seremoni berlebih."
summary_tldr_en: "Independent of deployment, internal structure governs how easily code is tested and changed. Hexagonal and Clean keep business logic free of frameworks/IO. Vertical Slice organises by feature for change locality. Layered is quick but can tangle. Pick the one that keeps the core testable without excess ceremony."
evidence_strength: strong
last_reviewed: 2026-07-02
review_due: 2027-07-02
translation_status: id+en
related_advisor:
  dimensions: [D4]
  options: [hexagonal, clean, vertical-slice, layered]
sources:
  - { label: "Cockburn — Hexagonal Architecture (Ports & Adapters)", venue: "alistair.cockburn.us", year: 2005, url: "https://alistair.cockburn.us/hexagonal-architecture/" }
  - { label: "Martin — Clean Architecture", venue: "Prentice Hall", year: 2017, url: "https://www.oreilly.com/library/view/clean-architecture-a/9780134494272/" }
  - { label: "Evans — Domain-Driven Design", venue: "Addison-Wesley", year: 2003, url: "https://www.domainlanguage.com/ddd/" }
  - { label: "Bogard — Vertical Slice Architecture", venue: "jimmybogard.com", year: 2018, url: "https://www.jimmybogard.com/vertical-slice-architecture/" }
  - { label: "Fowler — Patterns of Enterprise Application Architecture", venue: "Addison-Wesley", year: 2002, url: "https://martinfowler.com/books/eaa.html" }
status: published
author: Architecture Advisor
---

## What D4 actually governs

D4 is not about how many applications you deploy — it is about **how code is organised inside** one
application, and that determines the cost of change and testability.

:::guided
- **Hexagonal (Ports & Adapters):** fence off the core logic; frameworks & databases become "plugs"
  at the edges. The core is very easy to test.
- **Clean Architecture:** concentric layers with the rule "dependencies point inwards". Same intent
  as hexagonal, more prescriptive.
- **Vertical Slice:** organise by **feature**, not by technical layer — one feature lives in one
  place.
- **Layered:** classic and familiar; can tangle as the domain grows.
:::

## A short guide

- Need a long-lived, framework-free, well-tested core → **Hexagonal** or **Clean**.
- Small team, want changes localised per feature → **Vertical Slice**.
- Small/stable domain, want speed → **Layered** (watch for erosion).

:::expert
**Deeper.** Hexagonal and Clean both enforce that **business rules do not depend on IO/frameworks**
— that is what makes the core unit-testable and durable; DDD supplies the *bounded contexts* this
structure protects. Vertical Slice optimises for how software actually changes (per feature), the
inverse of layered's weakness. Don't impose Clean's ceremony on a small application — the cost can
exceed the benefit.
:::

## Try it in the Advisor

In the Advisor, D4 is scored independently of D1 — see how factors such as *maintainability* and
*testability* boost the options that keep the core clean.

<!-- lang:id -->

## Apa yang sebenarnya diatur D4

D4 bukan tentang berapa banyak aplikasi yang kamu deploy — ia tentang **bagaimana kode diorganisasi di
dalam** satu aplikasi, dan itu menentukan biaya perubahan serta kemampuan uji.

:::guided
- **Hexagonal (Ports & Adapters):** pagari logika inti; framework & basis data menjadi "colokan" di
  tepian. Intinya sangat mudah diuji.
- **Clean Architecture:** lapisan konsentris dengan aturan "dependensi mengarah ke dalam". Maksud yang
  sama dengan hexagonal, lebih preskriptif.
- **Vertical Slice:** susun berdasarkan **fitur**, bukan lapisan teknis — satu fitur berada di satu tempat.
- **Layered:** klasik dan familiar; bisa kusut saat domain tumbuh.
:::

## Panduan singkat

- Butuh inti yang berumur panjang, bebas-framework, teruji baik → **Hexagonal** atau **Clean**.
- Tim kecil, ingin perubahan terlokalisasi per fitur → **Vertical Slice**.
- Domain kecil/stabil, ingin kecepatan → **Layered** (waspadai erosi).

:::expert
**Lebih dalam.** Hexagonal dan Clean sama-sama menegakkan bahwa **aturan bisnis tak bergantung pada
IO/framework** — itulah yang membuat inti dapat di-unit-test dan tahan lama; DDD menyuplai *bounded
context* yang dilindungi struktur ini. Vertical Slice mengoptimalkan cara perangkat lunak sebenarnya
berubah (per fitur), kebalikan dari kelemahan layered. Jangan paksakan seremoni Clean pada aplikasi
kecil — biayanya bisa melebihi manfaatnya.
:::

## Coba di Advisor

Di Advisor, D4 dinilai secara independen dari D1 — lihat bagaimana faktor seperti *maintainability* dan
*testability* mengangkat opsi yang menjaga inti tetap bersih.
