import type { Bilingual } from '../types';

// Playbook lens — structured, step-by-step implementation guidance for EVERY architecture the
// Advisor evaluates (all 21 D1–D5 options), keyed `${dim}:${optionId}`. Bilingual EN/ID (rendered
// via tr()). Each playbook answers: how do I implement it, what do I need first, what practices keep
// it healthy, what mistakes to avoid. Citations reuse the option's READER_CITATIONS via
// readerContent. Parity with the frozen model is test-enforced (LearnView.test).

const b = (en: string, id: string): Bilingual => ({ en, id });

export interface ArchPlaybook {
  /** What you will have when you finish. */
  goal: Bilingual;
  prerequisites: Bilingual[];
  steps: Bilingual[];
  practices: Bilingual[];
  pitfalls: Bilingual[];
}

export const INSIGHT_PLAYBOOKS: Record<string, ArchPlaybook> = {
  // ───────────────────────── D1 · Deployment granularity ─────────────────────────
  'D1:layered': {
    goal: b(
      'A single deployable organized in clear horizontal layers (presentation → business → data) with enforced downward-only dependencies.',
      'Satu deployable yang tersusun dalam lapisan horizontal yang jelas (presentasi → bisnis → data) dengan dependensi hanya-ke-bawah yang ditegakkan.',
    ),
    prerequisites: [
      b('A well-understood domain and a small team that can share one codebase.', 'Domain yang dipahami dengan baik dan tim kecil yang bisa berbagi satu basis kode.'),
      b('An agreed layer contract: what belongs in presentation, business, and data.', 'Kontrak lapisan yang disepakati: apa yang termasuk presentasi, bisnis, dan data.'),
      b('A dependency-check in CI (lint rule or module boundary tool).', 'Pemeriksaan dependensi di CI (aturan lint atau perkakas batas modul).'),
    ],
    steps: [
      b('Define the three layers and the allowed dependency direction (top → down only).', 'Definisikan tiga lapisan dan arah dependensi yang diizinkan (atas → bawah saja).'),
      b('Place all business rules in the business layer — controllers stay thin, repositories dumb.', 'Tempatkan semua aturan bisnis di lapisan bisnis — controller tetap tipis, repository bodoh.'),
      b('Expose the data layer behind interfaces so the business layer never sees SQL/ORM types.', 'Paparkan lapisan data di balik antarmuka agar lapisan bisnis tak pernah melihat tipe SQL/ORM.'),
      b('Add a CI check that fails when a layer imports upward or skips a layer.', 'Tambahkan pemeriksaan CI yang gagal saat sebuah lapisan mengimpor ke atas atau melompati lapisan.'),
      b('Write unit tests against the business layer without booting the web or DB layer.', 'Tulis unit test terhadap lapisan bisnis tanpa menjalankan lapisan web atau DB.'),
    ],
    practices: [
      b('Keep DTOs at the boundaries; never leak persistence entities into presentation.', 'Jaga DTO di batas; jangan pernah membocorkan entity persistensi ke presentasi.'),
      b('One transaction boundary per use case, owned by the business layer.', 'Satu batas transaksi per use case, dimiliki oleh lapisan bisnis.'),
      b('Document the layer rules in the repo (a one-page ADR beats tribal knowledge).', 'Dokumentasikan aturan lapisan di repo (ADR satu halaman mengalahkan pengetahuan lisan).'),
    ],
    pitfalls: [
      b('"Pass-through" business layers that just forward calls — a sign the layering is ceremonial.', 'Lapisan bisnis "pass-through" yang cuma meneruskan panggilan — tanda layering hanya seremonial.'),
      b('Letting a feature change ripple through every layer routinely — consider vertical slices then.', 'Membiarkan perubahan fitur merambat ke setiap lapisan secara rutin — pertimbangkan vertical slice.'),
      b('Sharing persistence models across layers "temporarily" — it never stays temporary.', 'Berbagi model persistensi antar-lapisan "sementara" — ia tak pernah tetap sementara.'),
    ],
  },
  'D1:monolith': {
    goal: b(
      'One well-structured deployable containing the whole application — the fastest credible start for a new product.',
      'Satu deployable yang terstruktur baik berisi seluruh aplikasi — awal yang paling cepat dan kredibel untuk produk baru.',
    ),
    prerequisites: [
      b('One repository, one build pipeline, one relational database.', 'Satu repositori, satu pipeline build, satu basis data relasional.'),
      b('A module convention agreed before the first feature (folder-per-domain beats folder-per-type).', 'Konvensi modul yang disepakati sebelum fitur pertama (folder-per-domain mengalahkan folder-per-tipe).'),
      b('Basic CI: lint, tests, build on every push.', 'CI dasar: lint, tes, build pada setiap push.'),
    ],
    steps: [
      b('Scaffold a single service with health checks, config via environment, and structured logging.', 'Siapkan satu layanan dengan health check, konfigurasi lewat environment, dan logging terstruktur.'),
      b('Model the first bounded contexts as internal modules with explicit public interfaces.', 'Modelkan bounded context pertama sebagai modul internal dengan antarmuka publik yang eksplisit.'),
      b('Keep one database, one schema-migration tool, and transactional consistency.', 'Pertahankan satu basis data, satu perkakas migrasi skema, dan konsistensi transaksional.'),
      b('Automate deploy as one unit (blue/green or rolling) from day one.', 'Otomatiskan deploy sebagai satu unit (blue/green atau rolling) sejak hari pertama.'),
      b('Record the "when would we split?" triggers in an ADR so the future extraction is deliberate.', 'Catat pemicu "kapan kita akan memecah?" dalam ADR agar ekstraksi di masa depan disengaja.'),
    ],
    practices: [
      b('Enforce module boundaries inside the monolith even though nothing forces you to.', 'Tegakkan batas modul di dalam monolith meski tak ada yang memaksamu.'),
      b('Load-test the single process early; vertical scaling has a knowable ceiling.', 'Uji beban proses tunggal sejak awal; penskalaan vertikal punya batas atas yang bisa diketahui.'),
      b('Feature flags for risky changes — one deployable means one blast radius.', 'Feature flag untuk perubahan berisiko — satu deployable berarti satu blast radius.'),
    ],
    pitfalls: [
      b('Treating "monolith" as an excuse for a big ball of mud — internal structure still matters.', 'Menjadikan "monolith" alasan untuk big ball of mud — struktur internal tetap penting.'),
      b('Premature extraction of services before the domain boundaries have stabilized.', 'Ekstraksi layanan prematur sebelum batas domain stabil.'),
      b('Letting the release cadence be hostage to the slowest team — that is the signal to modularize.', 'Membiarkan irama rilis disandera tim paling lambat — itu sinyal untuk memodularisasi.'),
    ],
  },
  'D1:modular-monolith': {
    goal: b(
      'A single deployable whose internal modules have enforced boundaries aligned to bounded contexts — microservices-grade modularity without the network.',
      'Satu deployable yang modul internalnya punya batas yang ditegakkan selaras bounded context — modularitas kelas-microservices tanpa jaringan.',
    ),
    prerequisites: [
      b('Identified bounded contexts (an EventStorming or context-mapping session is enough to start).', 'Bounded context yang teridentifikasi (sesi EventStorming atau context-mapping cukup untuk memulai).'),
      b('A boundary-enforcement tool in CI (dependency-cruiser, ArchUnit, Nx module rules, or lint).', 'Perkakas penegak batas di CI (dependency-cruiser, ArchUnit, aturan modul Nx, atau lint).'),
      b('Team agreement that cross-module calls go through public module APIs only.', 'Kesepakatan tim bahwa panggilan antar-modul hanya lewat API publik modul.'),
    ],
    steps: [
      b('Partition the codebase by domain module (orders/, billing/, catalog/) — not by technical layer.', 'Bagi basis kode berdasarkan modul domain (orders/, billing/, catalog/) — bukan berdasarkan lapisan teknis.'),
      b('Give each module a public interface file; mark everything else module-private.', 'Beri tiap modul satu berkas antarmuka publik; tandai sisanya sebagai privat-modul.'),
      b('Enforce the boundaries in CI: a PR that imports another module’s internals must fail.', 'Tegakkan batas di CI: PR yang mengimpor internal modul lain harus gagal.'),
      b('Keep one database but segregate schemas/tables by module ownership; forbid cross-module joins.', 'Pertahankan satu basis data tapi pisahkan skema/tabel berdasarkan kepemilikan modul; larang join antar-modul.'),
      b('Route cross-module workflows through in-process events or the owning module’s API.', 'Arahkan alur kerja antar-modul lewat event dalam-proses atau API modul pemilik.'),
      b('Revisit boundaries quarterly; merge or split modules as the domain clarifies.', 'Tinjau batas tiap kuartal; gabung atau pecah modul seiring domain menjadi jelas.'),
    ],
    practices: [
      b('One team can own several modules, but one module never belongs to several teams.', 'Satu tim boleh memiliki beberapa modul, tapi satu modul tak pernah milik beberapa tim.'),
      b('Treat module APIs like published contracts: versioned mentally, changed deliberately.', 'Perlakukan API modul seperti kontrak yang dipublikasikan: berversi secara mental, diubah secara sengaja.'),
      b('Measure coupling (imports across boundaries) as a fitness function.', 'Ukur kopling (impor lintas-batas) sebagai fitness function.'),
    ],
    pitfalls: [
      b('Boundaries as folders only — without CI enforcement they erode in weeks.', 'Batas hanya berupa folder — tanpa penegakan CI ia terkikis dalam hitungan minggu.'),
      b('A shared "utils/common" module that quietly becomes the coupling hub.', 'Modul "utils/common" bersama yang diam-diam menjadi pusat kopling.'),
      b('Cross-module database joins — they make later extraction near-impossible.', 'Join basis data antar-modul — membuat ekstraksi kelak nyaris mustahil.'),
    ],
  },
  'D1:microservices': {
    goal: b(
      'Independently deployable services, each owning its data, sized to team and scaling boundaries — with the operational platform to run them.',
      'Layanan yang dapat di-deploy independen, masing-masing memiliki datanya, berukuran sesuai batas tim dan penskalaan — dengan platform operasional untuk menjalankannya.',
    ),
    prerequisites: [
      b('Mature delivery: CI/CD per service, containerized runtime, centralized logging, tracing, metrics.', 'Delivery yang matang: CI/CD per layanan, runtime terkontainer, logging terpusat, tracing, metrik.'),
      b('Stable bounded contexts (ideally proven inside a modular monolith first).', 'Bounded context yang stabil (idealnya sudah terbukti di dalam modular monolith lebih dulu).'),
      b('Teams aligned to services (Conway) and an on-call/ownership model.', 'Tim yang selaras dengan layanan (Conway) dan model on-call/kepemilikan.'),
    ],
    steps: [
      b('Extract the first service along a proven bounded context using the Strangler Fig pattern.', 'Ekstrak layanan pertama sepanjang bounded context yang terbukti memakai pola Strangler Fig.'),
      b('Move its data with it: the service owns its store; others integrate via API/events only.', 'Pindahkan datanya bersamanya: layanan memiliki penyimpanannya; yang lain berintegrasi hanya lewat API/event.'),
      b('Introduce an API gateway and service-to-service auth (mTLS or tokens) at the edge.', 'Perkenalkan API gateway dan autentikasi antar-layanan (mTLS atau token) di edge.'),
      b('Standardize a service template (health, config, telemetry, build) to keep entropy down.', 'Standarkan template layanan (health, konfigurasi, telemetri, build) untuk menekan entropi.'),
      b('Replace cross-service transactions with sagas + the transactional outbox.', 'Ganti transaksi lintas-layanan dengan saga + transactional outbox.'),
      b('Add per-service SLOs and deploy independence checks (a service must release alone).', 'Tambahkan SLO per-layanan dan pemeriksaan kemandirian deploy (sebuah layanan harus bisa dirilis sendiri).'),
    ],
    practices: [
      b('Few, larger services first; split further only on demonstrated need.', 'Sedikit layanan yang lebih besar dulu; pecah lebih jauh hanya saat kebutuhannya terbukti.'),
      b('Consumer-driven contract tests to keep integrations honest without E2E gridlock.', 'Consumer-driven contract test untuk menjaga integrasi tetap jujur tanpa kemacetan E2E.'),
      b('Budget platform time explicitly — the platform is a product, not a side effect.', 'Anggarkan waktu platform secara eksplisit — platform adalah produk, bukan efek samping.'),
    ],
    pitfalls: [
      b('The distributed monolith: shared databases or lockstep releases (see the Review lens).', 'Distributed monolith: basis data bersama atau rilis serentak (lihat lensa Review).'),
      b('Extracting by technical layer ("auth service", "DB service") instead of by domain.', 'Mengekstrak berdasarkan lapisan teknis ("auth service", "DB service") alih-alih berdasarkan domain.'),
      b('Underestimating the standing cost: tracing, versioning, and on-call are forever.', 'Meremehkan biaya tetap: tracing, versioning, dan on-call itu selamanya.'),
    ],
  },
  'D1:serverless': {
    goal: b(
      'Event-triggered functions on managed infrastructure with scale-to-zero economics for spiky or glue workloads.',
      'Fungsi yang dipicu event pada infrastruktur terkelola dengan ekonomi scale-to-zero untuk beban kerja yang berlonjak atau perekat.',
    ),
    prerequisites: [
      b('Workloads that are short-lived, stateless, and tolerant of cold starts.', 'Beban kerja yang berumur pendek, stateless, dan toleran terhadap cold start.'),
      b('Managed state services chosen (queue, object store, database) — functions hold no state.', 'Layanan state terkelola yang sudah dipilih (queue, object store, basis data) — fungsi tidak menyimpan state.'),
      b('IaC (Terraform/SAM/CDK) from the start; console-clicked functions do not survive audits.', 'IaC (Terraform/SAM/CDK) sejak awal; fungsi yang diklik lewat konsol tak lolos audit.'),
    ],
    steps: [
      b('Pick one bursty or event-driven workload (image resize, webhook, nightly batch) as the pilot.', 'Pilih satu beban kerja yang berlonjak atau event-driven (resize gambar, webhook, batch malam) sebagai pilot.'),
      b('Define functions per event with explicit timeouts, memory, and retry policies.', 'Definisikan fungsi per event dengan timeout, memori, dan kebijakan retry yang eksplisit.'),
      b('Wire dead-letter queues and idempotency keys before production traffic.', 'Rangkai dead-letter queue dan idempotency key sebelum trafik produksi.'),
      b('Instrument cold-start latency and per-invocation cost from day one.', 'Instrumentasi latensi cold-start dan biaya per-invokasi sejak hari pertama.'),
      b('Gate long-running or latency-critical paths OUT of functions — host those elsewhere.', 'Keluarkan jalur berjalan-lama atau kritis-latensi dari fungsi — inangi di tempat lain.'),
    ],
    practices: [
      b('Keep functions single-purpose and small; share code via layers/packages, not mega-functions.', 'Jaga fungsi bertujuan-tunggal dan kecil; bagikan kode lewat layer/paket, bukan mega-fungsi.'),
      b('Local emulation + contract tests, because step-through debugging in the cloud is painful.', 'Emulasi lokal + contract test, karena debugging langkah-demi-langkah di cloud itu menyakitkan.'),
      b('Review the bill monthly: sustained high volume can invert the cost advantage.', 'Tinjau tagihan tiap bulan: volume tinggi berkelanjutan bisa membalik keunggulan biaya.'),
    ],
    pitfalls: [
      b('Chaining dozens of functions into an invisible distributed monolith — use a workflow service.', 'Merangkai puluhan fungsi menjadi distributed monolith tak kasat mata — gunakan layanan workflow.'),
      b('Ignoring vendor lock-in: keep domain logic in portable modules, bind to the provider at the edge.', 'Mengabaikan vendor lock-in: jaga logika domain di modul portabel, ikat ke penyedia di edge.'),
      b('Stateful hacks (in-memory caches, temp files) that break the scale-to-zero model.', 'Trik stateful (cache di memori, berkas sementara) yang merusak model scale-to-zero.'),
    ],
  },

  // ───────────────────────── D2 · Communication style ─────────────────────────
  'D2:synchronous': {
    goal: b(
      'Request/response integration (REST/gRPC) with explicit timeouts, retries, and failure isolation.',
      'Integrasi request/response (REST/gRPC) dengan timeout eksplisit, retry, dan isolasi kegagalan.',
    ),
    prerequisites: [
      b('An interface definition discipline (OpenAPI/protobuf) with review on change.', 'Disiplin definisi antarmuka (OpenAPI/protobuf) dengan tinjauan saat berubah.'),
      b('A latency budget for each call chain (p95 per hop).', 'Anggaran latensi untuk tiap rantai panggilan (p95 per hop).'),
    ],
    steps: [
      b('Define the contract first (OpenAPI/proto), generate clients/servers from it.', 'Definisikan kontrak lebih dulu (OpenAPI/proto), hasilkan client/server darinya.'),
      b('Set explicit timeouts on every call — no defaults, no infinite waits.', 'Tetapkan timeout eksplisit pada tiap panggilan — tanpa default, tanpa tunggu tak berhingga.'),
      b('Add idempotency keys to mutating endpoints so retries are safe.', 'Tambahkan idempotency key pada endpoint yang mengubah data agar retry aman.'),
      b('Introduce circuit breakers + bounded retries with jitter at the client.', 'Perkenalkan circuit breaker + retry terbatas dengan jitter di sisi client.'),
      b('Version the API additively; breaking changes get a new major path.', 'Versikan API secara aditif; perubahan yang memecah mendapat jalur mayor baru.'),
    ],
    practices: [
      b('Keep call chains shallow (≤2 synchronous hops); deeper chains multiply latency and failure.', 'Jaga rantai panggilan dangkal (≤2 hop sinkron); rantai lebih dalam melipatgandakan latensi dan kegagalan.'),
      b('Return partial results/degraded modes instead of cascading 500s.', 'Kembalikan hasil parsial/mode terdegradasi alih-alih 500 beruntun.'),
      b('Contract tests in CI between consumer and provider.', 'Contract test di CI antara konsumer dan penyedia.'),
    ],
    pitfalls: [
      b('Synchronously calling a service that synchronously calls another — the availability product shrinks fast.', 'Memanggil secara sinkron layanan yang memanggil sinkron lainnya — hasil kali ketersediaan menyusut cepat.'),
      b('Retrying non-idempotent operations — duplicate side effects.', 'Me-retry operasi non-idempoten — efek samping ganda.'),
      b('Using sync calls for workflows that only need eventual completion.', 'Memakai panggilan sinkron untuk alur kerja yang hanya butuh penyelesaian eventual.'),
    ],
  },
  'D2:async-messaging': {
    goal: b(
      'Producer/consumer integration over a broker with at-least-once delivery handled safely.',
      'Integrasi produser/konsumer lewat broker dengan pengiriman at-least-once yang ditangani dengan aman.',
    ),
    prerequisites: [
      b('A managed broker (SQS/RabbitMQ/Pub/Sub) — do not self-host first.', 'Broker terkelola (SQS/RabbitMQ/Pub/Sub) — jangan self-host lebih dulu.'),
      b('Message schema definitions with a compatibility rule (add-only).', 'Definisi skema pesan dengan aturan kompatibilitas (hanya-tambah).'),
    ],
    steps: [
      b('Model each integration as a named queue with an explicit message contract.', 'Modelkan tiap integrasi sebagai antrean bernama dengan kontrak pesan eksplisit.'),
      b('Make every consumer idempotent (dedupe on a message/idempotency key).', 'Buat tiap konsumer idempoten (dedup berdasarkan kunci pesan/idempotensi).'),
      b('Configure dead-letter queues + alerting before go-live.', 'Konfigurasikan dead-letter queue + peringatan sebelum go-live.'),
      b('Use the transactional outbox on producers so "save + publish" cannot diverge.', 'Pakai transactional outbox pada produser agar "simpan + publikasikan" tak bisa menyimpang.'),
      b('Load-test consumer lag and set autoscaling on queue depth.', 'Uji beban consumer lag dan set autoscaling berdasarkan kedalaman antrean.'),
    ],
    practices: [
      b('One queue per use, not a shared "events" pipe with if-else consumers.', 'Satu antrean per kegunaan, bukan pipa "events" bersama dengan konsumer if-else.'),
      b('Poison-message runbooks: who unblocks the DLQ and how.', 'Runbook pesan bermasalah: siapa yang membuka blokir DLQ dan bagaimana.'),
      b('Trace IDs propagated through message headers for end-to-end debugging.', 'Trace ID yang dipropagasikan lewat header pesan untuk debugging ujung-ke-ujung.'),
    ],
    pitfalls: [
      b('Assuming exactly-once delivery — design for at-least-once or suffer duplicates.', 'Mengasumsikan pengiriman exactly-once — rancang untuk at-least-once atau derita duplikat.'),
      b('Unbounded queues hiding a failing consumer for days.', 'Antrean tak terbatas yang menyembunyikan konsumer yang gagal selama berhari-hari.'),
      b('Request/response emulation over queues where a simple sync call was right.', 'Emulasi request/response di atas antrean padahal panggilan sinkron sederhana yang tepat.'),
    ],
  },
  'D2:event-driven': {
    goal: b(
      'Components that publish domain facts (events) and react to others’, enabling extension without touching producers.',
      'Komponen yang memublikasikan fakta domain (event) dan bereaksi terhadap milik yang lain, memungkinkan perluasan tanpa menyentuh produser.',
    ),
    prerequisites: [
      b('A canonical event schema registry (even a reviewed folder of JSON schemas works).', 'Registri skema event kanonik (bahkan folder skema JSON yang ditinjau pun cukup).'),
      b('Distributed tracing — emergent flows are undebuggable without it.', 'Distributed tracing — alur yang muncul tak bisa di-debug tanpanya.'),
    ],
    steps: [
      b('Name events as past-tense domain facts (OrderPlaced), never commands in disguise.', 'Namai event sebagai fakta domain lampau (OrderPlaced), jangan pernah command yang menyamar.'),
      b('Publish from the transactional outbox so events match committed state.', 'Publikasikan dari transactional outbox agar event cocok dengan state yang ter-commit.'),
      b('Let each consumer own its projection/read model; no shared consumer state.', 'Biarkan tiap konsumer memiliki proyeksi/read model-nya; tanpa state konsumer bersama.'),
      b('Version events additively; consumers ignore unknown fields.', 'Versikan event secara aditif; konsumer mengabaikan field yang tak dikenal.'),
      b('Document each event’s producer, consumers, and ordering guarantees in the registry.', 'Dokumentasikan produser, konsumer, dan jaminan urutan tiap event di registri.'),
    ],
    practices: [
      b('Design for eventual consistency explicitly: show "pending" states in UX.', 'Rancang untuk konsistensi eventual secara eksplisit: tampilkan status "pending" di UX.'),
      b('Replayable consumers (idempotent + offset-based) make recovery routine.', 'Konsumer yang dapat diputar-ulang (idempoten + berbasis offset) membuat pemulihan jadi rutin.'),
      b('An event catalog page beats archaeology across repos.', 'Halaman katalog event mengalahkan penggalian arkeologi lintas repo.'),
    ],
    pitfalls: [
      b('Event chains that implement a workflow nobody can see — add a saga/orchestrator when flow matters.', 'Rantai event yang mengimplementasikan alur kerja yang tak terlihat siapa pun — tambahkan saga/orkestrator saat alur penting.'),
      b('Fat events carrying entire entities — couple consumers to your internals.', 'Event gemuk yang membawa seluruh entity — mengkopling konsumer ke internalmu.'),
      b('Using events where a query was needed: events notify, they do not answer questions.', 'Memakai event padahal kueri yang dibutuhkan: event memberi tahu, ia tak menjawab pertanyaan.'),
    ],
  },
  'D2:streaming': {
    goal: b(
      'Ordered, replayable event streams (Kafka-class) powering real-time processing and materialized views.',
      'Stream event yang terurut dan dapat diputar-ulang (kelas Kafka) yang menggerakkan pemrosesan real-time dan materialized view.',
    ),
    prerequisites: [
      b('A real throughput/ordering need (telemetry, clickstream, CDC) — not just messaging fashion.', 'Kebutuhan throughput/urutan yang nyata (telemetri, clickstream, CDC) — bukan sekadar tren messaging.'),
      b('A managed streaming platform; self-hosting Kafka is a team of its own.', 'Platform streaming terkelola; self-host Kafka adalah pekerjaan satu tim tersendiri.'),
    ],
    steps: [
      b('Choose partition keys deliberately — they define ordering and parallelism forever.', 'Pilih partition key secara sengaja — ia mendefinisikan urutan dan paralelisme selamanya.'),
      b('Set retention/compaction per topic according to replay needs.', 'Atur retensi/compaction per topik sesuai kebutuhan putar-ulang.'),
      b('Build consumers as replayable processors with checkpointed offsets.', 'Bangun konsumer sebagai prosesor yang dapat diputar-ulang dengan offset ber-checkpoint.'),
      b('Handle backpressure: bounded buffers, lag alerts, autoscaled consumer groups.', 'Tangani backpressure: buffer terbatas, peringatan lag, consumer group yang di-autoscale.'),
      b('Plan reprocessing: a new consumer version must be able to rebuild its view from the log.', 'Rencanakan pemrosesan-ulang: versi konsumer baru harus bisa membangun ulang tampilannya dari log.'),
    ],
    practices: [
      b('Schema registry + compatibility checks on every producer change.', 'Schema registry + pemeriksaan kompatibilitas pada tiap perubahan produser.'),
      b('Monitor consumer lag as a first-class SLO.', 'Pantau consumer lag sebagai SLO kelas-satu.'),
      b('Keep stream processors stateless where possible; push state to stores built for it.', 'Jaga prosesor stream tetap stateless bila mungkin; dorong state ke penyimpanan yang dibangun untuknya.'),
    ],
    pitfalls: [
      b('Hot partitions from low-cardinality keys — throughput collapses to one consumer.', 'Partisi panas dari kunci berkardinalitas rendah — throughput runtuh ke satu konsumer.'),
      b('Treating the stream as a database without designing compaction/retention.', 'Memperlakukan stream sebagai basis data tanpa merancang compaction/retensi.'),
      b('Ignoring reprocessing cost until the first schema mistake forces a full replay.', 'Mengabaikan biaya pemrosesan-ulang sampai kesalahan skema pertama memaksa putar-ulang penuh.'),
    ],
  },

  // ───────────────────────── D3 · Data management ─────────────────────────
  'D3:single-db': {
    goal: b(
      'One well-governed relational database with strong transactional consistency for the whole application.',
      'Satu basis data relasional yang terkelola baik dengan konsistensi transaksional kuat untuk seluruh aplikasi.',
    ),
    prerequisites: [
      b('A migration tool (Flyway/Liquibase/Prisma migrate) with migrations in the repo.', 'Perkakas migrasi (Flyway/Liquibase/Prisma migrate) dengan migrasi tersimpan di repo.'),
      b('Clear schema ownership conventions per module/team.', 'Konvensi kepemilikan skema yang jelas per modul/tim.'),
    ],
    steps: [
      b('Design the schema around the domain; normalize first, denormalize with evidence.', 'Rancang skema di sekitar domain; normalisasi dulu, denormalisasi dengan bukti.'),
      b('Adopt one migration pipeline: every change is a versioned, reviewed migration.', 'Adopsi satu pipeline migrasi: tiap perubahan adalah migrasi yang berversi dan ditinjau.'),
      b('Set connection pooling and per-service credentials/least privilege.', 'Atur connection pooling dan kredensial per-layanan/hak-akses-minimal.'),
      b('Establish backup + restore drills (a backup untested is a hope, not a plan).', 'Tegakkan latihan backup + restore (backup yang tak diuji adalah harapan, bukan rencana).'),
      b('Add slow-query monitoring and an indexing review cadence.', 'Tambahkan pemantauan kueri lambat dan irama tinjauan indeks.'),
    ],
    practices: [
      b('Transactions at use-case boundaries; keep them short.', 'Transaksi di batas use-case; jaga tetap singkat.'),
      b('Views or module-scoped schemas to keep module boundaries visible even in one DB.', 'View atau skema ber-cakupan-modul untuk menjaga batas modul terlihat meski dalam satu DB.'),
      b('Read replicas before exotic scaling — most apps never outgrow them.', 'Read replica sebelum penskalaan eksotis — kebanyakan aplikasi tak pernah melampauinya.'),
    ],
    pitfalls: [
      b('Letting every service/module write every table — the shared DB becomes the coupling hub.', 'Membiarkan tiap layanan/modul menulis ke tiap tabel — DB bersama menjadi pusat kopling.'),
      b('Scaling writes by buying bigger hardware forever instead of revisiting the model.', 'Menskalakan tulis dengan terus membeli perangkat keras lebih besar alih-alih meninjau ulang model.'),
      b('Schema changes without expand/contract — locking migrations take prod down.', 'Perubahan skema tanpa expand/contract — migrasi yang mengunci menjatuhkan produksi.'),
    ],
  },
  'D3:db-per-service': {
    goal: b(
      'Each service exclusively owns its data store; all cross-service access happens via APIs or events.',
      'Tiap layanan memiliki penyimpanan datanya secara eksklusif; semua akses lintas-layanan terjadi lewat API atau event.',
    ),
    prerequisites: [
      b('Service boundaries that match data ownership (the hard part — do this first).', 'Batas layanan yang cocok dengan kepemilikan data (bagian sulit — kerjakan ini dulu).'),
      b('Async integration available (broker) for cross-service consistency.', 'Integrasi asinkron tersedia (broker) untuk konsistensi lintas-layanan.'),
    ],
    steps: [
      b('Assign every table/collection to exactly one owning service; kill shared access paths.', 'Tetapkan tiap tabel/koleksi tepat ke satu layanan pemilik; matikan jalur akses bersama.'),
      b('Split the schema physically (separate DBs or at least separate credentials/schemas).', 'Pecah skema secara fisik (DB terpisah atau minimal kredensial/skema terpisah).'),
      b('Replace cross-service joins with API composition or consumer-owned projections.', 'Ganti join lintas-layanan dengan komposisi API atau proyeksi milik konsumer.'),
      b('Replace cross-service transactions with sagas + transactional outbox.', 'Ganti transaksi lintas-layanan dengan saga + transactional outbox.'),
      b('Give each service its own backup, migration pipeline, and capacity plan.', 'Beri tiap layanan backup, pipeline migrasi, dan rencana kapasitasnya sendiri.'),
    ],
    practices: [
      b('Duplicate read data deliberately (projections) instead of reaching into others’ stores.', 'Duplikasikan data-baca secara sengaja (proyeksi) alih-alih menjangkau penyimpanan orang lain.'),
      b('Contract-first for the events that feed projections.', 'Contract-first untuk event yang mengisi proyeksi.'),
      b('Data-ownership map kept current — one page, one owner per dataset.', 'Peta kepemilikan data yang selalu mutakhir — satu halaman, satu pemilik per dataset.'),
    ],
    pitfalls: [
      b('The "integration database" backdoor that quietly reunifies everything.', 'Pintu belakang "integration database" yang diam-diam menyatukan kembali segalanya.'),
      b('Sagas without compensation design — half-completed workflows in production.', 'Saga tanpa desain kompensasi — alur kerja setengah-jadi di produksi.'),
      b('Reporting by querying every service live; build a warehouse/lake fed by events instead.', 'Pelaporan dengan mengueri tiap layanan secara langsung; bangun warehouse/lake yang diisi event sebagai gantinya.'),
    ],
  },
  'D3:cqrs': {
    goal: b(
      'Separated write model (commands) and read model (queries) for a slice where their shapes and loads genuinely diverge.',
      'Model tulis (command) dan model baca (query) yang terpisah untuk suatu irisan di mana bentuk dan bebannya benar-benar berbeda.',
    ),
    prerequisites: [
      b('Evidence: a real asymmetry (write contention vs read fan-out, or wildly different shapes).', 'Bukti: asimetri nyata (kontensi tulis vs fan-out baca, atau bentuk yang sangat berbeda).'),
      b('An event or CDC channel to keep the read side updated.', 'Kanal event atau CDC untuk menjaga sisi baca tetap diperbarui.'),
    ],
    steps: [
      b('Scope CQRS to the one slice that needs it — not the whole system.', 'Batasi CQRS ke satu irisan yang membutuhkannya — bukan seluruh sistem.'),
      b('Model commands with invariants enforced in the write model (aggregates).', 'Modelkan command dengan invarian yang ditegakkan di model tulis (aggregate).'),
      b('Project events/changes into read models shaped exactly for each query.', 'Proyeksikan event/perubahan ke read model yang dibentuk persis untuk tiap kueri.'),
      b('Measure and expose read-model staleness; make the UX honest about it.', 'Ukur dan tampilkan keusangan read-model; buat UX jujur soal itu.'),
      b('Automate projection rebuilds — they are your schema-change escape hatch.', 'Otomatiskan pembangunan-ulang proyeksi — itu jalan keluarmu untuk perubahan skema.'),
    ],
    practices: [
      b('Keep the write model minimal; resist querying it for lists.', 'Jaga model tulis minimal; tahan diri untuk mengueri-nya demi daftar.'),
      b('One projection per screen/use case beats a generic "read DB".', 'Satu proyeksi per layar/use case mengalahkan "read DB" generik.'),
      b('Version projections; rebuild rather than migrate them in place.', 'Versikan proyeksi; bangun ulang alih-alih memigrasinya di tempat.'),
    ],
    pitfalls: [
      b('System-wide CQRS by default — most slices never need it.', 'CQRS seluruh sistem secara default — kebanyakan irisan tak pernah membutuhkannya.'),
      b('Hiding staleness from users and then debugging "phantom" data complaints.', 'Menyembunyikan keusangan dari pengguna lalu men-debug keluhan data "hantu".'),
      b('Letting projections be written by multiple services — read models have one owner.', 'Membiarkan proyeksi ditulis banyak layanan — read model punya satu pemilik.'),
    ],
  },
  'D3:event-sourcing': {
    goal: b(
      'The event log as the source of truth for a domain where history itself is the requirement (ledgers, audit).',
      'Log event sebagai sumber kebenaran untuk domain di mana riwayat itu sendiri adalah kebutuhan (buku besar, audit).',
    ),
    prerequisites: [
      b('A domain where "what happened when" is a first-class requirement, not a nice-to-have.', 'Domain di mana "apa yang terjadi kapan" adalah kebutuhan kelas-satu, bukan sekadar tambahan.'),
      b('Team experience with CQRS/projections — ES without it is a trap.', 'Pengalaman tim dengan CQRS/proyeksi — ES tanpanya adalah jebakan.'),
    ],
    steps: [
      b('Model aggregates and their events; events are immutable, past-tense, and versioned.', 'Modelkan aggregate dan event-nya; event bersifat tak-berubah, lampau, dan berversi.'),
      b('Persist to an append-only store with optimistic concurrency per aggregate stream.', 'Simpan ke penyimpanan hanya-tambah dengan konkurensi optimistik per stream aggregate.'),
      b('Build projections for every read need; never query the log directly for UI.', 'Bangun proyeksi untuk tiap kebutuhan baca; jangan pernah mengueri log langsung untuk UI.'),
      b('Add snapshotting once aggregate streams grow long.', 'Tambahkan snapshotting begitu stream aggregate memanjang.'),
      b('Design upcasting for event schema evolution before you need it.', 'Rancang upcasting untuk evolusi skema event sebelum kamu membutuhkannya.'),
    ],
    practices: [
      b('Keep events business-meaningful (OrderPaid), not CRUD deltas (RowUpdated).', 'Jaga event bermakna-bisnis (OrderPaid), bukan delta CRUD (RowUpdated).'),
      b('Test aggregates by replaying event fixtures — it is the natural unit test.', 'Uji aggregate dengan memutar-ulang fixture event — itu unit test yang alami.'),
      b('Rehearse a full projection rebuild in staging regularly.', 'Latih pembangunan-ulang proyeksi penuh di staging secara berkala.'),
    ],
    pitfalls: [
      b('Event-sourcing the whole system because one context needed it.', 'Meng-event-source seluruh sistem karena satu konteks membutuhkannya.'),
      b('Treating events as an integration API — publish separate integration events.', 'Memperlakukan event sebagai API integrasi — publikasikan event integrasi yang terpisah.'),
      b('Underestimating schema evolution: renaming a field is a versioning project.', 'Meremehkan evolusi skema: mengganti nama field adalah proyek versioning.'),
    ],
  },
  'D3:polyglot': {
    goal: b(
      'The right store per workload (relational, document, search, cache, graph) with the operational cost consciously bounded.',
      'Penyimpanan yang tepat per beban kerja (relasional, dokumen, pencarian, cache, graph) dengan biaya operasional yang dibatasi secara sadar.',
    ),
    prerequisites: [
      b('Distinct access patterns proven by measurement, not preference.', 'Pola akses berbeda yang terbukti lewat pengukuran, bukan preferensi.'),
      b('Ops capacity (or managed services) for every engine you adopt.', 'Kapasitas ops (atau layanan terkelola) untuk tiap mesin yang kamu adopsi.'),
    ],
    steps: [
      b('Start from the query patterns; pick the smallest set of engines that serves them.', 'Mulai dari pola kueri; pilih himpunan mesin terkecil yang melayaninya.'),
      b('Designate one system of record per dataset; other stores are derived.', 'Tetapkan satu system of record per dataset; penyimpanan lain bersifat turunan.'),
      b('Feed derived stores via events/CDC with rebuildability.', 'Isi penyimpanan turunan lewat event/CDC dengan kemampuan bangun-ulang.'),
      b('Standardize backup, monitoring, and upgrade playbooks per engine.', 'Standarkan playbook backup, pemantauan, dan upgrade per mesin.'),
      b('Cap the portfolio: adding engine #N requires retiring or justifying against the cap.', 'Batasi portofolio: menambah mesin ke-N mengharuskan memensiunkan atau membenarkannya terhadap batas.'),
    ],
    practices: [
      b('Prefer managed offerings; your differentiation is not running databases.', 'Utamakan penawaran terkelola; diferensiasimu bukan menjalankan basis data.'),
      b('Consistency contracts documented per derived store (how stale can it be?).', 'Kontrak konsistensi terdokumentasi per penyimpanan turunan (seberapa usang ia boleh?).'),
      b('One team owns each engine’s operational excellence.', 'Satu tim memiliki keunggulan operasional tiap mesin.'),
    ],
    pitfalls: [
      b('Resume-driven database adoption — every engine is a standing tax.', 'Adopsi basis data demi CV — tiap mesin adalah pajak tetap.'),
      b('Two systems of record for one dataset "temporarily".', 'Dua system of record untuk satu dataset "sementara".'),
      b('Search/cache treated as source of truth and then "losing" data on rebuild.', 'Pencarian/cache diperlakukan sebagai sumber kebenaran lalu "kehilangan" data saat bangun-ulang.'),
    ],
  },

  // ───────────────────────── D4 · Code structure ─────────────────────────
  'D4:hexagonal': {
    goal: b(
      'A framework-agnostic domain core isolated behind ports, with adapters translating to web, DB, and external systems.',
      'Inti domain yang agnostik-framework terisolasi di balik port, dengan adapter yang menerjemahkan ke web, DB, dan sistem eksternal.',
    ),
    prerequisites: [
      b('Team agreement on what counts as domain logic vs adapter code.', 'Kesepakatan tim tentang apa yang termasuk logika domain vs kode adapter.'),
      b('A dependency rule check in CI (core must not import framework/IO).', 'Pemeriksaan aturan dependensi di CI (inti tak boleh mengimpor framework/IO).'),
    ],
    steps: [
      b('Define the core: entities, domain services, and port interfaces (driven + driving).', 'Definisikan inti: entity, service domain, dan antarmuka port (driven + driving).'),
      b('Implement adapters at the edge: HTTP controllers, repositories, clients — each maps to a port.', 'Implementasikan adapter di edge: controller HTTP, repository, client — masing-masing memetakan ke satu port.'),
      b('Wire adapters to ports in a thin composition root (DI container or manual).', 'Rangkai adapter ke port di composition root yang tipis (kontainer DI atau manual).'),
      b('Unit-test the core with fake ports; integration-test adapters against real tech.', 'Unit-test inti dengan port palsu; integration-test adapter terhadap teknologi nyata.'),
      b('Enforce direction in CI: imports point inward only.', 'Tegakkan arah di CI: impor hanya mengarah ke dalam.'),
    ],
    practices: [
      b('Ports speak domain language (SaveOrder), not tech language (insertRow).', 'Port berbicara bahasa domain (SaveOrder), bukan bahasa teknologi (insertRow).'),
      b('One adapter per technology concern; adapters stay thin and dumb.', 'Satu adapter per urusan teknologi; adapter tetap tipis dan bodoh.'),
      b('Let use-case tests read like specifications — that is the payoff.', 'Biarkan tes use-case terbaca seperti spesifikasi — itu imbalannya.'),
    ],
    pitfalls: [
      b('Leaking ORM entities or framework annotations into the core.', 'Membocorkan entity ORM atau anotasi framework ke dalam inti.'),
      b('Port interfaces that mirror a specific vendor API — you have adapters around adapters.', 'Antarmuka port yang mencerminkan API vendor tertentu — kamu punya adapter di sekitar adapter.'),
      b('Hexagon ceremony for a 2-week script — match the investment to the lifespan.', 'Seremoni hexagon untuk skrip 2 minggu — sesuaikan investasi dengan umurnya.'),
    ],
  },
  'D4:clean': {
    goal: b(
      'Concentric layers (entities → use cases → interface adapters → frameworks) with the dependency rule pointing strictly inward.',
      'Lapisan konsentris (entity → use case → interface adapter → framework) dengan aturan dependensi yang mengarah ketat ke dalam.',
    ),
    prerequisites: [
      b('A long-lived product that will outlive today’s framework choices.', 'Produk berumur panjang yang akan hidup lebih lama dari pilihan framework hari ini.'),
      b('CI enforcement of the inward dependency rule.', 'Penegakan CI atas aturan dependensi ke dalam.'),
    ],
    steps: [
      b('Model entities (enterprise rules) free of any framework import.', 'Modelkan entity (aturan enterprise) bebas dari impor framework apa pun.'),
      b('Express each application behavior as a use-case interactor with input/output boundaries.', 'Ungkapkan tiap perilaku aplikasi sebagai interactor use-case dengan batas input/output.'),
      b('Write interface adapters (controllers/presenters/gateways) that translate both ways.', 'Tulis interface adapter (controller/presenter/gateway) yang menerjemahkan dua arah.'),
      b('Keep frameworks in the outermost ring — replaceable details.', 'Jaga framework di cincin terluar — detail yang dapat diganti.'),
      b('Add architecture tests asserting ring dependencies (ArchUnit/dependency-cruiser).', 'Tambahkan architecture test yang menegaskan dependensi cincin (ArchUnit/dependency-cruiser).'),
    ],
    practices: [
      b('Screaming architecture: the top-level folders say what the system does, not which framework.', 'Screaming architecture: folder tingkat-atas menyatakan apa yang sistem lakukan, bukan framework mana.'),
      b('One use case per class/function keeps interactors testable and named.', 'Satu use case per kelas/fungsi menjaga interactor dapat diuji dan bernama.'),
      b('Presenters shape output for views; use cases stay UI-ignorant.', 'Presenter membentuk output untuk view; use case tetap tak-tahu-UI.'),
    ],
    pitfalls: [
      b('Ceremony overload on small apps — rings without value.', 'Kelebihan seremoni pada aplikasi kecil — cincin tanpa nilai.'),
      b('Anemic use cases that only delegate to services — collapse layers honestly instead.', 'Use case anemik yang hanya mendelegasikan ke service — runtuhkan lapisan secara jujur sebagai gantinya.'),
      b('Framework types (HTTP request, ORM entity) smuggled into use-case signatures.', 'Tipe framework (HTTP request, entity ORM) diselundupkan ke tanda tangan use-case.'),
    ],
  },
  'D4:vertical-slice': {
    goal: b(
      'Code organized by feature/use case, where each slice contains everything it needs — optimizing for change locality.',
      'Kode yang tersusun berdasarkan fitur/use case, di mana tiap irisan berisi segala yang dibutuhkannya — mengoptimalkan lokalitas perubahan.',
    ),
    prerequisites: [
      b('A team comfortable letting slices differ internally (no one-size layer template).', 'Tim yang nyaman membiarkan irisan berbeda secara internal (tanpa template lapisan seragam).'),
      b('Conventions for what may be shared (kernel) vs duplicated.', 'Konvensi tentang apa yang boleh dibagikan (kernel) vs diduplikasi.'),
    ],
    steps: [
      b('Create one folder per feature (PlaceOrder/, CancelOrder/) containing handler, model, and data access.', 'Buat satu folder per fitur (PlaceOrder/, CancelOrder/) berisi handler, model, dan akses data.'),
      b('Route each request straight to its slice handler (mediator or plain functions).', 'Arahkan tiap permintaan langsung ke handler irisannya (mediator atau fungsi biasa).'),
      b('Extract a small shared kernel ONLY for true invariants (domain types, auth).', 'Ekstrak shared kernel kecil HANYA untuk invarian sejati (tipe domain, auth).'),
      b('Test each slice end-to-end at the handler level — that is the natural seam.', 'Uji tiap irisan ujung-ke-ujung di level handler — itu jahitan alaminya.'),
      b('Refactor duplication only when three slices repeat it (rule of three).', 'Refaktor duplikasi hanya saat tiga irisan mengulanginya (rule of three).'),
    ],
    practices: [
      b('Let simple slices stay simple; complexity is opt-in per slice.', 'Biarkan irisan sederhana tetap sederhana; kompleksitas bersifat opt-in per irisan.'),
      b('Slice boundaries mirror user-facing capabilities, easing product conversations.', 'Batas irisan mencerminkan kapabilitas yang dihadapi pengguna, memudahkan percakapan produk.'),
      b('Keep cross-slice calls rare and explicit — prefer duplication over coupling.', 'Jaga panggilan antar-irisan langka dan eksplisit — utamakan duplikasi daripada kopling.'),
    ],
    pitfalls: [
      b('A "common" folder that regrows the horizontal layers you left.', 'Folder "common" yang menumbuhkan kembali lapisan horizontal yang kamu tinggalkan.'),
      b('Slices reaching into each other’s internals — invisible coupling returns.', 'Irisan yang menjangkau internal satu sama lain — kopling tak kasat mata kembali.'),
      b('Zero shared invariants: money/date/id types should not be re-invented per slice.', 'Nol invarian bersama: tipe uang/tanggal/id semestinya tak ditemukan-ulang per irisan.'),
    ],
  },
  'D4:layered': {
    goal: b(
      'Classic technical layering inside the deployable — quick, familiar, and adequate for small or stable domains.',
      'Layering teknis klasik di dalam deployable — cepat, familiar, dan memadai untuk domain kecil atau stabil.',
    ),
    prerequisites: [
      b('A domain simple/stable enough that change amplification stays tolerable.', 'Domain yang cukup sederhana/stabil sehingga amplifikasi perubahan tetap tertoleransi.'),
      b('Agreement on strict vs relaxed layering (may layers skip?).', 'Kesepakatan tentang layering ketat vs longgar (bolehkah lapisan dilompati?).'),
    ],
    steps: [
      b('Fix the layer set (e.g., controller → service → repository) and dependency direction.', 'Tetapkan himpunan lapisan (mis. controller → service → repository) dan arah dependensi.'),
      b('Keep domain logic in services; controllers translate, repositories persist.', 'Jaga logika domain di service; controller menerjemahkan, repository menyimpan.'),
      b('Ban upward imports via lint/CI.', 'Larang impor ke atas lewat lint/CI.'),
      b('Unit-test services with repository fakes.', 'Unit-test service dengan repository palsu.'),
      b('Watch change patterns: when every feature touches all layers, revisit (vertical slices).', 'Amati pola perubahan: saat tiap fitur menyentuh semua lapisan, tinjau ulang (vertical slice).'),
    ],
    practices: [
      b('Thin controllers, expressive services, dumb repositories.', 'Controller tipis, service ekspresif, repository bodoh.'),
      b('DTO mapping at boundaries to avoid leaking persistence shapes.', 'Pemetaan DTO di batas untuk menghindari bocornya bentuk persistensi.'),
      b('Name layers consistently across the codebase.', 'Namai lapisan secara konsisten di seluruh basis kode.'),
    ],
    pitfalls: [
      b('Business logic drifting into controllers or SQL.', 'Logika bisnis menyimpang ke controller atau SQL.'),
      b('The service layer becoming a transaction-script dumping ground.', 'Service layer menjadi tempat pembuangan transaction-script.'),
      b('Ceremonial layers that only forward calls.', 'Lapisan seremonial yang hanya meneruskan panggilan.'),
    ],
  },

  // ───────────────────────── D5 · Frontend architecture ─────────────────────────
  'D5:micro-frontends': {
    goal: b(
      'Independently built and deployed UI slices owned by separate teams, composed into one coherent product.',
      'Irisan UI yang dibangun dan di-deploy independen, dimiliki tim terpisah, dikomposisikan menjadi satu produk yang koheren.',
    ),
    prerequisites: [
      b('Multiple UI teams whose release trains genuinely block each other.', 'Beberapa tim UI yang jadwal rilisnya benar-benar saling menghambat.'),
      b('A design system (tokens + components) to keep the seams invisible.', 'Design system (token + komponen) untuk menjaga jahitannya tak kasat mata.'),
    ],
    steps: [
      b('Slice by user journey/domain (checkout, catalog), never by technical widget.', 'Iris berdasarkan perjalanan pengguna/domain (checkout, katalog), jangan pernah berdasarkan widget teknis.'),
      b('Choose one composition style (module federation, web components, or route-based) and standardize it.', 'Pilih satu gaya komposisi (module federation, web components, atau berbasis-rute) dan standarkan.'),
      b('Define shared contracts: design tokens, auth/session, analytics, routing events.', 'Definisikan kontrak bersama: design token, auth/sesi, analitik, event routing.'),
      b('Set performance budgets per slice; enforce shared framework/runtime deduplication.', 'Tetapkan anggaran performa per irisan; tegakkan deduplikasi framework/runtime bersama.'),
      b('Build a reference slice ("golden path") teams can copy.', 'Bangun irisan referensi ("golden path") yang bisa disalin tim.'),
    ],
    practices: [
      b('Independent deploys are the point — protect them with per-slice pipelines and contract tests.', 'Deploy independen adalah intinya — lindungi dengan pipeline per-irisan dan contract test.'),
      b('Cross-slice communication via documented events, not shared globals.', 'Komunikasi antar-irisan lewat event terdokumentasi, bukan global bersama.'),
      b('A platform team owns the shell, tokens, and federation glue.', 'Tim platform memiliki shell, token, dan perekat federasi.'),
    ],
    pitfalls: [
      b('Micro-frontends for one team — all the overhead, none of the payoff.', 'Micro-frontend untuk satu tim — semua bebannya, tanpa imbalannya.'),
      b('Duplicated framework bundles blowing the page weight — measure and dedupe.', 'Bundel framework terduplikasi yang meledakkan bobot halaman — ukur dan dedup.'),
      b('Inconsistent UX because the design system was "later".', 'UX tak konsisten karena design system dijadikan "nanti saja".'),
    ],
  },
  'D5:spa': {
    goal: b(
      'A single rich client application with client-side routing, optimized for interactivity and shipped as static assets.',
      'Satu aplikasi klien kaya dengan routing sisi-klien, dioptimalkan untuk interaktivitas dan dikirim sebagai aset statis.',
    ),
    prerequisites: [
      b('API endpoints designed for the client (or a BFF).', 'Endpoint API yang dirancang untuk klien (atau sebuah BFF).'),
      b('A bundler with code-splitting (Vite/rollup-class) and a bundle-size budget in CI.', 'Bundler dengan code-splitting (kelas Vite/rollup) dan anggaran ukuran bundel di CI.'),
    ],
    steps: [
      b('Scaffold with file/route-based code splitting and lazy loading for heavy views.', 'Siapkan dengan code-splitting berbasis berkas/rute dan lazy loading untuk tampilan berat.'),
      b('Centralize server state (query library) separate from UI state.', 'Pusatkan server state (pustaka kueri) terpisah dari UI state.'),
      b('Add route-level error and loading boundaries.', 'Tambahkan batas error dan loading di level rute.'),
      b('Wire performance budgets (initial JS, LCP) into CI.', 'Rangkai anggaran performa (JS awal, LCP) ke CI.'),
      b('Mitigate SEO/first-paint where needed: prerender or SSR the few public pages.', 'Mitigasi SEO/first-paint bila perlu: prerender atau SSR beberapa halaman publik.'),
    ],
    practices: [
      b('Accessibility from the start: focus management on route change, semantic landmarks.', 'Aksesibilitas sejak awal: manajemen fokus saat perpindahan rute, landmark semantik.'),
      b('Persist minimal state in the URL so views are shareable.', 'Simpan state minimal di URL agar tampilan dapat dibagikan.'),
      b('Lazy-load below-the-fold and admin surfaces aggressively.', 'Lazy-load area below-the-fold dan permukaan admin secara agresif.'),
    ],
    pitfalls: [
      b('A single monolithic bundle — interactivity you can’t reach in time.', 'Satu bundel monolitik — interaktivitas yang tak bisa kamu capai tepat waktu.'),
      b('Recreating a server-cache in Redux by hand — use a data-fetch layer.', 'Membuat ulang server-cache di Redux secara manual — pakai lapisan data-fetch.'),
      b('Ignoring first-paint on content pages that actually needed SSR/SSG.', 'Mengabaikan first-paint pada halaman konten yang sebenarnya butuh SSR/SSG.'),
    ],
  },
  'D5:ssr': {
    goal: b(
      'Server-rendered (or statically generated) pages with fast first paint and SEO, hydrating into interactivity where needed.',
      'Halaman yang dirender server (atau dihasilkan statis) dengan first paint cepat dan SEO, meng-hydrate menjadi interaktif di tempat yang diperlukan.',
    ),
    prerequisites: [
      b('A rendering strategy per route class: static (SSG), incremental, or per-request SSR.', 'Strategi rendering per kelas rute: statis (SSG), inkremental, atau SSR per-permintaan.'),
      b('Hosting that matches it (static CDN vs node/edge runtime).', 'Hosting yang cocok dengannya (CDN statis vs runtime node/edge).'),
    ],
    steps: [
      b('Classify routes: marketing/docs → SSG; personalized → SSR; app-like → hybrid/islands.', 'Klasifikasikan rute: marketing/dokumen → SSG; terpersonalisasi → SSR; ala-aplikasi → hibrida/islands.'),
      b('Implement data fetching at the route level with caching headers thought through.', 'Implementasikan pengambilan data di level rute dengan header caching yang dipikirkan matang.'),
      b('Keep hydration cost low: islands/partial hydration for mostly-static pages.', 'Jaga biaya hydration rendah: islands/partial hydration untuk halaman yang sebagian besar statis.'),
      b('Set cache/CDN rules (stale-while-revalidate) per route class.', 'Tetapkan aturan cache/CDN (stale-while-revalidate) per kelas rute.'),
      b('Measure Core Web Vitals in CI or field monitoring; they are the point of SSR.', 'Ukur Core Web Vitals di CI atau pemantauan lapangan; itulah inti dari SSR.'),
    ],
    practices: [
      b('Prefer static generation wherever data allows — cheapest and fastest by design.', 'Utamakan generasi statis di mana pun data memungkinkan — termurah dan tercepat secara desain.'),
      b('Stream HTML for slow data so first paint never waits for the slowest query.', 'Alirkan HTML untuk data lambat agar first paint tak pernah menunggu kueri terlambat.'),
      b('One source of truth for head/meta/canonical tags.', 'Satu sumber kebenaran untuk tag head/meta/canonical.'),
    ],
    pitfalls: [
      b('SSR-ing everything, including pages a CDN could have served statically.', 'Meng-SSR segalanya, termasuk halaman yang bisa dilayani CDN secara statis.'),
      b('Hydration mismatches from non-deterministic render (dates, random) — render deterministically.', 'Ketidakcocokan hydration dari render non-deterministik (tanggal, acak) — render secara deterministik.'),
      b('Session logic in edge/server render paths that breaks cacheability silently.', 'Logika sesi di jalur render edge/server yang diam-diam merusak kemampuan-cache.'),
    ],
  },
};
