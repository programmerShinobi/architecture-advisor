import type { Bilingual } from '../types';

// Per-architecture "angles" that turn the same model-bound catalogue into two more lenses, so EVERY
// architecture the Advisor evaluates (all D1–D5 options) also appears in Playbook and Review — not
// only Catalog. Keyed by `${dim}:${optionId}` (option ids repeat across dimensions, e.g. `layered`
// in D1 and D4, so the dimension is part of the key). Rendered by LearnView alongside the option's
// existing fits/cost/deeper/cites from readerContent.ts. Concise, practical, and defensible.

// Playbook lens — "how to adopt it / the first practical move".
export const PLAYBOOK_ANGLE: Record<string, Bilingual> = {
  'D1:layered': {
    en: 'Choose it for small, stable domains and a fast start; arrange presentation → business → data and keep layers from leaking into each other.',
    id: 'Pilih untuk domain kecil dan stabil serta mulai cepat; susun presentasi → bisnis → data dan jaga agar antar-lapisan tidak saling bocor.',
  },
  'D1:monolith': {
    en: 'Start here for a new product: one deployable, one database, easy consistency — but keep clean internal modules from day one.',
    id: 'Mulai di sini untuk produk baru: satu deployable, satu basis data, konsistensi mudah — tetapi jaga modul internal tetap rapi sejak awal.',
  },
  'D1:modular-monolith': {
    en: 'Enforce module boundaries (interfaces + dependency rules) inside one process, aligned to bounded contexts; make CI the boundary guard.',
    id: 'Tegakkan batas modul (interface + aturan dependensi) di dalam satu proses, selaras bounded context; jadikan CI penjaga batasnya.',
  },
  'D1:microservices': {
    en: 'Extract a service only when it needs independent scale/deploy/team; set up CI/CD, observability, and per-service data ownership first.',
    id: 'Ekstrak layanan hanya saat butuh skala/deploy/tim mandiri; siapkan CI/CD, observability, dan kepemilikan data per-layanan lebih dulu.',
  },
  'D1:serverless': {
    en: 'Use it for spiky, event-driven work; keep functions short and stateless, and push state into managed services.',
    id: 'Pakai untuk beban bergelombang dan berbasis peristiwa; jaga fungsi tetap singkat dan stateless, dan taruh keadaan di layanan terkelola.',
  },
  'D2:synchronous': {
    en: 'Use when you truly need an immediate answer; add timeouts, idempotent retries, and circuit breakers from the start.',
    id: 'Pakai saat benar-benar butuh jawaban seketika; tambahkan timeout, retry idempoten, dan circuit breaker sejak awal.',
  },
  'D2:async-messaging': {
    en: 'Introduce a broker/queue to decouple in time; design for idempotency and at-least-once delivery, and add a dead-letter path.',
    id: 'Perkenalkan broker/antrean untuk melepas kopling waktu; rancang idempotensi dan pengiriman at-least-once, serta sediakan jalur dead-letter.',
  },
  'D2:event-driven': {
    en: 'Publish domain facts as events; start with one stream and document the event schema before adding reactors.',
    id: 'Terbitkan fakta domain sebagai peristiwa; mulai dari satu aliran dan dokumentasikan skema peristiwa sebelum menambah reaktor.',
  },
  'D2:streaming': {
    en: 'Use for high-throughput real-time flows; plan partitioning and consumer-offset management up front.',
    id: 'Pakai untuk aliran real-time bervolume tinggi; rencanakan partisi dan manajemen offset konsumen sejak awal.',
  },
  'D3:single-db': {
    en: 'The default for a small/single-team system: one transaction, strong consistency — don’t split it without a concrete reason.',
    id: 'Default untuk sistem kecil/satu tim: satu transaksi, konsistensi kuat — jangan memecahnya tanpa alasan konkret.',
  },
  'D3:db-per-service': {
    en: 'Give each service its own store; replace cross-service transactions with sagas + the transactional-outbox pattern.',
    id: 'Beri tiap layanan penyimpanannya sendiri; ganti transaksi lintas-layanan dengan saga + pola transactional-outbox.',
  },
  'D3:cqrs': {
    en: 'Apply it only on the slice with sharply different read vs write loads; plan how the read model stays in sync.',
    id: 'Terapkan hanya pada irisan dengan beban baca vs tulis yang berbeda tajam; rencanakan cara model baca tetap sinkron.',
  },
  'D3:event-sourcing': {
    en: 'Use when history is the domain (audit/finance); plan event versioning, snapshots, and replay before committing.',
    id: 'Pakai saat riwayat adalah domainnya (audit/keuangan); rencanakan versi peristiwa, snapshot, dan replay sebelum berkomitmen.',
  },
  'D3:polyglot': {
    en: 'Pick the store type per access pattern, but cap the number of technologies so operations stay manageable.',
    id: 'Pilih jenis penyimpanan per pola akses, tetapi batasi jumlah teknologi agar operasional tetap terkelola.',
  },
  'D4:hexagonal': {
    en: 'Wrap the domain behind ports; make frameworks/IO adapters at the edge so the core is testable without infrastructure.',
    id: 'Kurung domain di balik port; jadikan framework/IO sebagai adapter di tepi agar inti dapat diuji tanpa infrastruktur.',
  },
  'D4:clean': {
    en: 'Apply the dependency rule pointing inward; keep the ceremony proportional — don’t over-layer a small app.',
    id: 'Terapkan aturan dependensi yang mengarah ke dalam; jaga seremoni tetap proporsional — jangan berlapis berlebihan pada aplikasi kecil.',
  },
  'D4:vertical-slice': {
    en: 'Organise by feature — one feature is one full slice; agree conventions to avoid duplication drifting apart.',
    id: 'Tata per fitur — satu fitur adalah satu irisan utuh; sepakati konvensi agar duplikasi tidak menyimpang.',
  },
  'D4:layered': {
    en: 'Use for a small/stable domain; enforce that layers don’t skip each other, and watch for erosion as it grows.',
    id: 'Pakai untuk domain kecil/stabil; tegakkan agar lapisan tidak saling melompat, dan waspadai erosi saat tumbuh.',
  },
  'D5:micro-frontends': {
    en: 'Adopt when several UI teams share one product; agree the integration contract, a design system, and shared-state rules.',
    id: 'Adopsi saat beberapa tim UI berbagi satu produk; sepakati kontrak integrasi, design system, dan aturan shared-state.',
  },
  'D5:spa': {
    en: 'Build one rich client; add code-splitting and prefetch to soften the first-load cost.',
    id: 'Bangun satu klien kaya; tambahkan code-splitting dan prefetch untuk melunakkan biaya muat-pertama.',
  },
  'D5:ssr': {
    en: 'Render on the server or at build time for fast first paint and SEO; prefer static/incremental where you can.',
    id: 'Render di server atau saat build untuk render-pertama cepat dan SEO; utamakan statis/inkremental bila bisa.',
  },
};

// Review lens — "what to check / the red flags when evaluating it".
export const REVIEW_ANGLE: Record<string, Bilingual> = {
  'D1:layered': {
    en: 'Check whether one feature change touches every layer (poor change locality) and whether layers are eroding into a tangle as the domain grows.',
    id: 'Periksa apakah satu perubahan fitur menyentuh semua lapisan (lokalitas perubahan buruk) dan apakah lapisan mulai kusut saat domain tumbuh.',
  },
  'D1:monolith': {
    en: 'Assess the single failure domain and single release cadence; is the codebase size now slowing the team (a signal to modularise)?',
    id: 'Nilai satu domain kegagalan dan satu irama rilis; apakah ukuran kode kini memperlambat tim (sinyal untuk modularisasi)?',
  },
  'D1:modular-monolith': {
    en: 'Verify module boundaries are truly enforced (not just folders) and that each module could be extracted cleanly if needed.',
    id: 'Verifikasi batas modul benar-benar ditegakkan (bukan sekadar folder) dan tiap modul bisa diekstrak bersih bila perlu.',
  },
  'D1:microservices': {
    en: 'Hunt for the distributed monolith: a shared database, coupled deploys, long synchronous chains; confirm each service releases independently.',
    id: 'Cari distributed monolith: basis data bersama, deploy terkopling, rantai sinkron panjang; pastikan tiap layanan rilis mandiri.',
  },
  'D1:serverless': {
    en: 'Evaluate cold-start latency, execution limits, local testing/observability, vendor lock-in, and cost at sustained high volume.',
    id: 'Nilai latensi cold-start, batas eksekusi, pengujian/observability lokal, keterikatan vendor, dan biaya pada volume tinggi berkelanjutan.',
  },
  'D2:synchronous': {
    en: 'Trace the synchronous call chain — latency and failure accumulate; are there hops that should be asynchronous?',
    id: 'Telusuri rantai panggilan sinkron — latensi dan kegagalan menumpuk; adakah lompatan yang seharusnya asinkron?',
  },
  'D2:async-messaging': {
    en: 'Check failed-message handling (dead-letter), duplicate delivery/idempotency, and whether the end-to-end flow is still traceable.',
    id: 'Cek penanganan pesan gagal (dead-letter), duplikasi/idempotensi, dan apakah alur ujung-ke-ujung masih dapat ditelusuri.',
  },
  'D2:event-driven': {
    en: 'Assess global ordering/consistency, the ability to debug emergent flows across reactors, and event-schema versioning.',
    id: 'Nilai pengurutan/konsistensi global, kemampuan men-debug alur emergent antar reaktor, dan versi skema peristiwa.',
  },
  'D2:streaming': {
    en: 'Review partitioning, backpressure, reprocessing, and consumer lag; is the operational weight justified?',
    id: 'Tinjau partisi, tekanan-balik (backpressure), pemrosesan-ulang, dan lag konsumen; apakah beban operasionalnya sepadan?',
  },
  'D3:single-db': {
    en: 'Flag it if used under microservices (it re-couples services) or if it has become a write-scaling bottleneck.',
    id: 'Tandai bila dipakai di bawah microservices (mengembalikan kopling) atau bila menjadi hambatan skala tulis.',
  },
  'D3:db-per-service': {
    en: 'Ensure no service reaches into another’s database, and that cross-service eventual consistency is deliberate (sagas/outbox present).',
    id: 'Pastikan tak ada layanan mengakses basis data milik layanan lain, dan konsistensi eventual lintas-layanan disengaja (ada saga/outbox).',
  },
  'D3:cqrs': {
    en: 'Check that CQRS isn’t over-applied; measure the consistency window between the write and read models.',
    id: 'Cek CQRS tidak diterapkan berlebihan; ukur jendela konsistensi antara model tulis dan model baca.',
  },
  'D3:event-sourcing': {
    en: 'Assess schema-evolution cost, snapshot strategy, and replay complexity; watch for over-application beyond audit-heavy domains.',
    id: 'Nilai biaya evolusi skema, strategi snapshot, dan kompleksitas replay; waspadai penerapan berlebih di luar domain yang berat-audit.',
  },
  'D3:polyglot': {
    en: 'Check the operational/security load of each store and whether every technology choice is genuinely justified.',
    id: 'Cek beban operasional/keamanan tiap penyimpanan dan apakah tiap pilihan teknologi benar-benar dibenarkan.',
  },
  'D4:hexagonal': {
    en: 'Verify business rules don’t import frameworks/IO and that adapters really sit at the edge (nothing leaks inward).',
    id: 'Verifikasi aturan bisnis tidak mengimpor framework/IO dan adapter benar-benar di tepi (tak ada yang bocor ke dalam).',
  },
  'D4:clean': {
    en: 'Check the dependency direction (inward) and that layers don’t leak; guard against ceremony outweighing benefit on small apps.',
    id: 'Cek arah dependensi (ke dalam) dan lapisan tidak bocor; jaga agar seremoni tak melebihi manfaat pada aplikasi kecil.',
  },
  'D4:vertical-slice': {
    en: 'Review per-feature cohesion and duplication across slices; is shared code extracted with discipline?',
    id: 'Tinjau kohesi per-fitur dan duplikasi antar-irisan; apakah kode bersama diekstrak dengan disiplin?',
  },
  'D4:layered': {
    en: 'Check for layer erosion and whether a feature change ripples across every layer.',
    id: 'Cek erosi lapisan dan apakah perubahan fitur merambat ke semua lapisan.',
  },
  'D5:micro-frontends': {
    en: 'Evaluate browser weight, look-and-feel consistency, and whether the team scale truly warrants the integration overhead.',
    id: 'Nilai bobot peramban, konsistensi tampilan, dan apakah skala tim benar-benar membenarkan beban integrasinya.',
  },
  'D5:spa': {
    en: 'Check first paint, bundle size, and SEO — does it need mitigation such as prerendering/SSR?',
    id: 'Cek render pertama, ukuran bundel, dan SEO — apakah butuh mitigasi seperti prerender/SSR?',
  },
  'D5:ssr': {
    en: 'Assess SSR runtime cost and caching, and whether static/incremental rendering would be enough.',
    id: 'Nilai biaya runtime SSR dan caching, serta apakah render statis/inkremental sudah cukup.',
  },
};
