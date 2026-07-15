import type { Bilingual } from '../types';

// Library lens — evergreen reference material for EVERY architecture the Advisor evaluates
// (all 21 D1–D5 options), keyed `${dim}:${optionId}`. Bilingual EN/ID (rendered via tr()): the
// prose — definition, concepts, and each glossary term's explanation — is translated, while the
// pattern names and glossary terms themselves stay as their canonical (English) proper nouns, per
// standard i18n practice. Each entry is a knowledge-base card complementing (not repeating) the
// Catalog's plain-language explanation. The standards/literature links reuse the option's
// READER_CITATIONS. Parity is test-enforced.

const b = (en: string, id: string): Bilingual => ({ en, id });

export interface ArchLibraryRef {
  /** A precise, quotable definition. */
  definition: Bilingual;
  /** The underlying concepts/principles that make it work. */
  concepts: Bilingual[];
  /** Related/constituent patterns worth knowing by name (canonical proper nouns; not translated). */
  patterns: string[];
  /** Terminology: term (canonical name) → short definition (translated). */
  terms: { term: string; def: Bilingual }[];
}

export const INSIGHT_LIBRARY: Record<string, ArchLibraryRef> = {
  // ───────────────────────── D1 · Deployment granularity ─────────────────────────
  'D1:layered': {
    definition: b(
      'An architectural style that partitions a single deployable into horizontal layers of technical responsibility, where each layer may depend only on the layer(s) beneath it.',
      'Gaya arsitektur yang membagi satu deployable menjadi lapisan-lapisan horizontal berdasarkan tanggung jawab teknis, di mana tiap lapisan hanya boleh bergantung pada lapisan di bawahnya.',
    ),
    concepts: [
      b('Separation of concerns by technical role (presentation, domain, persistence).', 'Pemisahan tanggung jawab berdasarkan peran teknis (presentasi, domain, persistensi).'),
      b('Unidirectional dependency flow (closed vs open/relaxed layering).', 'Aliran dependensi satu arah (layering tertutup vs terbuka/longgar).'),
      b('Abstraction of lower layers behind interfaces.', 'Abstraksi lapisan bawah di balik antarmuka.'),
    ],
    patterns: ['Presentation–Domain–Data separation', 'Repository', 'Service Layer', 'DTO / Mapper'],
    terms: [
      { term: 'Closed layering', def: b('Each layer may call only the layer directly below it.', 'Tiap lapisan hanya boleh memanggil lapisan tepat di bawahnya.') },
      { term: 'Layer bridging', def: b('Skipping a layer (allowed only in relaxed/open layering).', 'Melewati satu lapisan (hanya diizinkan pada layering longgar/terbuka).') },
      { term: 'Change amplification', def: b('One feature change forcing edits across many layers — the style’s known weakness.', 'Satu perubahan fitur memaksa suntingan di banyak lapisan — kelemahan yang dikenal dari gaya ini.') },
    ],
  },
  'D1:monolith': {
    definition: b(
      'A deployment style in which the entire application is built, released, and run as a single deployable unit sharing one process space and, typically, one database.',
      'Gaya deployment di mana seluruh aplikasi dibangun, dirilis, dan dijalankan sebagai satu unit deployable yang berbagi satu ruang proses dan, umumnya, satu basis data.',
    ),
    concepts: [
      b('Single build/release/runtime unit; in-process communication.', 'Satu unit build/rilis/runtime; komunikasi dalam-proses.'),
      b('Strong (ACID) consistency via one transactional store.', 'Konsistensi kuat (ACID) lewat satu penyimpanan transaksional.'),
      b('Deployment coupling: all capabilities ship together.', 'Kopling deployment: semua kapabilitas dirilis bersama.'),
    ],
    patterns: ['Monolith First', 'Blue‑green / rolling deployment', 'Feature flags', 'Vertical + horizontal (replica) scaling'],
    terms: [
      { term: 'Deployment coupling', def: b('All parts must be released together as one unit.', 'Semua bagian harus dirilis bersama sebagai satu unit.') },
      { term: 'Blast radius', def: b('The scope of impact when a deploy or fault goes wrong — here, the whole app.', 'Cakupan dampak saat deploy atau kegagalan bermasalah — di sini, seluruh aplikasi.') },
      { term: 'Big ball of mud', def: b('A monolith without internal structure; the failure mode, not the definition.', 'Monolith tanpa struktur internal; mode kegagalannya, bukan definisinya.') },
    ],
  },
  'D1:modular-monolith': {
    definition: b(
      'A monolith whose internal code is partitioned into modules with explicitly enforced boundaries — typically aligned to bounded contexts — while remaining one deployable.',
      'Monolith yang kode internalnya dibagi menjadi modul-modul dengan batas yang ditegakkan secara eksplisit — biasanya selaras dengan bounded context — namun tetap satu deployable.',
    ),
    concepts: [
      b('Logical (module) boundaries decoupled from physical (deploy) boundaries.', 'Batas logis (modul) dipisahkan dari batas fisik (deploy).'),
      b('Bounded contexts as the module cut lines (DDD).', 'Bounded context sebagai garis pemisah modul (DDD).'),
      b('Enforcement via tooling: architecture tests / dependency rules in CI.', 'Penegakan lewat perkakas: architecture test / aturan dependensi di CI.'),
    ],
    patterns: ['Bounded Context', 'Published (module) API', 'In-process domain events', 'Strangler Fig (as the exit path)'],
    terms: [
      { term: 'Module boundary', def: b('A compile-time contract: only the module’s public API may be imported.', 'Kontrak saat kompilasi: hanya API publik modul yang boleh diimpor.') },
      { term: 'Context map', def: b('A DDD artifact describing how bounded contexts relate and integrate.', 'Artefak DDD yang menjelaskan bagaimana bounded context berhubungan dan berintegrasi.') },
      { term: 'Fitness function', def: b('An automated check (e.g., dependency test) guarding an architectural property.', 'Pemeriksaan otomatis (mis. dependency test) yang menjaga properti arsitektur.') },
    ],
  },
  'D1:microservices': {
    definition: b(
      'An architectural style structuring an application as a suite of small, independently deployable services, each running in its own process, owning its data, and communicating over a network.',
      'Gaya arsitektur yang menyusun aplikasi sebagai sekumpulan layanan kecil yang dapat di-deploy secara independen, masing-masing berjalan di prosesnya sendiri, memiliki datanya sendiri, dan berkomunikasi lewat jaringan.',
    ),
    concepts: [
      b('Independent deployability as the defining property (Newman).', 'Kemampuan deploy independen sebagai properti pendefinisi (Newman).'),
      b('Decentralized data: database-per-service; smart endpoints, dumb pipes.', 'Data terdesentralisasi: database-per-service; smart endpoint, dumb pipe.'),
      b('Organizational alignment: services ↔ teams (Conway’s Law).', 'Keselarasan organisasi: layanan ↔ tim (Hukum Conway).'),
    ],
    patterns: ['API Gateway', 'Service Registry/Discovery', 'Circuit Breaker', 'Saga', 'Transactional Outbox', 'Strangler Fig', 'Sidecar'],
    terms: [
      { term: 'Bounded context', def: b('The DDD boundary a well-cut service typically maps to.', 'Batas DDD yang biasanya dipetakan oleh layanan yang dipotong dengan baik.') },
      { term: 'Distributed monolith', def: b('Services that must deploy together — distribution’s cost without its benefits.', 'Layanan yang harus di-deploy bersama — biaya distribusi tanpa manfaatnya.') },
      { term: 'Eventual consistency', def: b('Cross-service state converges over time instead of within one transaction.', 'Keadaan lintas-layanan menyatu seiring waktu, bukan dalam satu transaksi.') },
      { term: 'Service mesh', def: b('Infrastructure layer (proxies) handling service-to-service traffic concerns.', 'Lapisan infrastruktur (proxy) yang menangani urusan trafik antar-layanan.') },
    ],
  },
  'D1:serverless': {
    definition: b(
      'A cloud execution model (Functions-as-a-Service) where code runs in ephemeral, provider-managed units that scale automatically — including to zero — and are billed per use.',
      'Model eksekusi cloud (Functions-as-a-Service) di mana kode berjalan dalam unit ephemeral yang dikelola penyedia, menskala otomatis — termasuk ke nol — dan ditagih per pemakaian.',
    ),
    concepts: [
      b('Ephemeral, stateless compute; state externalized to managed services.', 'Komputasi ephemeral dan stateless; state dieksternalisasi ke layanan terkelola.'),
      b('Scale-to-zero economics and provider-managed elasticity.', 'Ekonomi scale-to-zero dan elastisitas yang dikelola penyedia.'),
      b('Event-triggered invocation as the composition model.', 'Invokasi yang dipicu event sebagai model komposisi.'),
    ],
    patterns: ['Function per event', 'Queue-based load leveling', 'Fan-out/fan-in', 'Orchestration via workflow services (e.g., state machines)'],
    terms: [
      { term: 'Cold start', def: b('Extra latency when the platform provisions a fresh function instance.', 'Latensi ekstra saat platform menyiapkan instance fungsi yang baru.') },
      { term: 'Provisioned concurrency', def: b('Pre-warmed instances trading cost for tail latency.', 'Instance yang dipanaskan lebih dulu, menukar biaya demi tail latency.') },
      { term: 'BaaS', def: b('Backend-as-a-Service — managed building blocks (auth, storage) FaaS composes with.', 'Backend-as-a-Service — blok bangunan terkelola (auth, storage) yang dipadukan FaaS.') },
    ],
  },

  // ───────────────────────── D2 · Communication style ─────────────────────────
  'D2:synchronous': {
    definition: b(
      'A communication style in which the caller sends a request and blocks (logically) until the callee returns a response — REST and gRPC being the canonical implementations.',
      'Gaya komunikasi di mana pemanggil mengirim permintaan dan menunggu (secara logis) sampai yang dipanggil mengembalikan respons — REST dan gRPC sebagai implementasi kanoniknya.',
    ),
    concepts: [
      b('Temporal coupling: both parties must be available simultaneously.', 'Kopling temporal: kedua pihak harus tersedia bersamaan.'),
      b('Availability multiplication along call chains.', 'Perkalian ketersediaan di sepanjang rantai pemanggilan.'),
      b('Contract-first interface design (OpenAPI/Protobuf).', 'Desain antarmuka contract-first (OpenAPI/Protobuf).'),
    ],
    patterns: ['Request–Response', 'Circuit Breaker', 'Retry with backoff + jitter', 'Idempotency key', 'Backend for Frontend (BFF)'],
    terms: [
      { term: 'Timeout budget', def: b('The per-hop latency allowance derived from the end-to-end SLO.', 'Alokasi latensi per-hop yang diturunkan dari SLO ujung-ke-ujung.') },
      { term: 'Idempotency', def: b('Property allowing safe retries: repeating a call yields the same effect.', 'Properti yang memungkinkan retry aman: mengulang panggilan memberi efek yang sama.') },
      { term: 'Fan-out', def: b('One request triggering parallel downstream calls.', 'Satu permintaan yang memicu panggilan hilir secara paralel.') },
    ],
  },
  'D2:async-messaging': {
    definition: b(
      'A communication style in which producers place messages on a broker-managed channel and consumers process them independently in time — decoupling sender and receiver availability.',
      'Gaya komunikasi di mana produser menaruh pesan pada kanal yang dikelola broker dan konsumer memprosesnya secara independen dalam waktu — memisahkan ketersediaan pengirim dan penerima.',
    ),
    concepts: [
      b('Temporal decoupling and load leveling via queues.', 'Pemisahan temporal dan perataan beban lewat antrean.'),
      b('Delivery semantics: at-most-once / at-least-once / effectively-once.', 'Semantik pengiriman: at-most-once / at-least-once / effectively-once.'),
      b('Poison-message isolation (dead-letter queues).', 'Isolasi pesan bermasalah (dead-letter queue).'),
    ],
    patterns: ['Point-to-point queue', 'Competing Consumers', 'Dead Letter Queue', 'Transactional Outbox', 'Claim Check'],
    terms: [
      { term: 'At-least-once', def: b('The common guarantee: duplicates possible, loss not — consumers must be idempotent.', 'Jaminan umum: duplikat mungkin, kehilangan tidak — konsumer harus idempoten.') },
      { term: 'Consumer lag', def: b('Backlog between produced and processed messages; the health metric.', 'Tunggakan antara pesan yang diproduksi dan diproses; metrik kesehatannya.') },
      { term: 'Backpressure', def: b('Mechanisms preventing producers from overwhelming consumers.', 'Mekanisme yang mencegah produser membanjiri konsumer.') },
    ],
  },
  'D2:event-driven': {
    definition: b(
      'A style in which components emit events — immutable records of domain facts — and other components react by subscription, without the producer knowing its consumers.',
      'Gaya di mana komponen memancarkan event — catatan fakta domain yang tak berubah — dan komponen lain bereaksi lewat langganan, tanpa produser mengetahui konsumernya.',
    ),
    concepts: [
      b('Publish/subscribe topology; producer–consumer ignorance.', 'Topologi publish/subscribe; produser dan konsumer saling tak mengenal.'),
      b('Events as facts (past tense) vs commands as requests.', 'Event sebagai fakta (lampau) vs command sebagai permintaan.'),
      b('Choreography (reactive flows) vs orchestration (central coordinator).', 'Koreografi (alur reaktif) vs orkestrasi (koordinator terpusat).'),
    ],
    patterns: ['Publish–Subscribe', 'Event Notification vs Event-Carried State Transfer', 'Saga (choreographed)', 'Event Catalog / Schema Registry'],
    terms: [
      { term: 'Choreography', def: b('Workflow emerging from services reacting to each other’s events.', 'Alur kerja yang muncul dari layanan yang saling bereaksi terhadap event.') },
      { term: 'Orchestration', def: b('A coordinator explicitly directing the workflow steps.', 'Koordinator yang secara eksplisit mengarahkan langkah-langkah alur kerja.') },
      { term: 'Event storming', def: b('A workshop technique for discovering domain events and boundaries.', 'Teknik workshop untuk menemukan event domain dan batasnya.') },
    ],
  },
  'D2:streaming': {
    definition: b(
      'A data-in-motion style built on ordered, partitioned, replayable logs, where consumers track offsets and process unbounded event sequences continuously.',
      'Gaya data-bergerak yang dibangun di atas log yang terurut, terpartisi, dan dapat diputar ulang, di mana konsumer melacak offset dan memproses urutan event tak berbatas secara kontinu.',
    ),
    concepts: [
      b('The log as durable, re-readable history (not a transient queue).', 'Log sebagai riwayat yang tahan lama dan dapat dibaca ulang (bukan antrean sementara).'),
      b('Partitioning for parallelism; ordering guaranteed per partition.', 'Partisi untuk paralelisme; urutan dijamin per partisi.'),
      b('Stream–table duality: a table is a view of a stream.', 'Dualitas stream–tabel: tabel adalah tampilan dari sebuah stream.'),
    ],
    patterns: ['Log-based pub/sub', 'Change Data Capture (CDC)', 'Materialized View', 'Windowing (tumbling/sliding)', 'Exactly-once processing (transactions)'],
    terms: [
      { term: 'Offset', def: b('A consumer’s position in a partition — the replay/recovery cursor.', 'Posisi konsumer dalam sebuah partisi — kursor putar-ulang/pemulihan.') },
      { term: 'Compaction', def: b('Log retention keeping only the latest record per key.', 'Retensi log yang hanya menyimpan catatan terbaru per kunci.') },
      { term: 'Watermark', def: b('A processor’s notion of event-time progress for handling lateness.', 'Gagasan prosesor tentang kemajuan waktu-event untuk menangani keterlambatan.') },
    ],
  },

  // ───────────────────────── D3 · Data management ─────────────────────────
  'D3:single-db': {
    definition: b(
      'A data architecture in which all application components read and write one shared database, giving system-wide ACID transactions at the cost of schema-level coupling.',
      'Arsitektur data di mana semua komponen aplikasi membaca dan menulis ke satu basis data bersama, memberi transaksi ACID seluruh sistem dengan biaya kopling di tingkat skema.',
    ),
    concepts: [
      b('ACID transactions as the consistency mechanism.', 'Transaksi ACID sebagai mekanisme konsistensi.'),
      b('The schema as a shared (and therefore coupling) contract.', 'Skema sebagai kontrak bersama (dan karenanya menimbulkan kopling).'),
      b('Read scaling via replication; write scaling bounded by one primary.', 'Penskalaan baca lewat replikasi; penskalaan tulis dibatasi satu primary.'),
    ],
    patterns: ['Shared Database (pattern and anti-pattern, by context)', 'Read Replicas', 'Expand–Contract (parallel change) migrations'],
    terms: [
      { term: 'ACID', def: b('Atomicity, Consistency, Isolation, Durability — the transactional guarantees.', 'Atomicity, Consistency, Isolation, Durability — jaminan transaksionalnya.') },
      { term: 'Expand–contract', def: b('Zero-downtime schema change: add new, migrate, remove old.', 'Perubahan skema tanpa downtime: tambah yang baru, migrasi, hapus yang lama.') },
      { term: 'Integration database', def: b('Systems integrating by sharing tables — the notorious coupling anti-pattern.', 'Sistem yang berintegrasi dengan berbagi tabel — anti-pattern kopling yang terkenal.') },
    ],
  },
  'D3:db-per-service': {
    definition: b(
      'A data architecture in which each service exclusively owns its data store; other services access that data only through the owner’s API or published events.',
      'Arsitektur data di mana tiap layanan memiliki penyimpanan datanya secara eksklusif; layanan lain mengakses data itu hanya lewat API pemilik atau event yang dipublikasikan.',
    ),
    concepts: [
      b('Data ownership as the encapsulation boundary.', 'Kepemilikan data sebagai batas enkapsulasi.'),
      b('Sagas + outbox replacing distributed transactions.', 'Saga + outbox menggantikan transaksi terdistribusi.'),
      b('Consumer-owned projections replacing cross-service joins.', 'Proyeksi milik konsumer menggantikan join lintas-layanan.'),
    ],
    patterns: ['Database per Service', 'Saga (orchestrated/choreographed)', 'Transactional Outbox', 'API Composition', 'CQRS projection'],
    terms: [
      { term: 'Saga', def: b('A sequence of local transactions with compensating actions on failure.', 'Rangkaian transaksi lokal dengan aksi kompensasi saat gagal.') },
      { term: 'Compensating transaction', def: b('The explicit “undo” for an already-committed saga step.', '"Undo" eksplisit untuk langkah saga yang sudah ter-commit.') },
      { term: 'Projection', def: b('A consumer-maintained read copy derived from another service’s events.', 'Salinan-baca yang dipelihara konsumer, diturunkan dari event layanan lain.') },
    ],
  },
  'D3:cqrs': {
    definition: b(
      'Command Query Responsibility Segregation: an architectural pattern separating the model that processes state changes (commands) from the model(s) that answer queries.',
      'Command Query Responsibility Segregation: pola arsitektur yang memisahkan model yang memproses perubahan state (command) dari model yang menjawab kueri.',
    ),
    concepts: [
      b('Command/query asymmetry as the driving force.', 'Asimetri command/query sebagai daya penggeraknya.'),
      b('Purpose-built read models (one per query need).', 'Model-baca yang dibuat khusus (satu per kebutuhan kueri).'),
      b('Staleness as an explicit, designed property.', 'Keusangan sebagai properti yang eksplisit dan dirancang.'),
    ],
    patterns: ['Command model / Aggregate', 'Materialized View', 'Event-driven projection', 'Task-based UI'],
    terms: [
      { term: 'Aggregate', def: b('A consistency boundary processing commands and guarding invariants (DDD).', 'Batas konsistensi yang memproses command dan menjaga invarian (DDD).') },
      { term: 'Read model', def: b('A query-shaped, denormalized representation fed from the write side.', 'Representasi ternormalisasi-balik berbentuk kueri yang disuplai dari sisi tulis.') },
      { term: 'Rebuild', def: b('Regenerating a projection from source events/changes — the schema-change escape hatch.', 'Membangun ulang proyeksi dari event/perubahan sumber — jalan keluar untuk perubahan skema.') },
    ],
  },
  'D3:event-sourcing': {
    definition: b(
      'A persistence pattern in which state changes are stored as an append-only sequence of domain events, and current state is derived by replaying (folding) those events.',
      'Pola persistensi di mana perubahan state disimpan sebagai urutan event domain yang hanya-tambah, dan state saat ini diturunkan dengan memutar-ulang (melipat) event tersebut.',
    ),
    concepts: [
      b('The event log as the system of record; state as a fold over events.', 'Log event sebagai system of record; state sebagai lipatan atas event.'),
      b('Immutability and audit-by-construction.', 'Ketakberubahan dan audit-secara-konstruksi.'),
      b('Schema evolution via upcasting/versioned events.', 'Evolusi skema lewat upcasting/event berversi.'),
    ],
    patterns: ['Event Store', 'Snapshot', 'Upcaster', 'CQRS (near-mandatory companion)', 'Temporal query'],
    terms: [
      { term: 'Event stream', def: b('The ordered events of one aggregate instance.', 'Event terurut dari satu instance aggregate.') },
      { term: 'Snapshot', def: b('A cached fold of a long stream to bound replay time.', 'Lipatan yang di-cache dari stream panjang untuk membatasi waktu putar-ulang.') },
      { term: 'Upcasting', def: b('Transforming old event versions to the current schema on read.', 'Mengubah versi event lama ke skema saat ini ketika dibaca.') },
    ],
  },
  'D3:polyglot': {
    definition: b(
      'The deliberate use of multiple, specialized data stores within one system, each chosen for a workload’s access pattern, with derived stores synchronized from a designated system of record.',
      'Penggunaan sengaja beberapa penyimpanan data terspesialisasi dalam satu sistem, masing-masing dipilih untuk pola akses suatu beban kerja, dengan penyimpanan turunan disinkronkan dari suatu system of record.',
    ),
    concepts: [
      b('Workload-to-engine fit (relational, document, key-value, search, graph, columnar).', 'Kecocokan beban-kerja dengan mesin (relasional, dokumen, key-value, pencarian, graph, kolumnar).'),
      b('System-of-record vs derived-store roles.', 'Peran system-of-record vs penyimpanan turunan.'),
      b('Synchronization contracts (freshness, rebuildability).', 'Kontrak sinkronisasi (kesegaran, kemampuan bangun-ulang).'),
    ],
    patterns: ['Cache-Aside', 'CDC-fed search/analytics indexes', 'Materialized views across engines', 'Data lake/warehouse off the OLTP path'],
    terms: [
      { term: 'System of record', def: b('The single authoritative store for a dataset.', 'Satu-satunya penyimpanan otoritatif untuk suatu dataset.') },
      { term: 'Derived store', def: b('A rebuildable copy optimized for one access pattern.', 'Salinan yang dapat dibangun ulang, dioptimalkan untuk satu pola akses.') },
      { term: 'CDC', def: b('Change Data Capture — streaming a store’s changes to feed others.', 'Change Data Capture — mengalirkan perubahan sebuah penyimpanan untuk mengisi yang lain.') },
    ],
  },

  // ───────────────────────── D4 · Code structure ─────────────────────────
  'D4:hexagonal': {
    definition: b(
      'Ports & Adapters (Cockburn): an application core exposing technology-neutral ports, with interchangeable adapters connecting those ports to the outside world (UI, DB, services).',
      'Ports & Adapters (Cockburn): inti aplikasi yang memaparkan port yang netral-teknologi, dengan adapter yang dapat dipertukarkan menghubungkan port itu ke dunia luar (UI, DB, layanan).',
    ),
    concepts: [
      b('Dependency inversion at the architectural scale.', 'Inversi dependensi pada skala arsitektur.'),
      b('Symmetry: driving (primary) vs driven (secondary) sides.', 'Simetri: sisi driving (primer) vs driven (sekunder).'),
      b('Testability via port substitution (fakes at the boundary).', 'Kemampuan uji lewat substitusi port (fake di batas).'),
    ],
    patterns: ['Port (interface)', 'Adapter', 'Composition Root / DI', 'Anti-Corruption Layer'],
    terms: [
      { term: 'Driving adapter', def: b('Inbound technology invoking the core (HTTP controller, CLI).', 'Teknologi masuk yang memanggil inti (controller HTTP, CLI).') },
      { term: 'Driven adapter', def: b('Outbound implementation the core calls through a port (repository, client).', 'Implementasi keluar yang dipanggil inti lewat port (repository, client).') },
      { term: 'Composition root', def: b('The single place where ports are wired to concrete adapters.', 'Satu tempat di mana port dirangkai ke adapter konkret.') },
    ],
  },
  'D4:clean': {
    definition: b(
      'Clean Architecture (Martin): concentric layers — Entities, Use Cases, Interface Adapters, Frameworks — governed by the Dependency Rule: source dependencies point only inward.',
      'Clean Architecture (Martin): lapisan konsentris — Entities, Use Cases, Interface Adapters, Frameworks — yang diatur Dependency Rule: dependensi kode hanya mengarah ke dalam.',
    ),
    concepts: [
      b('The Dependency Rule as the single organizing law.', 'Dependency Rule sebagai satu-satunya hukum pengatur.'),
      b('Entities (enterprise rules) vs Use Cases (application rules).', 'Entities (aturan enterprise) vs Use Cases (aturan aplikasi).'),
      b('Frameworks as replaceable details at the rim.', 'Framework sebagai detail yang dapat diganti di tepi luar.'),
    ],
    patterns: ['Use Case / Interactor', 'Input/Output Boundary', 'Presenter', 'Gateway'],
    terms: [
      { term: 'Interactor', def: b('A use-case object orchestrating entities to fulfill one application behavior.', 'Objek use-case yang mengorkestrasi entity untuk memenuhi satu perilaku aplikasi.') },
      { term: 'Boundary', def: b('The interface pair crossing a ring without violating the Dependency Rule.', 'Pasangan antarmuka yang melintasi sebuah cincin tanpa melanggar Dependency Rule.') },
      { term: 'Screaming architecture', def: b('Top-level structure that announces the domain, not the framework.', 'Struktur tingkat-atas yang menyuarakan domain, bukan framework.') },
    ],
  },
  'D4:vertical-slice': {
    definition: b(
      'A code organization style in which each feature (request → response path) is implemented as a self-contained slice, minimizing cross-feature coupling instead of enforcing global layers.',
      'Gaya pengorganisasian kode di mana tiap fitur (jalur request → response) diimplementasikan sebagai irisan mandiri, meminimalkan kopling antar-fitur alih-alih menegakkan lapisan global.',
    ),
    concepts: [
      b('Change locality over structural uniformity.', 'Lokalitas perubahan di atas keseragaman struktural.'),
      b('Per-slice, opt-in complexity (CQRS-ish handlers where needed).', 'Kompleksitas per-irisan yang bersifat opt-in (handler ala-CQRS bila perlu).'),
      b('A minimal shared kernel for true invariants only.', 'Shared kernel minimal hanya untuk invarian sejati.'),
    ],
    patterns: ['Feature folder', 'Request handler (mediator)', 'Shared Kernel', 'Rule of Three (for extracting duplication)'],
    terms: [
      { term: 'Slice', def: b('Everything one feature needs, colocated: endpoint, logic, data access.', 'Segala yang dibutuhkan satu fitur, dikumpulkan bersama: endpoint, logika, akses data.') },
      { term: 'Shared kernel', def: b('The small, deliberately shared core (domain types, auth) slices may use.', 'Inti kecil yang sengaja dibagikan (tipe domain, auth) yang boleh dipakai irisan.') },
      { term: 'Rule of three', def: b('Tolerate duplication twice; extract on the third occurrence.', 'Toleransi duplikasi dua kali; ekstrak pada kemunculan ketiga.') },
    ],
  },
  'D4:layered': {
    definition: b(
      'The application-internal variant of layering: code grouped by technical role (e.g., controllers, services, repositories) with downward-only dependencies.',
      'Varian layering di dalam aplikasi: kode dikelompokkan berdasarkan peran teknis (mis. controller, service, repository) dengan dependensi hanya ke bawah.',
    ),
    concepts: [
      b('Technical cohesion (all controllers together) vs domain cohesion.', 'Kohesi teknis (semua controller bersama) vs kohesi domain.'),
      b('The service layer as the transaction/use-case boundary.', 'Service layer sebagai batas transaksi/use-case.'),
      b('Known erosion mode: god services and anemic domain models.', 'Mode erosi yang dikenal: god service dan model domain anemik.'),
    ],
    patterns: ['Controller–Service–Repository', 'Transaction Script', 'Anemic vs Rich domain model (the debate this style hosts)'],
    terms: [
      { term: 'Transaction script', def: b('Procedural use-case logic in a service method — fine small, unwieldy large.', 'Logika use-case prosedural dalam sebuah metode service — baik saat kecil, tak terkendali saat besar.') },
      { term: 'Anemic model', def: b('Entities as data bags with logic exiled to services.', 'Entity sebagai kantong data dengan logika diasingkan ke service.') },
      { term: 'God service', def: b('A service class that accreted every rule the layers had no better home for.', 'Kelas service yang menumpuk setiap aturan yang tak punya tempat lebih baik di lapisan lain.') },
    ],
  },

  // ───────────────────────── D5 · Frontend architecture ─────────────────────────
  'D5:micro-frontends': {
    definition: b(
      'An architectural style extending microservice ideas to the UI: independently developed and deployed frontend slices, owned by autonomous teams, composed into a single user experience.',
      'Gaya arsitektur yang memperluas ide microservice ke UI: irisan frontend yang dikembangkan dan di-deploy secara independen, dimiliki tim otonom, dikomposisikan menjadi satu pengalaman pengguna.',
    ),
    concepts: [
      b('Team-aligned vertical slices of the UI (Conway, applied deliberately).', 'Irisan vertikal UI yang selaras-tim (Conway, diterapkan secara sengaja).'),
      b('Composition strategies: build-time, runtime (module federation), or edge/server-side.', 'Strategi komposisi: saat-build, saat-runtime (module federation), atau di edge/sisi-server.'),
      b('Shared contracts: design tokens, routing, auth/session, analytics.', 'Kontrak bersama: design token, routing, auth/sesi, analitik.'),
    ],
    patterns: ['Module Federation', 'Web Components composition', 'App Shell', 'Design System / Token pipeline'],
    terms: [
      { term: 'Host/remote', def: b('Federation roles: the shell (host) loading team bundles (remotes).', 'Peran federasi: shell (host) yang memuat bundel tim (remote).') },
      { term: 'Runtime dedup', def: b('Sharing one framework instance across slices to control page weight.', 'Berbagi satu instance framework antar-irisan untuk mengendalikan bobot halaman.') },
      { term: 'Vertical slice (UI)', def: b('A journey-aligned UI area owned end-to-end by one team.', 'Area UI yang selaras-perjalanan, dimiliki penuh oleh satu tim.') },
    ],
  },
  'D5:spa': {
    definition: b(
      'Single-Page Application: the browser loads one HTML shell and a JavaScript application that renders views and handles routing client-side, exchanging data (not pages) with servers.',
      'Single-Page Application: browser memuat satu shell HTML dan aplikasi JavaScript yang merender tampilan dan menangani routing di sisi klien, bertukar data (bukan halaman) dengan server.',
    ),
    concepts: [
      b('Client-side routing and state; the server becomes an API.', 'Routing dan state di sisi klien; server menjadi sebuah API.'),
      b('Code-splitting/lazy loading as the load-performance lever.', 'Code-splitting/lazy loading sebagai tuas performa muat.'),
      b('Server-state vs UI-state separation (query caches).', 'Pemisahan server-state vs UI-state (cache kueri).'),
    ],
    patterns: ['Client-side Router', 'Code Splitting', 'Optimistic UI', 'Backend for Frontend (BFF)'],
    terms: [
      { term: 'Hydration (n/a)', def: b('SPAs render fully client-side; hydration belongs to SSR hybrids.', 'SPA merender sepenuhnya di sisi klien; hydration milik hibrida SSR.') },
      { term: 'Bundle budget', def: b('A CI-enforced ceiling on shipped JS — this repo gates one.', 'Batas atas JS yang dikirim yang ditegakkan CI — repo ini menjaganya.') },
      { term: 'Route-level splitting', def: b('Loading each view’s code only when its route activates.', 'Memuat kode tiap tampilan hanya saat rutenya aktif.') },
    ],
  },
  'D5:ssr': {
    definition: b(
      'Server-Side Rendering / Static Site Generation: producing HTML on the server per request (SSR) or ahead of time (SSG), then optionally hydrating it into an interactive client app.',
      'Server-Side Rendering / Static Site Generation: menghasilkan HTML di server per permintaan (SSR) atau di muka (SSG), lalu opsional meng-hydrate-nya menjadi aplikasi klien interaktif.',
    ),
    concepts: [
      b('Render-time spectrum: build-time (SSG) → edge/ISR → per-request (SSR).', 'Spektrum waktu-render: saat-build (SSG) → edge/ISR → per-permintaan (SSR).'),
      b('Hydration and its costs; islands/partial hydration as mitigation.', 'Hydration dan biayanya; islands/partial hydration sebagai mitigasi.'),
      b('Caching as a first-class design axis (CDN, stale-while-revalidate).', 'Caching sebagai sumbu desain kelas-satu (CDN, stale-while-revalidate).'),
    ],
    patterns: ['Static Generation', 'Incremental Static Regeneration', 'Islands Architecture', 'Streaming SSR'],
    terms: [
      { term: 'Hydration', def: b('Attaching client-side behavior to server-rendered HTML.', 'Menautkan perilaku sisi-klien ke HTML yang dirender server.') },
      { term: 'ISR', def: b('Incremental Static Regeneration — static pages refreshed on a schedule/demand.', 'Incremental Static Regeneration — halaman statis yang disegarkan terjadwal/atas permintaan.') },
      { term: 'Islands', def: b('Mostly-static pages with isolated interactive components hydrated selectively.', 'Halaman yang sebagian besar statis dengan komponen interaktif terisolasi yang di-hydrate secara selektif.') },
    ],
  },
};
