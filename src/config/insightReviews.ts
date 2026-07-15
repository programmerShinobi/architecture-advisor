import type { Bilingual } from '../types';

// Review lens — structured, objective evaluations for EVERY architecture the Advisor evaluates
// (all 21 D1–D5 options), keyed `${dim}:${optionId}`. Bilingual EN/ID (rendered via tr()). Each
// review gives: overview, pros, cons, performance, scalability, developer experience, suitable use
// cases, and a final verdict — the evaluation structure the user-facing Review section promises.
// Citations reuse the option's READER_CITATIONS via readerContent. Parity with the frozen model is
// test-enforced.

const b = (en: string, id: string): Bilingual => ({ en, id });

export interface ArchReview {
  overview: Bilingual;
  pros: Bilingual[];
  cons: Bilingual[];
  performance: Bilingual;
  scalability: Bilingual;
  dx: Bilingual;
  useCases: Bilingual[];
  verdict: Bilingual;
}

export const INSIGHT_REVIEWS: Record<string, ArchReview> = {
  // ───────────────────────── D1 · Deployment granularity ─────────────────────────
  'D1:layered': {
    overview: b(
      'The classic single deployable partitioned by technical responsibility. Time-tested, universally understood, and quick to start — with a well-known erosion mode as domains grow.',
      'Deployable tunggal klasik yang dibagi berdasarkan tanggung jawab teknis. Teruji waktu, dipahami secara universal, dan cepat dimulai — dengan mode erosi yang terkenal saat domain tumbuh.',
    ),
    pros: [
      b('Zero learning curve — every hire has seen it.', 'Tanpa kurva belajar — setiap orang baru pernah melihatnya.'),
      b('Fast bootstrap; frameworks scaffold it for free.', 'Bootstrap cepat; framework menyiapkannya secara gratis.'),
      b('Clear home for each kind of code (UI, rules, persistence).', 'Rumah yang jelas untuk tiap jenis kode (UI, aturan, persistensi).'),
    ],
    cons: [
      b('Technical layers do not match how features change — one feature touches every layer.', 'Lapisan teknis tak sesuai dengan cara fitur berubah — satu fitur menyentuh setiap lapisan.'),
      b('No enforced domain boundaries; erosion into a tangle is the default trajectory.', 'Tanpa batas domain yang ditegakkan; erosi menjadi kekusutan adalah lintasan bawaannya.'),
      b('Whole-app deploys and a single failure domain.', 'Deploy seluruh aplikasi dan satu domain kegagalan.'),
    ],
    performance: b(
      'In-process calls — excellent baseline latency; performance issues are query/algorithm problems, not architecture ones.',
      'Panggilan dalam-proses — latensi dasar sangat baik; masalah performa adalah soal kueri/algoritma, bukan arsitektur.',
    ),
    scalability: b(
      'Whole-app horizontal/vertical scaling only; fine until one hot module needs independent scaling.',
      'Hanya penskalaan horizontal/vertikal seluruh aplikasi; baik sampai satu modul panas butuh penskalaan independen.',
    ),
    dx: b(
      'Comfortable at small size; degrades as unrelated features contend in shared services and merge conflicts rise.',
      'Nyaman saat kecil; menurun saat fitur tak terkait bersaing di service bersama dan konflik merge meningkat.',
    ),
    useCases: [
      b('Small teams and well-understood CRUD-heavy domains.', 'Tim kecil dan domain padat-CRUD yang dipahami baik.'),
      b('Internal tools and admin systems.', 'Perkakas internal dan sistem admin.'),
      b('Prototypes that must ship this month.', 'Prototipe yang harus rilis bulan ini.'),
    ],
    verdict: b(
      'A sensible default for small, stable systems — but pair it with explicit module boundaries (or move to a modular monolith) the moment the domain grows teeth.',
      'Default yang masuk akal untuk sistem kecil dan stabil — tapi padukan dengan batas modul eksplisit (atau pindah ke modular monolith) begitu domain mulai bergigi.',
    ),
  },
  'D1:monolith': {
    overview: b(
      'One deployable, one database, one release train. The most operationally simple architecture and the recommended starting point for most new products ("monolith first").',
      'Satu deployable, satu basis data, satu jalur rilis. Arsitektur yang paling sederhana secara operasional dan titik awal yang direkomendasikan untuk kebanyakan produk baru ("monolith first").',
    ),
    pros: [
      b('Simplest possible operations: one build, one deploy, one thing to monitor.', 'Operasi sesederhana mungkin: satu build, satu deploy, satu hal untuk dipantau.'),
      b('Strong consistency is trivial — one database, real transactions.', 'Konsistensi kuat itu sepele — satu basis data, transaksi nyata.'),
      b('Refactoring across the whole system is an IDE operation, not a migration project.', 'Refaktor lintas seluruh sistem adalah operasi IDE, bukan proyek migrasi.'),
    ],
    cons: [
      b('One failure domain: a bad deploy or memory leak takes everything down.', 'Satu domain kegagalan: deploy buruk atau kebocoran memori menjatuhkan segalanya.'),
      b('One release cadence for all teams; coordination costs grow with team count.', 'Satu irama rilis untuk semua tim; biaya koordinasi tumbuh seiring jumlah tim.'),
      b('Scaling is all-or-nothing; a single hot path forces scaling the world.', 'Penskalaan bersifat semua-atau-tidak; satu jalur panas memaksa menskalakan segalanya.'),
    ],
    performance: b(
      'Best-in-class baseline — every call is in-process; no serialization or network tax.',
      'Baseline terbaik di kelasnya — setiap panggilan dalam-proses; tanpa pajak serialisasi atau jaringan.',
    ),
    scalability: b(
      'Vertical first, then whole-app replicas behind a load balancer; the ceiling is real but much higher than teams assume.',
      'Vertikal dulu, lalu replika seluruh aplikasi di balik load balancer; batasnya nyata tapi jauh lebih tinggi dari yang diasumsikan tim.',
    ),
    dx: b(
      'Excellent while the team is small: one repo, one run command, debuggable end to end. Watch build times and test suites as it grows.',
      'Sangat baik selama tim kecil: satu repo, satu perintah jalan, dapat di-debug ujung ke ujung. Awasi waktu build dan suite tes saat ia tumbuh.',
    ),
    useCases: [
      b('New products before product-market fit.', 'Produk baru sebelum product-market fit.'),
      b('Teams of one to ~eight engineers.', 'Tim satu hingga ~delapan insinyur.'),
      b('Systems where strong consistency dominates (money, inventory).', 'Sistem di mana konsistensi kuat mendominasi (uang, inventaris).'),
    ],
    verdict: b(
      'Underrated and usually right. Start here, keep modules clean, and let real pain — not fashion — justify any split.',
      'Diremehkan dan biasanya benar. Mulai di sini, jaga modul tetap bersih, dan biarkan rasa sakit nyata — bukan tren — yang membenarkan pemecahan apa pun.',
    ),
  },
  'D1:modular-monolith': {
    overview: b(
      'A monolith with enforced internal boundaries aligned to bounded contexts: microservices-grade modularity, monolith-grade operations. The pragmatic sweet spot for most growing products.',
      'Monolith dengan batas internal yang ditegakkan selaras bounded context: modularitas kelas-microservices, operasi kelas-monolith. Titik manis pragmatis untuk kebanyakan produk yang tumbuh.',
    ),
    pros: [
      b('Team autonomy via module ownership without distributed-systems tax.', 'Otonomi tim lewat kepemilikan modul tanpa pajak sistem terdistribusi.'),
      b('One deploy, one database, real transactions — operations stay simple.', 'Satu deploy, satu basis data, transaksi nyata — operasi tetap sederhana.'),
      b('A proven stepping stone: modules extract cleanly to services later (Strangler Fig).', 'Batu loncatan yang terbukti: modul terekstrak rapi menjadi layanan kelak (Strangler Fig).'),
    ],
    cons: [
      b('Boundary discipline must be enforced (CI) or it silently erodes.', 'Disiplin batas harus ditegakkan (CI) atau ia terkikis diam-diam.'),
      b('Still one failure domain and one release train.', 'Tetap satu domain kegagalan dan satu jalur rilis.'),
      b('No independent scaling per module.', 'Tanpa penskalaan independen per modul.'),
    ],
    performance: b(
      'Identical to a monolith — in-process calls throughout.',
      'Identik dengan monolith — panggilan dalam-proses di mana-mana.',
    ),
    scalability: b(
      'Whole-app scaling; the payoff is organizational scaling (teams in parallel), not runtime scaling.',
      'Penskalaan seluruh aplikasi; imbalannya adalah penskalaan organisasional (tim secara paralel), bukan penskalaan runtime.',
    ),
    dx: b(
      'Very good: clear ownership, enforced contracts, single debuggable process. The boundary tooling is the only extra moving part.',
      'Sangat baik: kepemilikan jelas, kontrak ditegakkan, satu proses yang dapat di-debug. Perkakas batas adalah satu-satunya bagian bergerak tambahan.',
    ),
    useCases: [
      b('Products with several teams that keep stepping on each other.', 'Produk dengan beberapa tim yang terus saling menginjak.'),
      b('Domains stabilizing toward clear bounded contexts.', 'Domain yang menstabil menuju bounded context yang jelas.'),
      b('Organizations wanting a reversible path toward microservices.', 'Organisasi yang menginginkan jalur yang dapat dibalik menuju microservices.'),
    ],
    verdict: b(
      'The default recommendation for growing systems: buy modularity first — it is cheap; buy distribution later — it is not.',
      'Rekomendasi default untuk sistem yang tumbuh: beli modularitas dulu — itu murah; beli distribusi kemudian — itu tidak.',
    ),
  },
  'D1:microservices': {
    overview: b(
      'Many independently deployable services, each owning its data. Delivers real team autonomy and independent scaling — at a permanent operational and consistency cost that empirical studies consistently flag.',
      'Banyak layanan yang dapat di-deploy independen, masing-masing memiliki datanya. Memberi otonomi tim nyata dan penskalaan independen — dengan biaya operasional dan konsistensi permanen yang secara konsisten ditandai studi empiris.',
    ),
    pros: [
      b('Independent deploys: teams release without coordinating trains.', 'Deploy independen: tim merilis tanpa mengoordinasikan jadwal.'),
      b('Independent scaling and failure isolation per service.', 'Penskalaan independen dan isolasi kegagalan per layanan.'),
      b('Technology freedom per service where genuinely useful.', 'Kebebasan teknologi per layanan di mana benar-benar berguna.'),
    ],
    cons: [
      b('Distributed-systems tax forever: network failures, eventual consistency, tracing.', 'Pajak sistem terdistribusi selamanya: kegagalan jaringan, konsistensi eventual, tracing.'),
      b('The pains reported most in practice: operational complexity and data consistency.', 'Rasa sakit yang paling banyak dilaporkan dalam praktik: kompleksitas operasional dan konsistensi data.'),
      b('The classic failure mode — the distributed monolith — is easy to build by accident.', 'Mode kegagalan klasik — distributed monolith — mudah dibangun tanpa sengaja.'),
    ],
    performance: b(
      'Every hop adds serialization + network latency; chatty designs multiply it. Good designs keep call chains shallow and async.',
      'Setiap hop menambah serialisasi + latensi jaringan; desain cerewet melipatgandakannya. Desain baik menjaga rantai panggilan dangkal dan asinkron.',
    ),
    scalability: b(
      'The headline strength: scale only what is hot, deploy only what changed.',
      'Kekuatan utamanya: skalakan hanya yang panas, deploy hanya yang berubah.',
    ),
    dx: b(
      'Bimodal. Wonderful inside one service; hard across services (local env, debugging, cross-cutting changes). Platform quality decides everything.',
      'Bimodal. Menyenangkan di dalam satu layanan; sulit antar-layanan (env lokal, debugging, perubahan lintas-potong). Kualitas platform menentukan segalanya.',
    ),
    useCases: [
      b('Large or distributed organizations with mature DevOps.', 'Organisasi besar atau terdistribusi dengan DevOps yang matang.'),
      b('Systems whose parts have genuinely different scaling profiles.', 'Sistem yang bagian-bagiannya punya profil penskalaan yang benar-benar berbeda.'),
      b('Domains with stable, well-proven context boundaries.', 'Domain dengan batas konteks yang stabil dan terbukti baik.'),
    ],
    verdict: b(
      'Powerful and conditional. Adopt when team scale and load asymmetry demand it AND the platform exists; otherwise the modular monolith gives most of the benefit at a fraction of the cost.',
      'Kuat dan bersyarat. Adopsi saat skala tim dan asimetri beban menuntutnya DAN platformnya ada; jika tidak, modular monolith memberi sebagian besar manfaatnya dengan sebagian kecil biayanya.',
    ),
  },
  'D1:serverless': {
    overview: b(
      'Functions-as-a-Service on managed infrastructure: scale-to-zero, pay-per-use, no servers to run. Superb for spiky and event-driven work; constrained for latency-critical or stateful cores.',
      'Functions-as-a-Service pada infrastruktur terkelola: scale-to-zero, bayar-per-pakai, tanpa server untuk dijalankan. Luar biasa untuk kerja berlonjak dan event-driven; terbatas untuk inti kritis-latensi atau stateful.',
    ),
    pros: [
      b('Scale-to-zero economics — idle costs nothing.', 'Ekonomi scale-to-zero — menganggur tak berbiaya.'),
      b('Elasticity without capacity planning.', 'Elastisitas tanpa perencanaan kapasitas.'),
      b('Least infrastructure to operate of any option here.', 'Infrastruktur paling sedikit untuk dioperasikan di antara opsi di sini.'),
    ],
    cons: [
      b('Cold-start latency on the critical path.', 'Latensi cold-start pada jalur kritis.'),
      b('Execution limits (duration/memory) and awkward local testing.', 'Batasan eksekusi (durasi/memori) dan pengujian lokal yang canggung.'),
      b('Vendor lock-in gravity; cost can invert at sustained high volume.', 'Gravitasi vendor lock-in; biaya bisa terbalik pada volume tinggi berkelanjutan.'),
    ],
    performance: b(
      'Excellent for parallel burst work; unpredictable tail latency from cold starts unless provisioned concurrency (which erodes the cost model).',
      'Sangat baik untuk kerja lonjakan paralel; tail latency tak terduga dari cold start kecuali provisioned concurrency (yang mengikis model biaya).',
    ),
    scalability: b(
      'Effectively unlimited for stateless bursts — the platform’s strongest axis.',
      'Praktis tak terbatas untuk lonjakan stateless — sumbu terkuat platform.',
    ),
    dx: b(
      'Fast to ship a function; harder to test, trace, and reason about at system scale. IaC discipline is non-negotiable.',
      'Cepat merilis sebuah fungsi; lebih sulit menguji, melacak, dan menalar pada skala sistem. Disiplin IaC tak bisa ditawar.',
    ),
    useCases: [
      b('Spiky/unpredictable traffic and event-driven glue.', 'Trafik berlonjak/tak terduga dan perekat event-driven.'),
      b('Scheduled/batch jobs and webhook handlers.', 'Pekerjaan terjadwal/batch dan handler webhook.'),
      b('Early products wanting zero ops surface.', 'Produk awal yang menginginkan nol permukaan ops.'),
    ],
    verdict: b(
      'Choose it for the edges (events, bursts, glue) with confidence; choose it for the core only when the workload truly matches the FaaS shape.',
      'Pilih untuk tepian (event, lonjakan, perekat) dengan percaya diri; pilih untuk inti hanya saat beban kerja benar-benar cocok dengan bentuk FaaS.',
    ),
  },

  // ───────────────────────── D2 · Communication style ─────────────────────────
  'D2:synchronous': {
    overview: b(
      'Direct request/response (REST/gRPC). The simplest mental model and the strongest coupling: the caller shares the callee’s fate, latency, and availability.',
      'Request/response langsung (REST/gRPC). Model mental paling sederhana dan kopling terkuat: pemanggil berbagi nasib, latensi, dan ketersediaan yang dipanggil.',
    ),
    pros: [
      b('Immediate answers; trivial to understand and debug.', 'Jawaban seketika; sepele untuk dipahami dan di-debug.'),
      b('Ubiquitous tooling, gateways, and contract formats.', 'Perkakas, gateway, dan format kontrak yang ada di mana-mana.'),
      b('Natural fit for queries and user-facing reads.', 'Cocok alami untuk kueri dan baca yang dihadapi pengguna.'),
    ],
    cons: [
      b('Temporal coupling: callee down → caller down (multiplied along chains).', 'Kopling temporal: yang dipanggil mati → pemanggil mati (dikalikan sepanjang rantai).'),
      b('Latency adds up per hop; availability multiplies down.', 'Latensi bertambah per hop; ketersediaan berkalikan turun.'),
      b('Retry storms and cascades without breakers/timeouts.', 'Badai retry dan efek beruntun tanpa breaker/timeout.'),
    ],
    performance: b(
      'Lowest per-call overhead of the styles, but chain depth is the real budget — p95 of a chain is the sum of its hops.',
      'Overhead per-panggilan terendah di antara gaya, tapi kedalaman rantai adalah anggaran sebenarnya — p95 sebuah rantai adalah jumlah hop-nya.',
    ),
    scalability: b(
      'Scales with the slowest dependency; backpressure is the caller’s problem.',
      'Menskala mengikuti dependensi terlambat; backpressure adalah masalah pemanggil.',
    ),
    dx: b(
      'Excellent: request in, response out, stack traces make sense. The discipline burden (timeouts, idempotency) is real but well-known.',
      'Sangat baik: permintaan masuk, respons keluar, stack trace masuk akal. Beban disiplin (timeout, idempotensi) nyata tapi sudah dikenal.',
    ),
    useCases: [
      b('User-facing queries needing an immediate answer.', 'Kueri yang dihadapi pengguna yang butuh jawaban seketika.'),
      b('Simple service-to-service lookups.', 'Pencarian antar-layanan yang sederhana.'),
      b('Public APIs.', 'API publik.'),
    ],
    verdict: b(
      'Right for questions, wrong for workflows. Keep chains shallow, timeouts explicit, and reach for async the moment "eventually" is acceptable.',
      'Tepat untuk pertanyaan, salah untuk alur kerja. Jaga rantai dangkal, timeout eksplisit, dan beralih ke asinkron begitu "eventual" bisa diterima.',
    ),
  },
  'D2:async-messaging': {
    overview: b(
      'Producers and consumers decoupled in time via queues/brokers. Trades the simple call stack for resilience, buffering, and independent pacing.',
      'Produser dan konsumer yang dipisahkan dalam waktu lewat antrean/broker. Menukar call stack sederhana demi ketahanan, buffering, dan laju yang independen.',
    ),
    pros: [
      b('Temporal decoupling: consumers can be down without losing work.', 'Pemisahan temporal: konsumer bisa mati tanpa kehilangan pekerjaan.'),
      b('Load leveling: bursts queue instead of toppling services.', 'Perataan beban: lonjakan mengantre alih-alih menumbangkan layanan.'),
      b('Natural retry/DLQ machinery for reliability.', 'Mesin retry/DLQ alami untuk keandalan.'),
    ],
    cons: [
      b('End-to-end reasoning is harder; flows span logs and queues.', 'Penalaran ujung-ke-ujung lebih sulit; alur membentang di log dan antrean.'),
      b('At-least-once delivery forces idempotent consumers.', 'Pengiriman at-least-once memaksa konsumer idempoten.'),
      b('Latency becomes variable — "done" is asynchronous.', 'Latensi menjadi bervariasi — "selesai" itu asinkron.'),
    ],
    performance: b(
      'Throughput-oriented rather than latency-oriented; broker adds milliseconds but absorbs spikes gracefully.',
      'Berorientasi throughput ketimbang latensi; broker menambah milidetik tapi menyerap lonjakan dengan anggun.',
    ),
    scalability: b(
      'Excellent: add consumers to drain faster; queues absorb what consumers cannot.',
      'Sangat baik: tambah konsumer untuk menguras lebih cepat; antrean menyerap apa yang tak bisa ditangani konsumer.',
    ),
    dx: b(
      'Good with discipline (schemas, tracing, DLQ runbooks); confusing without — messages “disappear” only when observability is missing.',
      'Baik dengan disiplin (skema, tracing, runbook DLQ); membingungkan tanpanya — pesan "menghilang" hanya saat observabilitas tak ada.',
    ),
    useCases: [
      b('Background work (email, exports, billing runs).', 'Kerja latar (email, ekspor, proses penagihan).'),
      b('Integrations between systems with different uptime/pace.', 'Integrasi antar-sistem dengan uptime/laju berbeda.'),
      b('Buffering write bursts ahead of slower processors.', 'Menyangga lonjakan tulis di depan prosesor yang lebih lambat.'),
    ],
    verdict: b(
      'The workhorse of reliable integration. Adopt broadly for commands/workflows; keep sync only where the user is literally waiting for the answer.',
      'Kuda beban integrasi yang andal. Adopsi luas untuk command/alur kerja; pertahankan sinkron hanya di mana pengguna benar-benar menunggu jawabannya.',
    ),
  },
  'D2:event-driven': {
    overview: b(
      'Components publish domain facts; interested parties subscribe. Maximizes extensibility and decoupling; global ordering and workflow visibility become design problems.',
      'Komponen memublikasikan fakta domain; pihak yang berkepentingan berlangganan. Memaksimalkan perluasan dan pemisahan; urutan global dan visibilitas alur kerja menjadi masalah desain.',
    ),
    pros: [
      b('Producers need not know consumers — add features without touching upstream.', 'Produser tak perlu tahu konsumer — tambah fitur tanpa menyentuh hulu.'),
      b('Fits domain thinking: events are business facts.', 'Cocok dengan pola pikir domain: event adalah fakta bisnis.'),
      b('Excellent audit/analytics side effects for free.', 'Efek samping audit/analitik yang sangat baik secara gratis.'),
    ],
    cons: [
      b('Eventual consistency by construction.', 'Konsistensi eventual secara konstruksi.'),
      b('Emergent flows are hard to see and debug without tracing.', 'Alur yang muncul sulit dilihat dan di-debug tanpa tracing.'),
      b('Event schema evolution requires governance.', 'Evolusi skema event membutuhkan tata kelola.'),
    ],
    performance: b(
      'Comparable to messaging; fan-out to many consumers is cheap for producers.',
      'Sebanding dengan messaging; fan-out ke banyak konsumer itu murah bagi produser.',
    ),
    scalability: b(
      'Very strong: consumers scale independently; new subscribers are free for producers.',
      'Sangat kuat: konsumer menskala independen; pelanggan baru gratis bagi produser.',
    ),
    dx: b(
      'Great locally (handle event → do thing), demanding globally (who reacts to what?). An event catalog and tracing are the difference between elegance and chaos.',
      'Bagus secara lokal (tangani event → lakukan sesuatu), menuntut secara global (siapa bereaksi terhadap apa?). Katalog event dan tracing adalah pembeda antara keanggunan dan kekacauan.',
    ),
    useCases: [
      b('Cross-domain propagation (order placed → shipping, loyalty, analytics).', 'Propagasi lintas-domain (pesanan dibuat → pengiriman, loyalitas, analitik).'),
      b('Extensible platforms where future consumers are unknown.', 'Platform yang dapat diperluas di mana konsumer masa depan tak diketahui.'),
      b('CQRS projections and cache invalidation.', 'Proyeksi CQRS dan invalidasi cache.'),
    ],
    verdict: b(
      'Choose for extensibility across domains — with an event catalog, tracing, and explicit consistency UX as entry criteria, not afterthoughts.',
      'Pilih untuk perluasan lintas domain — dengan katalog event, tracing, dan UX konsistensi eksplisit sebagai kriteria masuk, bukan renungan belakangan.',
    ),
  },
  'D2:streaming': {
    overview: b(
      'Ordered, replayable, partitioned logs (Kafka-class) for continuous data flows. A different beast from messaging: the log is a durable, re-readable source of history.',
      'Log yang terurut, dapat diputar-ulang, dan terpartisi (kelas Kafka) untuk aliran data kontinu. Makhluk berbeda dari messaging: log adalah sumber riwayat yang tahan lama dan dapat dibaca ulang.',
    ),
    pros: [
      b('Replayability: rebuild consumers/views from history.', 'Kemampuan putar-ulang: bangun ulang konsumer/tampilan dari riwayat.'),
      b('Massive throughput with per-partition ordering.', 'Throughput masif dengan urutan per-partisi.'),
      b('One backbone serves realtime processing AND integration.', 'Satu tulang punggung melayani pemrosesan real-time DAN integrasi.'),
    ],
    cons: [
      b('Real operational weight: partitions, offsets, retention, backpressure.', 'Bobot operasional nyata: partisi, offset, retensi, backpressure.'),
      b('Partition-key mistakes are forever (ordering/hotspots).', 'Kesalahan partition-key itu selamanya (urutan/titik panas).'),
      b('Overkill for simple work queues.', 'Berlebihan untuk antrean kerja sederhana.'),
    ],
    performance: b(
      'Built for firehoses — millions of events/sec with linear partition scaling; end-to-end latency in low milliseconds when tuned.',
      'Dibangun untuk aliran deras — jutaan event/detik dengan penskalaan partisi linear; latensi ujung-ke-ujung dalam milidetik rendah bila disetel.',
    ),
    scalability: b(
      'The strongest of the styles — horizontal by partition, consumers in groups.',
      'Terkuat di antara gaya — horizontal per partisi, konsumer dalam grup.',
    ),
    dx: b(
      'Powerful but specialist: offset semantics, rebalancing, and reprocessing require real study. Managed platforms remove the worst of it.',
      'Kuat tapi spesialis: semantik offset, rebalancing, dan pemrosesan-ulang butuh studi sungguhan. Platform terkelola menghilangkan bagian terburuknya.',
    ),
    useCases: [
      b('Telemetry/clickstream/IoT pipelines.', 'Pipeline telemetri/clickstream/IoT.'),
      b('Change-data-capture and event sourcing backbones.', 'Tulang punggung change-data-capture dan event sourcing.'),
      b('Materialized views and stream analytics.', 'Materialized view dan analitik stream.'),
    ],
    verdict: b(
      'Adopt when volume, ordering, or replay genuinely matter; otherwise a plain queue is cheaper in every dimension.',
      'Adopsi saat volume, urutan, atau putar-ulang benar-benar penting; jika tidak, antrean biasa lebih murah di setiap dimensi.',
    ),
  },

  // ───────────────────────── D3 · Data management ─────────────────────────
  'D3:single-db': {
    overview: b(
      'One shared database as the system of record. Simplest possible consistency and operations — and the strongest silent coupler of services and modules.',
      'Satu basis data bersama sebagai system of record. Konsistensi dan operasi sesederhana mungkin — dan pengkopling diam terkuat antar-layanan dan modul.',
    ),
    pros: [
      b('Real ACID transactions across the whole domain.', 'Transaksi ACID nyata lintas seluruh domain.'),
      b('One backup, one migration pipeline, one thing to tune.', 'Satu backup, satu pipeline migrasi, satu hal untuk disetel.'),
      b('Joins and reporting are trivial.', 'Join dan pelaporan itu sepele.'),
    ],
    cons: [
      b('Couples every writer to one schema — the classic microservices anti-pattern.', 'Mengkopling tiap penulis ke satu skema — anti-pattern microservices klasik.'),
      b('Single write-scaling ceiling.', 'Satu batas atas penskalaan tulis.'),
      b('Schema changes need whole-system coordination.', 'Perubahan skema butuh koordinasi seluruh sistem.'),
    ],
    performance: b(
      'Excellent when indexed and tuned; a mature relational engine outperforms naive distributed setups by miles.',
      'Sangat baik saat diindeks dan disetel; mesin relasional yang matang mengungguli setup terdistribusi naif sejauh bermil-mil.',
    ),
    scalability: b(
      'Reads scale via replicas; writes eventually hit the single-node ceiling (later than most teams believe).',
      'Baca menskala lewat replika; tulis akhirnya menabrak batas atas satu-node (lebih lambat dari yang diyakini kebanyakan tim).',
    ),
    dx: b(
      'Superb: one connection string, real transactions, SQL for every question.',
      'Luar biasa: satu connection string, transaksi nyata, SQL untuk tiap pertanyaan.',
    ),
    useCases: [
      b('Monoliths and modular monoliths (its natural partner).', 'Monolith dan modular monolith (pasangan alaminya).'),
      b('Consistency-critical domains.', 'Domain kritis-konsistensi.'),
      b('Anything pre-scale — which is most systems.', 'Apa pun yang pra-skala — yang mencakup kebanyakan sistem.'),
    ],
    verdict: b(
      'Correct for single-deployable architectures; a liability under microservices. Judge it by the deployment model around it.',
      'Tepat untuk arsitektur deployable-tunggal; beban di bawah microservices. Nilailah berdasarkan model deployment di sekitarnya.',
    ),
  },
  'D3:db-per-service': {
    overview: b(
      'Each service exclusively owns its store; integration happens via APIs/events. The data foundation that makes service independence real.',
      'Tiap layanan memiliki penyimpanannya secara eksklusif; integrasi terjadi lewat API/event. Fondasi data yang membuat kemandirian layanan menjadi nyata.',
    ),
    pros: [
      b('True encapsulation: schema changes stay local.', 'Enkapsulasi sejati: perubahan skema tetap lokal.'),
      b('Independent scaling, tuning, and even engine choice per service.', 'Penskalaan, penyetelan, bahkan pilihan mesin yang independen per layanan.'),
      b('Failure isolation extends to the data tier.', 'Isolasi kegagalan meluas ke lapisan data.'),
    ],
    cons: [
      b('Cross-service transactions are gone — sagas/outbox replace them.', 'Transaksi lintas-layanan hilang — saga/outbox menggantikannya.'),
      b('Cross-entity queries need composition or projections.', 'Kueri lintas-entity butuh komposisi atau proyeksi.'),
      b('N databases = N backups, migrations, capacity plans.', 'N basis data = N backup, migrasi, rencana kapasitas.'),
    ],
    performance: b(
      'Local access stays fast; cross-service reads pay API/projection costs — design read models deliberately.',
      'Akses lokal tetap cepat; baca lintas-layanan membayar biaya API/proyeksi — rancang read model secara sengaja.',
    ),
    scalability: b(
      'Excellent and targeted: scale exactly the hot store.',
      'Sangat baik dan tertarget: skalakan persis penyimpanan yang panas.',
    ),
    dx: b(
      'Clear ownership is loved; the consistency machinery (sagas, outbox, projections) is a real skill tax.',
      'Kepemilikan yang jelas disukai; mesin konsistensi (saga, outbox, proyeksi) adalah pajak keterampilan yang nyata.',
    ),
    useCases: [
      b('Microservices (it is practically their definition).', 'Microservices (praktis definisinya).'),
      b('Domains with clear data ownership per capability.', 'Domain dengan kepemilikan data yang jelas per kapabilitas.'),
      b('Regulated data needing isolation boundaries.', 'Data teregulasi yang butuh batas isolasi.'),
    ],
    verdict: b(
      'Non-negotiable if you do microservices honestly. The cost is the consistency toolkit — budget for it or stay monolithic.',
      'Tak bisa ditawar jika kamu menjalankan microservices dengan jujur. Biayanya adalah perkakas konsistensi — anggarkan atau tetap monolitik.',
    ),
  },
  'D3:cqrs': {
    overview: b(
      'Separate write and read models for a slice whose command and query needs genuinely diverge. A precision tool routinely over-applied.',
      'Model tulis dan baca yang terpisah untuk irisan yang kebutuhan command dan query-nya benar-benar berbeda. Alat presisi yang rutin diterapkan berlebihan.',
    ),
    pros: [
      b('Each side shaped and scaled to its job.', 'Tiap sisi dibentuk dan diskalakan sesuai tugasnya.'),
      b('Read models per screen kill N+1 query pain.', 'Read model per layar membunuh rasa sakit kueri N+1.'),
      b('Pairs naturally with events/projections.', 'Berpasangan alami dengan event/proyeksi.'),
    ],
    cons: [
      b('More moving parts + eventual consistency between sides.', 'Lebih banyak bagian bergerak + konsistensi eventual antar-sisi.'),
      b('Projection rebuild/versioning machinery required.', 'Mesin pembangunan-ulang/versioning proyeksi diperlukan.'),
      b('Easy to cargo-cult system-wide.', 'Mudah ditiru membabi-buta ke seluruh sistem.'),
    ],
    performance: b(
      'Reads become O(1)-shaped lookups against purpose-built models; writes keep invariants without read contention.',
      'Baca menjadi pencarian berbentuk O(1) terhadap model yang dibangun khusus; tulis menjaga invarian tanpa kontensi baca.',
    ),
    scalability: b(
      'Strong: fan out read replicas/projections independently of the write path.',
      'Kuat: sebarkan replika baca/proyeksi secara independen dari jalur tulis.',
    ),
    dx: b(
      'Pleasant per side; the mental model of staleness and rebuilds must be taught, and the UX must show pending states honestly.',
      'Menyenangkan per sisi; model mental keusangan dan pembangunan-ulang harus diajarkan, dan UX harus menampilkan status pending dengan jujur.',
    ),
    useCases: [
      b('Read-heavy slices with complex writes (catalogs, dashboards).', 'Irisan padat-baca dengan tulis kompleks (katalog, dashboard).'),
      b('High-contention aggregates needing slim write paths.', 'Aggregate berkontensi-tinggi yang butuh jalur tulis ramping.'),
      b('Event-sourced contexts (its natural partner).', 'Konteks yang di-event-source (pasangan alaminya).'),
    ],
    verdict: b(
      'Excellent surgically, harmful as a default. Apply per-slice with measured asymmetry as the entry ticket.',
      'Sangat baik secara bedah, berbahaya sebagai default. Terapkan per-irisan dengan asimetri terukur sebagai tiket masuk.',
    ),
  },
  'D3:event-sourcing': {
    overview: b(
      'State stored as an immutable event log; current state is a projection. Perfect audit and time-travel for domains where history IS the requirement — at a permanent complexity premium.',
      'State disimpan sebagai log event yang tak-berubah; state saat ini adalah proyeksi. Audit dan penjelajahan-waktu sempurna untuk domain di mana riwayat ADALAH kebutuhan — dengan premi kompleksitas permanen.',
    ),
    pros: [
      b('Complete, incorruptible audit trail by construction.', 'Jejak audit lengkap dan tak dapat dirusak secara konstruksi.'),
      b('Temporal queries and retroactive fixes (replay with corrections).', 'Kueri temporal dan perbaikan retroaktif (putar-ulang dengan koreksi).'),
      b('Events double as integration and analytics gold.', 'Event berperan ganda sebagai emas integrasi dan analitik.'),
    ],
    cons: [
      b('Schema evolution (upcasting) is a discipline forever.', 'Evolusi skema (upcasting) adalah disiplin selamanya.'),
      b('Projections add operational surface (rebuilds, lag).', 'Proyeksi menambah permukaan operasional (pembangunan-ulang, lag).'),
      b('Steep learning curve; easy to misapply beyond audit-heavy cores.', 'Kurva belajar curam; mudah salah terap di luar inti padat-audit.'),
    ],
    performance: b(
      'Appends are fast; reads depend entirely on projections; long streams need snapshots.',
      'Penambahan cepat; baca sepenuhnya bergantung pada proyeksi; stream panjang butuh snapshot.',
    ),
    scalability: b(
      'Good: append-only writes shard well; projections scale like read models.',
      'Baik: tulis hanya-tambah ter-shard dengan baik; proyeksi menskala seperti read model.',
    ),
    dx: b(
      'Intellectually satisfying, practically demanding — versioned events, replay tooling, and staging rebuild drills are table stakes.',
      'Memuaskan secara intelektual, menuntut secara praktik — event berversi, perkakas putar-ulang, dan latihan bangun-ulang di staging adalah syarat minimal.',
    ),
    useCases: [
      b('Ledgers, payments, compliance-critical records.', 'Buku besar, pembayaran, catatan kritis-kepatuhan.'),
      b('Domains where "how did we get here?" is a business question.', 'Domain di mana "bagaimana kita sampai di sini?" adalah pertanyaan bisnis.'),
      b('Systems already committed to CQRS + events.', 'Sistem yang sudah berkomitmen pada CQRS + event.'),
    ],
    verdict: b(
      'A specialist’s power tool: transformative where audit/time-travel are core, an expensive detour anywhere else.',
      'Alat andalan spesialis: transformatif di mana audit/penjelajahan-waktu adalah inti, jalan memutar yang mahal di tempat lain.',
    ),
  },
  'D3:polyglot': {
    overview: b(
      'Right store per workload — relational, document, search, cache, graph — each fed from a clear system of record. Fit at the cost of operational breadth.',
      'Penyimpanan yang tepat per beban kerja — relasional, dokumen, pencarian, cache, graph — masing-masing disuplai dari system of record yang jelas. Kecocokan dengan biaya keluasan operasional.',
    ),
    pros: [
      b('Each access pattern gets an engine built for it.', 'Tiap pola akses mendapat mesin yang dibangun untuknya.'),
      b('Avoids one-engine-fits-nothing contortions.', 'Menghindari kontorsi satu-mesin-tak-cocok-apa-apa.'),
      b('Managed cloud services make the portfolio feasible.', 'Layanan cloud terkelola membuat portofolionya layak.'),
    ],
    cons: [
      b('Every engine is a standing tax: backups, upgrades, expertise.', 'Tiap mesin adalah pajak tetap: backup, upgrade, keahlian.'),
      b('Cross-store consistency contracts must be designed and monitored.', 'Kontrak konsistensi antar-penyimpanan harus dirancang dan dipantau.'),
      b('Team cognitive load grows with the portfolio.', 'Beban kognitif tim tumbuh seiring portofolio.'),
    ],
    performance: b(
      'The point: search queries hit a search engine, graphs a graph DB — each near-optimal instead of one engine mediocre at all.',
      'Intinya: kueri pencarian mengenai mesin pencari, graph mengenai DB graph — masing-masing mendekati-optimal alih-alih satu mesin biasa-saja di semuanya.',
    ),
    scalability: b(
      'Per-engine and therefore precise; the coordination layer (sync pipelines) is the new bottleneck to watch.',
      'Per-mesin dan karenanya presisi; lapisan koordinasi (pipeline sinkronisasi) adalah bottleneck baru untuk diawasi.',
    ),
    dx: b(
      'Fun breadth, real context-switching; strong platform conventions (one way to run/backup/monitor each engine) keep it sane.',
      'Keluasan yang menyenangkan, pergantian konteks yang nyata; konvensi platform yang kuat (satu cara menjalankan/backup/memantau tiap mesin) menjaganya waras.',
    ),
    useCases: [
      b('Products combining transactions + search + caching at real scale.', 'Produk yang memadukan transaksi + pencarian + caching pada skala nyata.'),
      b('Analytics/recommendation features beside OLTP cores.', 'Fitur analitik/rekomendasi di samping inti OLTP.'),
      b('Migration periods bridging old and new stores.', 'Periode migrasi yang menjembatani penyimpanan lama dan baru.'),
    ],
    verdict: b(
      'Adopt engine-by-engine with evidence, keep one system of record per dataset, and cap the portfolio — polyglot by policy, not by accretion.',
      'Adopsi mesin-per-mesin dengan bukti, pertahankan satu system of record per dataset, dan batasi portofolio — polyglot berdasarkan kebijakan, bukan penumpukan.',
    ),
  },

  // ───────────────────────── D4 · Code structure ─────────────────────────
  'D4:hexagonal': {
    overview: b(
      'Ports & Adapters: a pure domain core, technology at the edges. The reference structure for testable, framework-independent business logic.',
      'Ports & Adapters: inti domain yang murni, teknologi di tepian. Struktur rujukan untuk logika bisnis yang dapat diuji dan mandiri-framework.',
    ),
    pros: [
      b('Core unit-testable without any infrastructure.', 'Inti dapat di-unit-test tanpa infrastruktur apa pun.'),
      b('Framework/database swaps become adapter work.', 'Penggantian framework/basis data menjadi pekerjaan adapter.'),
      b('Forces explicit contracts (ports) for every dependency.', 'Memaksa kontrak eksplisit (port) untuk tiap dependensi.'),
    ],
    cons: [
      b('Up-front indirection and boilerplate.', 'Indireksi dan boilerplate di muka.'),
      b('Discipline required to keep the core pure.', 'Disiplin diperlukan untuk menjaga inti tetap murni.'),
      b('Overkill for short-lived or trivial services.', 'Berlebihan untuk layanan berumur pendek atau sepele.'),
    ],
    performance: b(
      'Neutral at runtime — an interface hop is nanoseconds; the win is engineering speed, not CPU.',
      'Netral saat runtime — sebuah hop antarmuka itu nanodetik; kemenangannya adalah kecepatan rekayasa, bukan CPU.',
    ),
    scalability: b(
      'Code-scale strength: parallel work on adapters and core with few collisions.',
      'Kekuatan skala-kode: kerja paralel pada adapter dan inti dengan sedikit tabrakan.',
    ),
    dx: b(
      'Excellent once internalized: tests read like specs, onboarding maps cleanly. The pattern must be taught once, then it pays daily.',
      'Sangat baik setelah terinternalisasi: tes terbaca seperti spesifikasi, onboarding terpetakan rapi. Polanya harus diajarkan sekali, lalu ia berbuah tiap hari.',
    ),
    useCases: [
      b('Long-lived domains with real business rules.', 'Domain berumur panjang dengan aturan bisnis nyata.'),
      b('Systems facing framework/vendor churn.', 'Sistem yang menghadapi pergantian framework/vendor.'),
      b('Teams practicing TDD/BDD seriously.', 'Tim yang menjalankan TDD/BDD dengan serius.'),
    ],
    verdict: b(
      'The strongest default for serious backend cores; scale the ceremony down honestly for small utilities.',
      'Default terkuat untuk inti backend yang serius; turunkan seremoninya secara jujur untuk utilitas kecil.',
    ),
  },
  'D4:clean': {
    overview: b(
      'Concentric rings with a strict inward dependency rule — hexagonal’s intent, more prescriptive shape. Entities and use cases at the center, frameworks as details.',
      'Cincin konsentris dengan aturan dependensi ke-dalam yang ketat — maksud hexagonal, bentuk yang lebih preskriptif. Entity dan use case di pusat, framework sebagai detail.',
    ),
    pros: [
      b('Business rules outlive frameworks by construction.', 'Aturan bisnis hidup lebih lama dari framework secara konstruksi.'),
      b('Use-case classes give behavior an explicit, testable home.', 'Kelas use-case memberi perilaku rumah yang eksplisit dan dapat diuji.'),
      b('Screaming architecture: structure reveals purpose.', 'Screaming architecture: struktur mengungkap tujuan.'),
    ],
    cons: [
      b('The most ceremony of the D4 options.', 'Seremoni terbanyak di antara opsi D4.'),
      b('Dogmatic application produces empty pass-through layers.', 'Penerapan dogmatik menghasilkan lapisan pass-through kosong.'),
      b('Interactor boilerplate on trivial CRUD is real.', 'Boilerplate interactor pada CRUD sepele itu nyata.'),
    ],
    performance: b(
      'Runtime-neutral; the rings are compile-time concepts.',
      'Netral-runtime; cincin adalah konsep saat-kompilasi.',
    ),
    scalability: b(
      'Same as hexagonal — organizational, not runtime.',
      'Sama dengan hexagonal — organisasional, bukan runtime.',
    ),
    dx: b(
      'Very good on large long-lived systems; frustrating when applied to simple apps (boilerplate without benefit). Team buy-in decides.',
      'Sangat baik pada sistem besar berumur panjang; menjengkelkan saat diterapkan ke aplikasi sederhana (boilerplate tanpa manfaat). Dukungan tim yang menentukan.',
    ),
    useCases: [
      b('Enterprise cores with decade lifespans.', 'Inti enterprise dengan umur satu dekade.'),
      b('Multi-team codebases needing a shared, explicit structure.', 'Basis kode multi-tim yang butuh struktur bersama yang eksplisit.'),
      b('Domains rich in genuine business rules.', 'Domain yang kaya aturan bisnis sejati.'),
    ],
    verdict: b(
      'Choose it when longevity and team scale justify the ceremony; choose hexagonal-lite or slices when they do not.',
      'Pilih saat umur panjang dan skala tim membenarkan seremoninya; pilih hexagonal-ringan atau slice saat tidak.',
    ),
  },
  'D4:vertical-slice': {
    overview: b(
      'Organize by feature, not layer: each slice owns its request-to-response path. Optimizes for how software actually changes.',
      'Susun berdasarkan fitur, bukan lapisan: tiap irisan memiliki jalur request-ke-response-nya. Mengoptimalkan cara perangkat lunak sebenarnya berubah.',
    ),
    pros: [
      b('Change locality: one feature = one folder = one PR.', 'Lokalitas perubahan: satu fitur = satu folder = satu PR.'),
      b('Complexity is opt-in per slice, not imposed globally.', 'Kompleksitas bersifat opt-in per irisan, tidak dipaksakan global.'),
      b('Onboarding by feature is natural.', 'Onboarding berdasarkan fitur itu alami.'),
    ],
    cons: [
      b('Duplication needs active gardening (rule of three).', 'Duplikasi butuh perawatan aktif (rule of three).'),
      b('Weak shared-kernel discipline re-invents money/date types per slice.', 'Disiplin shared-kernel yang lemah menemukan-ulang tipe uang/tanggal per irisan.'),
      b('Cross-cutting refactors touch many slices.', 'Refaktor lintas-potong menyentuh banyak irisan.'),
    ],
    performance: b(
      'Runtime-neutral; occasionally faster paths because each slice queries exactly what it needs.',
      'Netral-runtime; kadang jalur lebih cepat karena tiap irisan mengueri persis yang dibutuhkannya.',
    ),
    scalability: b(
      'Team-parallel by design — slices collide rarely.',
      'Paralel-tim secara desain — irisan jarang bertabrakan.',
    ),
    dx: b(
      'Loved in CRUD-heavy, feature-driven products: no layer archaeology, just find the folder. Architects must still guard invariants.',
      'Disukai pada produk padat-CRUD berbasis-fitur: tanpa arkeologi lapisan, cukup temukan foldernya. Arsitek tetap harus menjaga invarian.',
    ),
    useCases: [
      b('Feature-factory products with steady request-shaped work.', 'Produk pabrik-fitur dengan kerja berbentuk-permintaan yang mantap.'),
      b('Teams burned by layer ceremonies.', 'Tim yang terbakar oleh seremoni lapisan.'),
      b('CQRS-style handlers (natural pairing).', 'Handler gaya-CQRS (pasangan alami).'),
    ],
    verdict: b(
      'The pragmatic modern default for request-driven apps; add a small shared kernel and duplication discipline and it scales surprisingly far.',
      'Default modern yang pragmatis untuk aplikasi berbasis-permintaan; tambahkan shared kernel kecil dan disiplin duplikasi dan ia menskala mengejutkan jauh.',
    ),
  },
  'D4:layered': {
    overview: b(
      'Technical layers inside the codebase (controller/service/repository). Familiar and fast to start; the change-amplification trap as domains grow.',
      'Lapisan teknis di dalam basis kode (controller/service/repository). Familiar dan cepat dimulai; jebakan amplifikasi-perubahan saat domain tumbuh.',
    ),
    pros: [
      b('Everyone knows it; frameworks assume it.', 'Semua orang mengenalnya; framework mengasumsikannya.'),
      b('Clear technical separation of concerns.', 'Pemisahan tanggung jawab teknis yang jelas.'),
      b('Adequate for small/stable domains.', 'Memadai untuk domain kecil/stabil.'),
    ],
    cons: [
      b('Feature changes cut across every layer.', 'Perubahan fitur memotong setiap lapisan.'),
      b('Services become god-objects/transaction scripts.', 'Service menjadi god-object/transaction script.'),
      b('No domain boundaries — erosion is unopposed.', 'Tanpa batas domain — erosi tak terlawan.'),
    ],
    performance: b(
      'Neutral; layers are organizational.',
      'Netral; lapisan bersifat organisasional.',
    ),
    scalability: b(
      'Poor organizationally at size: shared layers become merge-conflict magnets.',
      'Buruk secara organisasional saat besar: lapisan bersama menjadi magnet konflik merge.',
    ),
    dx: b(
      'Comfortable early, sluggish later; the moment "where does this go?" has three answers, the structure is failing.',
      'Nyaman di awal, lamban kemudian; begitu "ini taruh di mana?" punya tiga jawaban, strukturnya sedang gagal.',
    ),
    useCases: [
      b('Small services and internal tools.', 'Layanan kecil dan perkakas internal.'),
      b('Stable, well-understood domains.', 'Domain yang stabil dan dipahami baik.'),
      b('Codebases with heavy framework scaffolding.', 'Basis kode dengan scaffolding framework yang berat.'),
    ],
    verdict: b(
      'Fine as a starting point; plan the exit (slices or hexagonal) before the service layer becomes the city dump.',
      'Baik sebagai titik awal; rencanakan jalan keluar (slice atau hexagonal) sebelum service layer menjadi tempat pembuangan kota.',
    ),
  },

  // ───────────────────────── D5 · Frontend architecture ─────────────────────────
  'D5:micro-frontends': {
    overview: b(
      'Independently deployable UI slices per team, composed into one product. Conway’s Law applied to the frontend — with browser-weight and consistency bills attached.',
      'Irisan UI yang dapat di-deploy independen per tim, dikomposisikan menjadi satu produk. Hukum Conway diterapkan ke frontend — dengan tagihan bobot-browser dan konsistensi menyertainya.',
    ),
    pros: [
      b('True team autonomy: independent releases end frontend release trains.', 'Otonomi tim sejati: rilis independen mengakhiri jadwal rilis frontend.'),
      b('Incremental migration of legacy frontends.', 'Migrasi bertahap frontend legacy.'),
      b('Blast-radius isolation per slice.', 'Isolasi blast-radius per irisan.'),
    ],
    cons: [
      b('Bundle duplication and page-weight risk.', 'Duplikasi bundel dan risiko bobot-halaman.'),
      b('UX consistency requires an actively-owned design system.', 'Konsistensi UX membutuhkan design system yang dimiliki secara aktif.'),
      b('Composition tooling (federation) is its own platform.', 'Perkakas komposisi (federation) adalah platform tersendiri.'),
    ],
    performance: b(
      'The risk axis: duplicated runtimes and multiple bundles unless dedup/budgets are enforced per slice.',
      'Sumbu risikonya: runtime terduplikasi dan banyak bundel kecuali dedup/anggaran ditegakkan per irisan.',
    ),
    scalability: b(
      'Organizational scalability is the entire point — many teams, one product, no lockstep.',
      'Skalabilitas organisasional adalah seluruh intinya — banyak tim, satu produk, tanpa rilis serentak.',
    ),
    dx: b(
      'Great per team (small codebases, own pipeline); the integration shell and contracts demand a real platform owner.',
      'Bagus per tim (basis kode kecil, pipeline sendiri); shell integrasi dan kontrak menuntut pemilik platform yang sungguhan.',
    ),
    useCases: [
      b('Portals/suites built by many UI teams.', 'Portal/suite yang dibangun banyak tim UI.'),
      b('Gradual legacy-frontend strangling.', 'Pencekikan frontend-legacy secara bertahap.'),
      b('Organizations already running domain-aligned teams.', 'Organisasi yang sudah menjalankan tim selaras-domain.'),
    ],
    verdict: b(
      'Justified at organizational scale only. Below several UI teams, a well-modularized SPA delivers the same modularity without the weight.',
      'Hanya dapat dibenarkan pada skala organisasional. Di bawah beberapa tim UI, SPA yang termodularisasi baik memberi modularitas yang sama tanpa bebannya.',
    ),
  },
  'D5:spa': {
    overview: b(
      'One rich client app; the server serves data. The default for interactive products — with first-paint and SEO as the known taxes.',
      'Satu aplikasi klien kaya; server menyajikan data. Default untuk produk interaktif — dengan first-paint dan SEO sebagai pajak yang dikenal.',
    ),
    pros: [
      b('Richest interactivity model; app-like UX.', 'Model interaktivitas terkaya; UX ala-aplikasi.'),
      b('Ships as static assets — trivial hosting/CDN.', 'Dikirim sebagai aset statis — hosting/CDN sepele.'),
      b('One codebase, one deploy for the whole UI.', 'Satu basis kode, satu deploy untuk seluruh UI.'),
    ],
    cons: [
      b('First paint waits for JS unless mitigated.', 'First paint menunggu JS kecuali dimitigasi.'),
      b('SEO needs prerendering for public content.', 'SEO butuh prerender untuk konten publik.'),
      b('Bundle growth is a constant battle (budgets!).', 'Pertumbuhan bundel adalah pertempuran konstan (anggaran!).'),
    ],
    performance: b(
      'Post-load interactions are instant; initial load is the discipline point — code-splitting and budgets are mandatory.',
      'Interaksi pasca-muat itu seketika; muat awal adalah titik disiplinnya — code-splitting dan anggaran itu wajib.',
    ),
    scalability: b(
      'Serving scales infinitely (static); codebase scale needs internal modularity.',
      'Penyajian menskala tak terbatas (statis); skala basis kode butuh modularitas internal.',
    ),
    dx: b(
      'The mainstream happy path: hot reload, huge ecosystem, one language across the app.',
      'Jalur bahagia arus utama: hot reload, ekosistem besar, satu bahasa di seluruh aplikasi.',
    ),
    useCases: [
      b('Dashboards, editors, internal tools.', 'Dashboard, editor, perkakas internal.'),
      b('Authenticated product UIs where SEO is irrelevant.', 'UI produk terautentikasi di mana SEO tak relevan.'),
      b('This very application.', 'Aplikasi ini sendiri.'),
    ],
    verdict: b(
      'The right default for app-like products. Enforce bundle budgets from day one and prerender the few public pages.',
      'Default yang tepat untuk produk ala-aplikasi. Tegakkan anggaran bundel sejak hari pertama dan prerender beberapa halaman publik.',
    ),
  },
  'D5:ssr': {
    overview: b(
      'HTML rendered on the server or at build time (SSG), hydrating into interactivity. Wins first paint and SEO decisively; adds a rendering runtime to operate (unless fully static).',
      'HTML dirender di server atau saat build (SSG), meng-hydrate menjadi interaktif. Memenangkan first paint dan SEO secara telak; menambah runtime rendering untuk dioperasikan (kecuali sepenuhnya statis).',
    ),
    pros: [
      b('Fast first contentful paint by construction.', 'First contentful paint cepat secara konstruksi.'),
      b('SEO/social previews work natively.', 'Pratinjau SEO/sosial bekerja secara native.'),
      b('SSG variants are the cheapest, fastest hosting on earth.', 'Varian SSG adalah hosting termurah dan tercepat di dunia.'),
    ],
    cons: [
      b('A server/edge runtime to run and scale (for true SSR).', 'Runtime server/edge untuk dijalankan dan diskalakan (untuk SSR sejati).'),
      b('Hydration complexity and its mismatch bugs.', 'Kompleksitas hydration dan bug ketidakcocokannya.'),
      b('Personalization vs cacheability tension.', 'Ketegangan personalisasi vs kemampuan-cache.'),
    ],
    performance: b(
      'Best first-load metrics of the three; interaction readiness depends on hydration strategy (islands help).',
      'Metrik muat-awal terbaik di antara ketiganya; kesiapan interaksi bergantung pada strategi hydration (islands membantu).',
    ),
    scalability: b(
      'SSG scales like static files (perfectly); SSR scales like a service (plan it).',
      'SSG menskala seperti berkas statis (sempurna); SSR menskala seperti layanan (rencanakan).',
    ),
    dx: b(
      'Modern meta-frameworks make it smooth, at the price of more concepts (render modes, caching layers) than a plain SPA.',
      'Meta-framework modern membuatnya mulus, dengan harga lebih banyak konsep (mode render, lapisan caching) daripada SPA biasa.',
    ),
    useCases: [
      b('Content, marketing, docs, commerce landing pages.', 'Konten, marketing, dokumen, halaman landing niaga.'),
      b('Anything where Google and first impressions pay the bills.', 'Apa pun di mana Google dan kesan pertama yang membayar tagihan.'),
      b('Hybrid apps with public content + private app areas.', 'Aplikasi hibrida dengan konten publik + area aplikasi privat.'),
    ],
    verdict: b(
      'Choose per route class: static-generate everything you can, server-render what personalization forces, and hydrate only where interaction demands.',
      'Pilih per kelas rute: hasilkan-statis semua yang bisa, render-server yang dipaksa personalisasi, dan hydrate hanya di mana interaksi menuntut.',
    ),
  },
};
