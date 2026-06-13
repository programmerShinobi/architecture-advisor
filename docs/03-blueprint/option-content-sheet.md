# Architecture Advisor — Option Content Sheet (EN · ID)

**Blueprint Phase · Educational Content Appendix**

| Field | Detail |
|---|---|
| **Document type** | Option Content Sheet (the user-facing educational copy for every option) |
| **Version** | 0.1 |
| **Date** | 2026-06-13 |
| **Status** | Baseline copy — pending Translator & Domain-Advisor review (Charter Section 14.2) |
| **Author / Owner** | Faqih Pratama Muhti, B.Sc. Computer Science |
| **Audience** | Engineers building `config/dimensions.ts`, `config/antiPatterns.ts`, `config/fitnessFunctions.ts`; reviewers |
| **Derived from** | [Build Spec v3](../specs/build-spec-v3.md) Sections 7, 9–11 · [Model Data Sheet](model-data-sheet.md) |
| **License** | [CC BY 4.0](../../LICENSE-docs.md) |

**Document history**

| Version | Date | Summary |
|---|---|---|
| 0.1 | 2026-06-13 | Authored the full bilingual educational metadata for all 21 options (definition, pros/cons, when to use/avoid, real-world pattern, common mistakes, risks + mitigations, learn-more links), the 7 anti-pattern messages, and the 12 fitness-function templates |

---

## How this sheet is used

[Build Spec v3 Section 7](../specs/build-spec-v3.md) requires every option to carry balanced,
bilingual educational metadata — *"this content is a primary reason a professional would trust
the tool."* This sheet is that content, mapped 1:1 to `config/dimensions.ts` (per option:
`definition`, `pros`, `cons`, `whenToUse`, `whenToAvoid`, `realWorldPattern`, `commonMistakes`,
`learnMore`, `risks`), `config/antiPatterns.ts` (messages), and `config/fitnessFunctions.ts`
(templates). The numeric `qaFit` values live in the [Model Data Sheet](model-data-sheet.md);
this sheet carries only words. Lists use `·` separators; each maps to one array entry. Every
*learn more* link is a canonical, stable source and is **language-neutral** (one link list serves
both languages — hence the `—` in its ID column). Risks are written `(likelihood/impact) risk →
mitigation`.

---

## 1. D1 — Deployment Granularity

### `layered` — Layered / N-Tier

| Field | EN | ID |
|---|---|---|
| Definition | Splits the deployable into horizontal tiers (presentation, business, data) that can run on separate machines. The classic enterprise default — simple to reason about and easy to staff for. | Memecah aplikasi menjadi lapisan horizontal (presentasi, bisnis, data) yang dapat berjalan di mesin terpisah. Standar klasik enterprise — mudah dipahami dan mudah mencari SDM-nya. |
| Pros | Well understood by almost every developer · clear separation of technical concerns · strong consistency with one database | Dipahami hampir semua developer · pemisahan urusan teknis yang jelas · konsistensi kuat dengan satu database |
| Cons | Tiers scale together, not per feature · changes often touch every layer · coupling creeps between layers over time | Skala naik per lapisan, bukan per fitur · perubahan sering menyentuh semua lapisan · keterikatan antarlapisan merambat seiring waktu |
| When to use | CRUD-heavy business applications · small-to-medium teams · strong-consistency needs | Aplikasi bisnis yang didominasi CRUD · tim kecil–menengah · kebutuhan konsistensi kuat |
| When to avoid | Very high or spiky traffic · many independent teams · feature-level scaling needs | Trafik sangat tinggi atau melonjak-lonjak · banyak tim independen · kebutuhan skala per fitur |
| Real-world pattern | The common shape of internal enterprise systems and admin applications. | Bentuk umum sistem internal enterprise dan aplikasi admin. |
| Common mistakes | Business logic leaking into the presentation or data layer · one giant "service" layer · scaling the whole stack for one hot path | Logika bisnis bocor ke lapisan presentasi/data · satu lapisan "service" raksasa · menskalakan seluruh tumpukan demi satu jalur panas |
| Risks | (Med/Med) layer coupling slows change → enforce layer contracts with architecture tests · (Low/High) the single database becomes the bottleneck → plan read replicas and caching early | (Sedang/Sedang) keterikatan lapisan memperlambat perubahan → tegakkan kontrak lapisan dengan architecture test · (Rendah/Tinggi) database tunggal jadi leher botol → siapkan read replica dan cache sejak awal |
| Learn more | [Azure Architecture Center — N-tier](https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/n-tier) · [Fowler — Presentation Domain Data Layering](https://martinfowler.com/bliki/PresentationDomainDataLayering.html) | — |

### `monolith` — Monolith

| Field | EN | ID |
|---|---|---|
| Definition | One deployable unit containing all features, sharing one process and one database. The fastest path to a first release, and trivially consistent. | Satu unit rilis yang memuat semua fitur, berbagi satu proses dan satu database. Jalur tercepat menuju rilis pertama, dan konsisten secara alami. |
| Pros | Simplest operations — one thing to deploy and monitor · easy local development and end-to-end tests · lowest cost at small scale | Operasional paling sederhana — satu hal untuk dirilis dan dipantau · pengembangan lokal dan tes end-to-end mudah · biaya terendah pada skala kecil |
| Cons | The whole app redeploys for any change · scaling is all-or-nothing · tangles without internal discipline | Seluruh aplikasi dirilis ulang untuk perubahan apa pun · skala naik serba-semua · mudah kusut tanpa disiplin internal |
| When to use | MVPs and small teams · unclear domain boundaries · tight budget or deadline | MVP dan tim kecil · batas domain belum jelas · anggaran atau tenggat ketat |
| When to avoid | Multiple teams shipping independently · very large scale · parts with wildly different load | Banyak tim rilis secara independen · skala sangat besar · bagian-bagian dengan beban sangat berbeda |
| Real-world pattern | The typical starting point of successful products that split up later. | Titik awal yang lazim bagi produk sukses yang belakangan dipecah. |
| Common mistakes | Skipping module boundaries because "it's just a monolith" · letting the database schema become the integration point · the reverse mistake: splitting prematurely | Mengabaikan batas modul karena "cuma monolith" · membiarkan skema database jadi titik integrasi · kesalahan sebaliknya: memecah terlalu dini |
| Risks | (Med/Med) becomes a big ball of mud over time → enforce module boundaries and architecture tests · (Med/Low) deploy contention between contributors → trunk-based development with feature flags | (Sedang/Sedang) lama-lama jadi "big ball of mud" → tegakkan batas modul dan architecture test · (Sedang/Rendah) rebutan jadwal rilis → trunk-based development dengan feature flag |
| Learn more | [Fowler — Monolith First](https://martinfowler.com/bliki/MonolithFirst.html) · [microservices.io — Monolithic architecture](https://microservices.io/patterns/monolithic.html) | — |

### `modular-monolith` — Modular Monolith

| Field | EN | ID |
|---|---|---|
| Definition | One deployable, internally split into well-bounded modules with explicit interfaces. Keeps monolith simplicity while preparing clean extraction seams for a later split. | Satu unit rilis yang di dalamnya terbagi menjadi modul-modul berbatas jelas dengan antarmuka eksplisit. Mempertahankan kesederhanaan monolith sambil menyiapkan jahitan ekstraksi yang rapi bila kelak dipecah. |
| Pros | One deploy with near-monolith operating cost · enforced internal boundaries · strong consistency preserved | Satu rilis dengan biaya operasional setara monolith · batas internal yang ditegakkan · konsistensi kuat tetap terjaga |
| Cons | Boundary discipline needs tooling and review · still one runtime and one scaling unit · module boundaries can be wrong too | Disiplin batas butuh tooling dan review · tetap satu runtime dan satu unit skala · batas modul pun bisa keliru |
| When to use | Complex domains with one team-of-teams · a likely future split · regulated systems needing consistency | Domain kompleks dengan satu tim besar · kemungkinan dipecah di masa depan · sistem teregulasi yang butuh konsistensi |
| When to avoid | Trivial, short-lived apps (the structure does not pay back) · genuinely independent products | Aplikasi sepele berumur pendek (strukturnya tidak balik modal) · produk-produk yang memang independen |
| Real-world pattern | The recommended stepping stone between a monolith and services. | Batu loncatan yang dianjurkan antara monolith dan services. |
| Common mistakes | Modules sharing tables · a "module" that is only a folder without an enforced API · extracting modules before boundaries stabilize | Antarmodul berbagi tabel · "modul" yang hanya folder tanpa API yang ditegakkan · mengekstrak modul sebelum batasnya stabil |
| Risks | (Med/Med) boundary erosion → dependency rules enforced in CI · (Low/Med) one shared failure domain → bulkheads and timeouts inside the process | (Sedang/Sedang) erosi batas modul → aturan dependensi ditegakkan di CI · (Rendah/Sedang) satu domain kegagalan bersama → bulkhead dan timeout di dalam proses |
| Learn more | [Fowler — Monolith First](https://martinfowler.com/bliki/MonolithFirst.html) | — |

### `microservices` — Microservices

| Field | EN | ID |
|---|---|---|
| Definition | Many small, independently deployable services, each owning its own data, communicating over the network. Optimizes team autonomy, release independence, and scaling — at a high operational price. | Banyak layanan kecil yang dirilis secara independen, masing-masing memiliki datanya sendiri, dan berkomunikasi lewat jaringan. Mengoptimalkan otonomi tim, kebebasan rilis, dan skala — dengan harga operasional yang tinggi. |
| Pros | Independent deploys and scaling per service · clear team ownership · fault isolation between services | Rilis dan skala independen per layanan · kepemilikan tim yang jelas · isolasi kegagalan antarlayanan |
| Cons | Distributed-system complexity: latency, partial failure · eventual consistency between services · a much heavier platform and operations bill | Kompleksitas sistem terdistribusi: latensi, kegagalan parsial · konsistensi eventual antarlayanan · beban platform dan operasional yang jauh lebih berat |
| When to use | Many teams shipping in parallel · high or spiky scale · mature CI/CD and observability | Banyak tim rilis paralel · skala tinggi atau melonjak · CI/CD dan observability yang matang |
| When to avoid | A small team or low DevOps maturity · strong cross-entity consistency requirements · MVPs | Tim kecil atau kematangan DevOps rendah · kebutuhan konsistensi kuat lintas entitas · MVP |
| Real-world pattern | Large consumer platforms with dozens of independent teams. | Platform konsumen besar dengan puluhan tim independen. |
| Common mistakes | Splitting by nouns instead of bounded contexts · sharing one database (a distributed monolith) · long synchronous call chains · skipping the platform investment | Memecah berdasarkan kata benda alih-alih bounded context · berbagi satu database (distributed monolith) · rantai panggilan sinkron yang panjang · melewatkan investasi platform |
| Risks | (High/High) operational complexity outpaces the team → start with a modular monolith and invest in the platform first · (Med/High) cross-service data inconsistency → sagas/outbox and contract tests | (Tinggi/Tinggi) kompleksitas operasional melampaui kemampuan tim → mulai dari modular monolith dan investasikan platform dulu · (Sedang/Tinggi) data tidak konsisten antarlayanan → pola saga/outbox dan contract test |
| Learn more | [Lewis & Fowler — Microservices](https://martinfowler.com/articles/microservices.html) · S. Newman, *Building Microservices*, 2nd ed. | — |

### `serverless` — Serverless (FaaS)

| Field | EN | ID |
|---|---|---|
| Definition | Functions run on demand on managed infrastructure; you pay per invocation and never manage servers. Excellent elasticity for event-shaped, bursty workloads. | Fungsi berjalan sesuai permintaan di infrastruktur terkelola; Anda membayar per pemanggilan dan tidak pernah mengurus server. Elastisitas yang sangat baik untuk beban kerja berbentuk event dan melonjak-lonjak. |
| Pros | Zero server operations · scales to zero (cost) and up to bursts · fast time-to-market for event-driven features | Tanpa operasional server · skala turun ke nol (hemat) dan naik saat lonjakan · cepat dirilis untuk fitur berbasis event |
| Cons | Cold starts and execution limits · vendor lock-in · harder local testing and debugging · cost surprises under constant heavy load | Cold start dan batas eksekusi · keterikatan vendor · pengujian dan debugging lokal lebih sulit · biaya bisa membengkak pada beban konstan yang berat |
| When to use | Spiky or irregular load · glue code and event processing · small teams without platform engineers | Beban melonjak atau tidak teratur · kode perekat dan pemrosesan event · tim kecil tanpa platform engineer |
| When to avoid | Latency-critical constant traffic · long-running jobs · strict portability requirements | Trafik konstan yang kritis latensi · pekerjaan berdurasi panjang · kebutuhan portabilitas ketat |
| Real-world pattern | APIs, schedulers, and media or event pipelines on public clouds. | API, penjadwal, dan pipeline media/event di cloud publik. |
| Common mistakes | Chatty synchronous function-to-function calls · no module boundaries between functions · ignoring cold-start budgets on hot paths | Panggilan sinkron antarfungsi yang terlalu cerewet · tanpa batas modul antarfungsi · mengabaikan anggaran cold-start di jalur panas |
| Risks | (Med/Med) vendor lock-in → abstract handlers and use infrastructure-as-code · (Med/Med) cold-start latency → provisioned concurrency for latency-critical paths | (Sedang/Sedang) keterikatan vendor → abstraksikan handler dan pakai infrastructure-as-code · (Sedang/Sedang) latensi cold-start → provisioned concurrency untuk jalur kritis latensi |
| Learn more | [Roberts — Serverless Architectures](https://martinfowler.com/articles/serverless.html) | — |

---

## 2. D2 — Communication Style

### `synchronous` — Synchronous (request/response)

| Field | EN | ID |
|---|---|---|
| Definition | Callers wait for an immediate answer (HTTP/gRPC). The simplest mental model with instant confirmation — but it couples the caller's uptime and latency to the callee's. | Pemanggil menunggu jawaban langsung (HTTP/gRPC). Model berpikir paling sederhana dengan konfirmasi seketika — tetapi mengikat ketersediaan dan latensi pemanggil pada pihak yang dipanggil. |
| Pros | Simple to build and debug · immediate, authoritative answers · natural fit for queries and user interfaces | Mudah dibangun dan di-debug · jawaban langsung dan pasti · cocok alami untuk kueri dan antarmuka pengguna |
| Cons | Cascading failures under load · latency adds up along call chains · tight temporal coupling | Kegagalan berantai saat beban tinggi · latensi menumpuk di sepanjang rantai panggilan · keterikatan waktu yang ketat |
| When to use | CRUD APIs · user-facing queries · low fan-out interactions | API CRUD · kueri yang dihadapi pengguna · interaksi dengan percabangan rendah |
| When to avoid | Long service chains at scale · slow downstream work (send it to the background instead) | Rantai layanan panjang pada skala besar · pekerjaan hilir yang lambat (kirim ke latar belakang saja) |
| Real-world pattern | The default style of most internal and public APIs. | Gaya bawaan sebagian besar API internal dan publik. |
| Common mistakes | Deep synchronous chains (A→B→C→D) · no timeouts, retries, or circuit breakers · doing heavy work synchronously | Rantai sinkron yang dalam (A→B→C→D) · tanpa timeout, retry, atau circuit breaker · mengerjakan tugas berat secara sinkron |
| Risks | (Med/High) cascading failure at scale → circuit breakers, timeouts, bulkheads · (Low/Med) latency stacking → collapse hops and cache aggressively | (Sedang/Tinggi) kegagalan berantai pada skala besar → circuit breaker, timeout, bulkhead · (Rendah/Sedang) latensi menumpuk → pangkas lompatan dan manfaatkan cache |
| Learn more | [microservices.io — Remote Procedure Invocation](https://microservices.io/patterns/communication-style/rpi.html) | — |

### `async-messaging` — Async messaging

| Field | EN | ID |
|---|---|---|
| Definition | Components leave messages in queues; consumers process them at their own pace. Decouples availability and absorbs load spikes; replies become eventual. | Komponen menitipkan pesan di antrean; konsumen memprosesnya dengan kecepatannya sendiri. Memisahkan ketersediaan dan menyerap lonjakan beban; balasan menjadi eventual. |
| Pros | Buffering smooths traffic spikes · sender and receiver fail independently · natural retry semantics | Penyangga meratakan lonjakan trafik · pengirim dan penerima gagal secara independen · semantik retry yang alami |
| Cons | Eventual consistency · duplication and ordering concerns · more infrastructure to run | Konsistensi eventual · isu duplikasi dan urutan pesan · infrastruktur tambahan untuk dikelola |
| When to use | Background jobs · system integrations · load leveling | Pekerjaan latar belakang · integrasi antarsistem · pemerataan beban |
| When to avoid | The user needs an instant, authoritative answer | Pengguna butuh jawaban seketika dan pasti |
| Real-world pattern | Order processing and notification pipelines. | Pemrosesan pesanan dan pipeline notifikasi. |
| Common mistakes | Non-idempotent consumers · unbounded queues hiding overload · treating the broker as a database | Konsumen tidak idempoten · antrean tanpa batas yang menyembunyikan kelebihan beban · memperlakukan broker sebagai database |
| Risks | (Med/Med) poison messages and backlog → dead-letter queues and lag alerts · (Med/Med) duplicate processing → idempotent consumers | (Sedang/Sedang) pesan beracun dan penumpukan → dead-letter queue dan alarm keterlambatan · (Sedang/Sedang) pemrosesan ganda → konsumen idempoten |
| Learn more | [microservices.io — Messaging](https://microservices.io/patterns/communication-style/messaging.html) · [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com) | — |

### `event-driven` — Event-driven (pub/sub)

| Field | EN | ID |
|---|---|---|
| Definition | Producers publish facts ("order placed"); any number of consumers react independently. Maximum decoupling and scalability — while consistency becomes eventual and flows get harder to trace. | Produsen menerbitkan fakta ("pesanan dibuat"); berapa pun konsumen bereaksi secara independen. Pemisahan dan skalabilitas maksimum — sementara konsistensi menjadi eventual dan alur lebih sulit ditelusuri. |
| Pros | Producers need not know consumers — easy to extend · excellent scalability and resilience · events double as an audit-friendly record | Produsen tak perlu mengenal konsumen — mudah diperluas · skalabilitas dan ketahanan sangat baik · event sekaligus menjadi rekam jejak yang ramah audit |
| Cons | Eventual consistency · workflow visibility and debugging are hard · schema evolution requires discipline | Konsistensi eventual · visibilitas alur dan debugging sulit · evolusi skema butuh disiplin |
| When to use | Many reactions to one fact · high fan-out at scale | Banyak reaksi atas satu fakta · percabangan tinggi pada skala besar |
| When to avoid | Strongly consistent flows · simple applications (overkill) | Alur yang butuh konsistensi kuat · aplikasi sederhana (berlebihan) |
| Real-world pattern | Checkout fan-out: inventory, email, and analytics all react to one event. | Percabangan checkout: inventori, email, dan analitik bereaksi atas satu event. |
| Common mistakes | Commands disguised as events · relying on ordering across topics · no schema registry or versioning | Perintah yang menyamar sebagai event · mengandalkan urutan lintas topik · tanpa registri atau versi skema |
| Risks | (Med/High) invisible coupling through events → an event catalog and distributed tracing · (Med/Med) consumer lag → monitor offsets and autoscale consumers | (Sedang/Tinggi) keterikatan tak terlihat lewat event → katalog event dan distributed tracing · (Sedang/Sedang) konsumen tertinggal → pantau offset dan autoscale konsumen |
| Learn more | [Fowler — What do you mean by "Event-Driven"?](https://martinfowler.com/articles/201701-event-driven.html) | — |

### `streaming` — Streaming

| Field | EN | ID |
|---|---|---|
| Definition | Continuous flows of records processed in near real time over a durable log. Built for high-throughput telemetry and analytics — the heaviest communication style to operate. | Aliran rekaman berkelanjutan yang diproses hampir real time di atas log tahan lama. Dibangun untuk telemetri dan analitik bervolume tinggi — gaya komunikasi paling berat untuk dioperasikan. |
| Pros | Highest throughput · real-time processing with replay · consumers decoupled from producers and from each other | Throughput tertinggi · pemrosesan real-time dengan kemampuan replay · konsumen terpisah dari produsen dan satu sama lain |
| Cons | Complex operations: partitions, retention, state stores · eventual consistency · steep learning curve | Operasional kompleks: partisi, retensi, penyimpanan state · konsistensi eventual · kurva belajar terjal |
| When to use | IoT and telemetry · clickstreams · real-time analytics | IoT dan telemetri · clickstream · analitik real-time |
| When to avoid | Simple request/response products · small data volumes | Produk request/response sederhana · volume data kecil |
| Real-world pattern | Sensor and activity pipelines feeding live dashboards. | Pipeline sensor dan aktivitas yang mengalir ke dasbor langsung. |
| Common mistakes | Using a stream where a queue suffices · ignoring partition keys (hot partitions) · unbounded state stores | Memakai stream padahal antrean cukup · mengabaikan kunci partisi (partisi panas) · penyimpanan state tanpa batas |
| Risks | (Med/High) operational burden → managed streaming services first · (Med/Med) reprocessing bugs → idempotent sinks and versioned processors | (Sedang/Tinggi) beban operasional → pakai layanan streaming terkelola dulu · (Sedang/Sedang) bug pemrosesan ulang → sink idempoten dan prosesor berversi |
| Learn more | [Apache Kafka documentation](https://kafka.apache.org/documentation/) · M. Kleppmann, *Designing Data-Intensive Applications*, ch. 11 | — |

---

## 3. D3 — Data Management

### `single-db` — Single shared database

| Field | EN | ID |
|---|---|---|
| Definition | All modules or services read and write one database. The simplest, fully transactional choice — and the biggest coupling point as the system grows. | Semua modul atau layanan membaca dan menulis ke satu database. Pilihan paling sederhana dan sepenuhnya transaksional — sekaligus titik keterikatan terbesar saat sistem tumbuh. |
| Pros | ACID transactions across features · one backup and operations surface · easy joins and reporting | Transaksi ACID lintas fitur · satu permukaan backup dan operasional · join dan pelaporan mudah |
| Cons | The schema couples every team · vertical scaling limits · blocks independent deploys when used across services | Skema mengikat semua tim · batas skala vertikal · menghalangi rilis independen bila dipakai lintas layanan |
| When to use | Monoliths and modular monoliths · strong-consistency domains | Monolith dan modular monolith · domain berkonsistensi kuat |
| When to avoid | Across microservices — it creates a distributed monolith | Lintas microservices — menciptakan distributed monolith |
| Real-world pattern | The standard pairing with a monolithic deployable. | Pasangan standar bagi aplikasi monolitik. |
| Common mistakes | Integration-by-database between services · god schemas owned by no one · sharding before exhausting replicas and caching | Integrasi lewat database antarlayanan · skema raksasa tanpa pemilik · sharding sebelum memaksimalkan replica dan cache |
| Risks | (Low/High) write bottleneck → read replicas, caching, then a partitioning plan · (Med/Med) schema-change contention → migration discipline and ownership | (Rendah/Tinggi) leher botol penulisan → read replica, cache, lalu rencana partisi · (Sedang/Sedang) rebutan perubahan skema → disiplin migrasi dan kepemilikan |
| Learn more | [microservices.io — Shared database](https://microservices.io/patterns/data/shared-database.html) | — |

### `db-per-service` — Database-per-service

| Field | EN | ID |
|---|---|---|
| Definition | Each service owns its data exclusively; others reach it only through the service's API. Unlocks independent deploys and scaling at the price of cross-service consistency. | Setiap layanan memiliki datanya secara eksklusif; pihak lain mengaksesnya hanya lewat API layanan itu. Membuka rilis dan skala independen dengan harga konsistensi lintas layanan. |
| Pros | Real autonomy and independent scaling · failure isolation · fit-for-purpose storage per service | Otonomi nyata dan skala independen · isolasi kegagalan · penyimpanan sesuai kebutuhan per layanan |
| Cons | No cross-service transactions · data duplication and synchronization · more databases to operate | Tanpa transaksi lintas layanan · duplikasi dan sinkronisasi data · lebih banyak database untuk dioperasikan |
| When to use | With microservices and clear bounded contexts | Bersama microservices dan bounded context yang jelas |
| When to avoid | Heavy cross-entity transactions · small systems | Transaksi lintas entitas yang berat · sistem kecil |
| Real-world pattern | The canonical microservices data pattern. | Pola data kanonik untuk microservices. |
| Common mistakes | Reporting via direct cross-database queries · distributed transactions everywhere · one service per table | Pelaporan lewat kueri lintas database secara langsung · transaksi terdistribusi di mana-mana · satu layanan per tabel |
| Risks | (Med/High) cross-service consistency bugs → saga and outbox patterns · (Med/Med) operational sprawl → automate database provisioning | (Sedang/Tinggi) bug konsistensi lintas layanan → pola saga dan outbox · (Sedang/Sedang) operasional meluas → otomatisasi penyediaan database |
| Learn more | [microservices.io — Database per service](https://microservices.io/patterns/data/database-per-service.html) | — |

### `cqrs` — CQRS

| Field | EN | ID |
|---|---|---|
| Definition | Separates the write model from one or more read models, letting each scale and evolve independently. Powerful when read and write loads diverge — with real added complexity. | Memisahkan model tulis dari satu atau lebih model baca, sehingga masing-masing dapat diskalakan dan dikembangkan secara independen. Ampuh saat beban baca dan tulis berbeda jauh — dengan kompleksitas tambahan yang nyata. |
| Pros | Reads scale independently of writes · each model tuned to its purpose · pairs naturally with events | Baca diskalakan terpisah dari tulis · tiap model disetel untuk tujuannya · berpasangan alami dengan event |
| Cons | Two models to maintain · eventual consistency between them · very easy to over-apply | Dua model untuk dirawat · konsistensi eventual di antara keduanya · sangat mudah dipakai berlebihan |
| When to use | Read-heavy systems with complex writes · dashboards over busy transactional cores | Sistem dominan-baca dengan penulisan kompleks · dasbor di atas inti transaksional yang sibuk |
| When to avoid | Simple CRUD — plain models are faster to build and reason about | CRUD sederhana — model biasa lebih cepat dibangun dan dipahami |
| Real-world pattern | Product catalogs and dashboards backed by separate read stores. | Katalog produk dan dasbor yang ditopang penyimpanan baca terpisah. |
| Common mistakes | Applying CQRS app-wide instead of per hot context · no staleness budget for read models · queries sneaking back into the write path | Menerapkan CQRS ke seluruh aplikasi alih-alih per konteks panas · tanpa anggaran kebasian untuk model baca · kueri menyelinap kembali ke jalur tulis |
| Risks | (Med/Med) model drift → contract tests and rebuildable projections · (Med/Low) stale reads confuse users → show data freshness in the UI | (Sedang/Sedang) model saling menyimpang → contract test dan proyeksi yang bisa dibangun ulang · (Sedang/Rendah) data baca basi membingungkan pengguna → tampilkan kesegaran data di UI |
| Learn more | [Fowler — CQRS](https://martinfowler.com/bliki/CQRS.html) | — |

### `event-sourcing` — Event Sourcing

| Field | EN | ID |
|---|---|---|
| Definition | Stores every change as an immutable event; current state is rebuilt by replaying them. Gives a perfect audit trail and time travel — and is among the most demanding patterns to run well. | Menyimpan setiap perubahan sebagai event yang tak dapat diubah; keadaan terkini dibangun ulang dengan memutar ulang event. Memberi jejak audit sempurna dan "perjalanan waktu" — sekaligus salah satu pola paling menuntut untuk dijalankan dengan baik. |
| Pros | Complete audit trail by construction · temporal queries and debugging · natural fit with events and CQRS | Jejak audit lengkap sejak desain · kueri dan debugging lintas waktu · cocok alami dengan event dan CQRS |
| Cons | Event schema evolution is genuinely hard · replay and snapshot engineering · querying requires projections | Evolusi skema event benar-benar sulit · rekayasa replay dan snapshot · kueri membutuhkan proyeksi |
| When to use | Audit-critical domains such as ledgers · genuinely event-native systems | Domain kritis-audit seperti buku besar · sistem yang memang lahir berbasis event |
| When to avoid | Teams new to the pattern · simple domains · MVPs under time pressure | Tim yang baru mengenal polanya · domain sederhana · MVP di bawah tekanan waktu |
| Real-world pattern | Financial ledgers and audit-heavy records. | Buku besar keuangan dan rekaman yang sarat audit. |
| Common mistakes | Events as CRUD diffs instead of domain facts · no event versioning or upcasters · skipping snapshots until replay hurts | Event berupa selisih CRUD alih-alih fakta domain · tanpa versi event atau upcaster · menunda snapshot sampai replay terasa sakit |
| Risks | (Med/High) schema and replay complexity → versioned events, upcasters, snapshots · (Med/Med) projection lag → monitoring and rebuild tooling | (Sedang/Tinggi) kompleksitas skema dan replay → event berversi, upcaster, snapshot · (Sedang/Sedang) proyeksi tertinggal → pemantauan dan perkakas rebuild |
| Learn more | [Fowler — Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html) | — |

### `polyglot` — Polyglot persistence

| Field | EN | ID |
|---|---|---|
| Definition | Uses different storage technologies for different jobs — relational for transactions, a search index, a cache. The best tool per problem, with a multiplied operational surface. | Memakai teknologi penyimpanan berbeda untuk pekerjaan berbeda — relasional untuk transaksi, indeks pencarian, cache. Alat terbaik untuk tiap masalah, dengan permukaan operasional yang berlipat. |
| Pros | Per-workload performance · avoids one-size-fits-none compromises · pairs well with service autonomy | Performa sesuai beban kerja · menghindari kompromi "satu ukuran untuk semua" · cocok dengan otonomi layanan |
| Cons | Many systems to operate, secure, and back up · cross-store consistency work · broader skill requirements | Banyak sistem untuk dioperasikan, diamankan, dan dicadangkan · upaya konsistensi lintas penyimpanan · tuntutan keahlian lebih luas |
| When to use | Clearly divergent data workloads — full-text search vs transactions vs caching | Beban kerja data yang jelas berbeda — pencarian teks penuh vs transaksi vs cache |
| When to avoid | Small teams or tight budgets — one good database goes a long way | Tim kecil atau anggaran ketat — satu database yang baik sudah sangat memadai |
| Real-world pattern | A relational core plus a search index plus a cache. | Inti relasional ditambah indeks pencarian dan cache. |
| Common mistakes | Adopting a new store per feature whim · no owner per store · skipping backups for "secondary" stores | Mengadopsi penyimpanan baru tiap muncul keinginan fitur · tiap penyimpanan tanpa pemilik · melewatkan backup untuk penyimpanan "sekunder" |
| Risks | (Med/Med) operational sprawl → cap the portfolio and manage it centrally · (Med/Med) drift between stores → outbox/CDC synchronization pipelines | (Sedang/Sedang) operasional meluas → batasi portofolio dan kelola terpusat · (Sedang/Sedang) penyimpanan saling menyimpang → pipeline sinkronisasi outbox/CDC |
| Learn more | [Fowler — Polyglot Persistence](https://martinfowler.com/bliki/PolyglotPersistence.html) | — |

---

## 4. D4 — Code Structure

### `hexagonal` — Hexagonal (Ports & Adapters)

| Field | EN | ID |
|---|---|---|
| Definition | Isolates the domain core behind ports; adapters connect the UI, database, and external systems. The core stays testable without any infrastructure. | Mengisolasi inti domain di balik port; adapter menghubungkan UI, database, dan sistem eksternal. Inti tetap dapat diuji tanpa infrastruktur apa pun. |
| Pros | Highly testable core · technology swaps without touching the domain · explicit dependency direction | Inti sangat mudah diuji · ganti teknologi tanpa menyentuh domain · arah dependensi yang eksplisit |
| Cons | More upfront structure and indirection · discipline costs on small features | Struktur dan tak-langsung lebih banyak di awal · disiplin terasa mahal untuk fitur kecil |
| When to use | Complex domains · long-lived systems · integration-heavy edges | Domain kompleks · sistem berumur panjang · tepian yang sarat integrasi |
| When to avoid | Throwaway prototypes under deadline | Prototipe sekali pakai di bawah tenggat |
| Real-world pattern | The common shape of domain-driven backends. | Bentuk umum backend bergaya domain-driven. |
| Common mistakes | Framework types leaking into the core · adapters around every trivial dependency · ports that merely mirror CRUD | Tipe framework bocor ke inti · adapter untuk tiap dependensi sepele · port yang sekadar mencerminkan CRUD |
| Risks | (Low/Med) over-abstraction slows delivery → apply only at boundaries that matter · (Low/Low) team unfamiliarity → reference examples and ADRs | (Rendah/Sedang) abstraksi berlebih memperlambat rilis → terapkan hanya pada batas yang penting · (Rendah/Rendah) tim belum terbiasa → contoh rujukan dan ADR |
| Learn more | [Cockburn — Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/) | — |

### `clean` — Clean Architecture

| Field | EN | ID |
|---|---|---|
| Definition | Concentric layers with one strict rule: dependencies point inward — frameworks at the edge, business entities at the center. A close cousin of Hexagonal with the same goals. | Lapisan konsentris dengan satu aturan ketat: dependensi mengarah ke dalam — framework di tepi, entitas bisnis di pusat. Kerabat dekat Hexagonal dengan tujuan yang sama. |
| Pros | Framework-independent, testable core · the dependency rule is easy to verify mechanically · widely documented | Inti bebas framework dan mudah diuji · aturan dependensi mudah diverifikasi secara mekanis · terdokumentasi luas |
| Cons | Layer ceremony and mapping overhead · cargo-culting is common — layers without intent | Seremoni lapisan dan beban pemetaan antar-objek · sering ditiru tanpa paham — lapisan tanpa maksud |
| When to use | Complex, long-lived domains · teams that value mechanical enforceability | Domain kompleks berumur panjang · tim yang menghargai penegakan mekanis |
| When to avoid | Small apps where the layers outweigh the logic | Aplikasi kecil yang lapisannya lebih berat daripada logikanya |
| Real-world pattern | Enterprise codebases with strict review cultures. | Basis kode enterprise dengan budaya review ketat. |
| Common mistakes | A mapper class between every layer by default · dogmatic folder-per-layer for trivial features | Kelas mapper antar tiap lapisan secara default · folder-per-lapisan yang dogmatis untuk fitur sepele |
| Risks | (Low/Med) ceremony overhead → tailor the number of layers to the domain · (Low/Low) dogma over intent → review against the dependency rule, not the folder names | (Rendah/Sedang) beban seremoni → sesuaikan jumlah lapisan dengan domain · (Rendah/Rendah) dogma mengalahkan maksud → review terhadap aturan dependensi, bukan nama folder |
| Learn more | [Martin — The Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) | — |

### `vertical-slice` — Vertical Slice

| Field | EN | ID |
|---|---|---|
| Definition | Organizes code by feature; each slice owns its full path from request to data. Minimizes cross-feature coupling and keeps everyday changes local. | Mengorganisasi kode per fitur; tiap irisan memiliki jalur lengkapnya dari request sampai data. Meminimalkan keterikatan antarfitur dan menjaga perubahan harian tetap lokal. |
| Pros | A feature change touches one place · low coupling between slices · fast onboarding per feature | Perubahan fitur menyentuh satu tempat · keterikatan antar-irisan rendah · onboarding cepat per fitur |
| Cons | Shared logic can duplicate across slices · cross-cutting standards need active care · core abstractions emerge late | Logika bersama bisa terduplikasi antar-irisan · standar lintas fitur butuh perhatian aktif · abstraksi inti muncul belakangan |
| When to use | Feature-team workflows · products that are CRUD-with-variations | Alur kerja tim per fitur · produk bertipe CRUD-dengan-variasi |
| When to avoid | Deep domain invariants shared across many features | Invarian domain dalam yang dipakai lintas banyak fitur |
| Real-world pattern | Common in modern .NET and feature-folder codebases. | Lazim di basis kode .NET modern dan berfolder-fitur. |
| Common mistakes | Copy-paste divergence between slices · refusing a shared kernel for true invariants | Penyalinan yang lama-lama menyimpang antar-irisan · menolak shared kernel untuk invarian sejati |
| Risks | (Med/Med) duplication drift → scheduled refactors and a small shared kernel · (Low/Med) inconsistent patterns per slice → templates and linting | (Sedang/Sedang) duplikasi menyimpang → refactor terjadwal dan shared kernel kecil · (Rendah/Sedang) pola tak konsisten antar-irisan → template dan linting |
| Learn more | [Bogard — Vertical Slice Architecture](https://www.jimmybogard.com/vertical-slice-architecture/) | — |

### `layered` — Layered

| Field | EN | ID |
|---|---|---|
| Definition | Code organized by technical role — controllers, services, repositories. The quickest start and universally understood; coupling grows with the domain. | Kode diorganisasi menurut peran teknis — controller, service, repository. Awal tercepat dan dipahami semua orang; keterikatan tumbuh seiring domain. |
| Pros | Zero learning curve · framework defaults support it · fine for small apps and CRUD | Tanpa kurva belajar · didukung bawaan framework · memadai untuk aplikasi kecil dan CRUD |
| Cons | Features smear across layers · the service layer bloats · domain logic hides in helpers | Fitur tercecer lintas lapisan · lapisan service membengkak · logika domain bersembunyi di helper |
| When to use | Small or simple domains · short-lived tools · MVPs | Domain kecil atau sederhana · perkakas berumur pendek · MVP |
| When to avoid | Complex domains expected to live long | Domain kompleks yang diharapkan berumur panjang |
| Real-world pattern | The default scaffold of most web frameworks. | Kerangka bawaan sebagian besar framework web. |
| Common mistakes | Fat services with an anemic domain · circular imports between layers · a "utils" dumping ground | Service gemuk dengan domain anemia · impor melingkar antarlapisan · keranjang sampah bernama "utils" |
| Risks | (Med/Med) erosion into spaghetti as the domain grows → periodic refactoring, or move to slices/hexagonal when complexity hardens | (Sedang/Sedang) erosi menjadi spageti saat domain tumbuh → refactor berkala, atau beralih ke vertical slice/hexagonal saat kompleksitas mengeras |
| Learn more | [Fowler — Presentation Domain Data Layering](https://martinfowler.com/bliki/PresentationDomainDataLayering.html) | — |

---

## 5. D5 — Frontend Architecture

### `micro-frontends` — Micro-frontends

| Field | EN | ID |
|---|---|---|
| Definition | Splits the UI so independent teams build and deploy their own screen areas. The frontend equivalent of microservices — with equivalent costs. | Memecah UI sehingga tim-tim independen membangun dan merilis area layarnya masing-masing. Padanan microservices untuk frontend — dengan biaya yang setara pula. |
| Pros | Independent UI deploys per team · per-area technology evolution · scales with the organization | Rilis UI independen per tim · evolusi teknologi per area · tumbuh mengikuti organisasi |
| Cons | Bundle duplication and performance overhead · cross-team UX consistency work · a non-trivial integration shell | Duplikasi bundle dan beban performa · upaya konsistensi UX lintas tim · shell integrasi yang tidak sepele |
| When to use | Several frontend teams owning one product surface | Beberapa tim frontend memiliki satu permukaan produk |
| When to avoid | A single team — one SPA is simpler and faster | Satu tim — satu SPA lebih sederhana dan cepat |
| Real-world pattern | Large portals and marketplaces with team-owned areas. | Portal dan marketplace besar dengan area milik tim. |
| Common mistakes | Sharing mutable state between micro-frontends · multiple frameworks on one page · no design-system contract | Berbagi state yang bisa berubah antar micro-frontend · beberapa framework dalam satu halaman · tanpa kontrak design system |
| Risks | (Med/Med) UX fragmentation → a shared design system and contract tests · (Med/Med) performance overhead → shared dependencies and performance budgets | (Sedang/Sedang) UX terfragmentasi → design system bersama dan contract test · (Sedang/Sedang) beban performa → dependensi bersama dan anggaran performa |
| Learn more | [Jackson — Micro Frontends](https://martinfowler.com/articles/micro-frontends.html) | — |

### `spa` — Single-page app (SPA)

| Field | EN | ID |
|---|---|---|
| Definition | One JavaScript application renders everything in the browser after the first load. Rich interactivity from a single deployable; first paint and SEO need explicit care. | Satu aplikasi JavaScript merender semuanya di browser setelah pemuatan pertama. Interaktivitas kaya dari satu unit rilis; first paint dan SEO perlu perhatian khusus. |
| Pros | App-like interactivity · a clean API boundary to the backend · one deployable, hostable as a static site | Interaktivitas serasa aplikasi · batas API yang bersih ke backend · satu unit rilis, bisa dihosting statis |
| Cons | First-load bundle size · SEO requires extra work · client-side state complexity | Ukuran bundle pemuatan pertama · SEO butuh kerja ekstra · kompleksitas state di sisi klien |
| When to use | Dashboards and tools behind login · interactive products | Dasbor dan perkakas di balik login · produk interaktif |
| When to avoid | Content- and SEO-driven sites with shallow interaction | Situs berbasis konten dan SEO dengan interaksi dangkal |
| Real-world pattern | Internal tools and SaaS dashboards — this product is one. | Perkakas internal dan dasbor SaaS — produk ini salah satunya. |
| Common mistakes | Shipping megabytes of JavaScript · treating client state as a database · ignoring code-splitting | Mengirim JavaScript bermegabita · memperlakukan state klien sebagai database · mengabaikan code-splitting |
| Risks | (Med/Med) bundle growth → performance budgets enforced in CI · (Low/Med) SEO gaps → prerender or a hybrid SSR if it ever matters | (Sedang/Sedang) bundle membengkak → anggaran performa ditegakkan di CI · (Rendah/Sedang) celah SEO → prerender atau hibrida SSR bila kelak dibutuhkan |
| Learn more | [MDN — SPA](https://developer.mozilla.org/en-US/docs/Glossary/SPA) · [web.dev — Rendering on the Web](https://web.dev/articles/rendering-on-the-web) | — |

### `ssr` — Server-rendered (SSR/SSG)

| Field | EN | ID |
|---|---|---|
| Definition | Pages are rendered on a server or at build time, then hydrated in the browser. The best first paint and SEO; adds a server runtime (SSR) or rebuild pipeline (SSG). | Halaman dirender di server atau saat build, lalu dihidrasi di browser. First paint dan SEO terbaik; menambah runtime server (SSR) atau pipeline build ulang (SSG). |
| Pros | Best first paint and SEO · content visible before JavaScript loads · SSG output is CDN-friendly | First paint dan SEO terbaik · konten tampil sebelum JavaScript termuat · keluaran SSG ramah CDN |
| Cons | A server runtime to operate (SSR) · hydration complexity · content changes need rebuilds (SSG) | Runtime server untuk dioperasikan (SSR) · kompleksitas hidrasi · perubahan konten butuh build ulang (SSG) |
| When to use | Content-heavy or SEO-critical products · first-paint-critical pages | Produk sarat konten atau kritis SEO · halaman yang kritis first paint |
| When to avoid | Highly stateful per-user apps where SSR buys little | Aplikasi sangat stateful per pengguna di mana SSR tak banyak menolong |
| Real-world pattern | Marketing sites, news, and storefront pages. | Situs pemasaran, berita, dan halaman etalase. |
| Common mistakes | SSR-ing personalized, uncacheable pages everywhere · double-fetching data on hydration | Me-render SSR halaman personal yang tak bisa di-cache di mana-mana · mengambil data dua kali saat hidrasi |
| Risks | (Med/Med) runtime operating cost (SSR) → prefer SSG/incremental rendering where possible · (Low/Med) hydration mismatches → integration tests on critical pages | (Sedang/Sedang) biaya operasional runtime (SSR) → utamakan SSG/rendering inkremental bila memungkinkan · (Rendah/Sedang) ketidakcocokan hidrasi → tes integrasi pada halaman kritis |
| Learn more | [web.dev — Rendering on the Web](https://web.dev/articles/rendering-on-the-web) | — |

---

## 6. Anti-pattern messages (EN · ID)

User-facing messages for the seven rules in [Model Data Sheet Section 5](model-data-sheet.md);
each names the problem, the consequence, and the way out.

| Rule `id` | Severity | Message (EN) | Message (ID) |
|---|---|---|---|
| `premature-microservices` | danger | Microservices with a small team and low platform maturity usually become a distributed monolith: you pay the operational price without gaining the autonomy. Start with a modular monolith and split when the team and tooling are ready. | Microservices dengan tim kecil dan kematangan platform rendah biasanya berubah menjadi distributed monolith: Anda membayar harga operasionalnya tanpa mendapat otonominya. Mulailah dari modular monolith dan pecah saat tim serta tooling siap. |
| `distributed-monolith` | danger | Services that share one database cannot deploy or scale independently — the defining benefits of microservices disappear while the complexity stays. Give each service its own data, or stay with a (modular) monolith. | Layanan yang berbagi satu database tidak bisa rilis atau naik skala secara independen — manfaat utama microservices hilang sementara kompleksitasnya tinggal. Beri tiap layanan datanya sendiri, atau tetaplah dengan (modular) monolith. |
| `sync-coupling-at-scale` | warning | Synchronous call chains between services create cascading-failure risk under load. Add timeouts, retries with backoff, and circuit breakers — or make the non-urgent hops asynchronous. | Rantai panggilan sinkron antarlayanan menimbulkan risiko kegagalan berantai saat beban tinggi. Tambahkan timeout, retry dengan backoff, dan circuit breaker — atau jadikan lompatan yang tidak mendesak asinkron. |
| `over-engineered-mvp` | warning | For a short-lived product under deadline pressure, heavyweight patterns slow you down without paying back. Bias to the simplest viable option; upgrade when the product earns it. | Untuk produk berumur pendek di bawah tekanan tenggat, pola kelas berat memperlambat tanpa balik modal. Condonglah ke opsi paling sederhana yang layak; naikkan kelas saat produknya sudah pantas. |
| `consistency-conflict` | warning | You require strong consistency, but the chosen styles are eventually consistent by nature. Isolate the strongly-consistent core on a transactional store, and let the rest be eventual. | Anda mensyaratkan konsistensi kuat, tetapi gaya yang dipilih bersifat eventual secara alami. Isolasi inti yang butuh konsistensi kuat pada penyimpanan transaksional, dan biarkan sisanya eventual. |
| `legacy-without-plan` | warning | Heavy legacy coupling plus a big-bang rewrite is the riskiest path. Use the Strangler Fig pattern: route traffic through a facade and migrate one capability at a time. | Keterikatan legacy yang berat ditambah penulisan ulang sekali jadi adalah jalur paling berisiko. Gunakan pola Strangler Fig: arahkan trafik lewat fasad dan migrasikan satu kapabilitas demi satu. |
| `strict-security-shared-infra` | info | Strict compliance on serverless means shared responsibility with your cloud provider. Clarify which controls are yours, and verify the provider's certifications cover your regulation. | Kepatuhan ketat di serverless berarti tanggung jawab berbagi dengan penyedia cloud Anda. Perjelas kendali mana yang menjadi milik Anda, dan pastikan sertifikasi penyedia mencakup regulasi Anda. |

---

## 7. Fitness-function templates (EN · ID)

One measurable template per quality attribute ([Build Spec Section 11](../specs/build-spec-v3.md);
`X`/`N` are placeholders the team fills in):

| QA | Template (EN) | Template (ID) |
|---|---|---|
| performance | p95/p99 latency of the critical path is measured continuously; alert when p99 exceeds X ms. | Latensi p95/p99 jalur kritis diukur terus-menerus; beri peringatan saat p99 melewati X ms. |
| scalability | A load test sustains N req/s at p99 < X ms with autoscaling enabled, run on every release. | Uji beban mampu menahan N req/s pada p99 < X ms dengan autoscaling aktif, dijalankan pada tiap rilis. |
| availability | A chaos test tolerates the loss of a node/zone within the error budget; SLO dashboards track it. | Uji chaos mentoleransi hilangnya satu node/zona dalam batas error budget; dasbor SLO memantaunya. |
| security | SAST, dependency, and secret scanning gate the pipeline; the budget for critical CVEs is zero. | Pemindaian SAST, dependensi, dan rahasia menjadi gerbang pipeline; anggaran CVE kritis adalah nol. |
| maintainability | Architecture/dependency tests forbid layering violations; change failure rate and lead time (DORA) are tracked. | Tes arsitektur/dependensi melarang pelanggaran lapisan; change failure rate dan lead time (DORA) dipantau. |
| deployability | Each unit deploys independently in < N minutes via CI; the build fails on cyclic dependencies. | Tiap unit dirilis independen dalam < N menit lewat CI; build gagal bila ada dependensi melingkar. |
| testability | Core logic holds ≥ X% branch coverage with fast, deterministic unit tests. | Logika inti memiliki cakupan cabang ≥ X% dengan unit test yang cepat dan deterministik. |
| observability | Every request is traceable end-to-end via a trace ID; golden signals have dashboards and alerts. | Setiap request dapat ditelusuri ujung-ke-ujung lewat trace ID; golden signals punya dasbor dan peringatan. |
| dataConsistency | Concurrency tests assert no lost updates under parallel writes; invariants are checked by contract tests. | Uji konkurensi memastikan tidak ada pembaruan hilang saat penulisan paralel; invarian diperiksa lewat contract test. |
| interoperability | Every public contract is schema-validated in CI; breaking changes fail the build (consumer-driven contracts). | Setiap kontrak publik divalidasi skemanya di CI; perubahan yang merusak menggagalkan build (consumer-driven contract). |
| costEfficiency | Cost per 1,000 requests (or per tenant) is tracked monthly; alerts fire on a > X% regression. | Biaya per 1.000 request (atau per tenant) dipantau bulanan; peringatan menyala saat regresi > X%. |
| timeToMarket | Lead time from merge to production is measured; the target is < N days (DORA). | Lead time dari merge ke produksi diukur; targetnya < N hari (DORA). |

---

> **In plain language:** this document is the tool's "teacher voice" — for every architecture
> option it explains, in both languages, what it is, when it shines, when it hurts, the mistakes
> people actually make, and where to read more from the original sources — so an expert can check
> it, and a newcomer can learn from it.
