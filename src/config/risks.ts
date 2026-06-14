import type { Bilingual } from '../types';

// Risk register data per option, keyed by "<dimensionId>:<optionId>" (option ids collide
// across dimensions, e.g. `layered` in D1 and D4). Ported verbatim from the canonical
// docs/03-blueprint/option-content-sheet.md (the "Risks" rows). Generated, do not hand-edit:
// re-derive from the sheet if the source changes.

export type RiskLevel = 'low' | 'med' | 'high';

export interface Risk {
  likelihood: RiskLevel;
  impact: RiskLevel;
  description: Bilingual;
  mitigation: Bilingual;
}

export const RISKS: Record<string, Risk[]> = {
  "D1:layered": [
    { likelihood: "med", impact: "med", description: { en: "layer coupling slows change", id: "keterikatan lapisan memperlambat perubahan" }, mitigation: { en: "enforce layer contracts with architecture tests", id: "tegakkan kontrak lapisan dengan architecture test" } },
    { likelihood: "low", impact: "high", description: { en: "the single database becomes the bottleneck", id: "database tunggal jadi leher botol" }, mitigation: { en: "plan read replicas and caching early", id: "siapkan read replica dan cache sejak awal" } },
  ],
  "D1:monolith": [
    { likelihood: "med", impact: "med", description: { en: "becomes a big ball of mud over time", id: "lama-lama jadi \"big ball of mud\"" }, mitigation: { en: "enforce module boundaries and architecture tests", id: "tegakkan batas modul dan architecture test" } },
    { likelihood: "med", impact: "low", description: { en: "deploy contention between contributors", id: "rebutan jadwal rilis" }, mitigation: { en: "trunk-based development with feature flags", id: "trunk-based development dengan feature flag" } },
  ],
  "D1:modular-monolith": [
    { likelihood: "med", impact: "med", description: { en: "boundary erosion", id: "erosi batas modul" }, mitigation: { en: "dependency rules enforced in CI", id: "aturan dependensi ditegakkan di CI" } },
    { likelihood: "low", impact: "med", description: { en: "one shared failure domain", id: "satu domain kegagalan bersama" }, mitigation: { en: "bulkheads and timeouts inside the process", id: "bulkhead dan timeout di dalam proses" } },
  ],
  "D1:microservices": [
    { likelihood: "high", impact: "high", description: { en: "operational complexity outpaces the team", id: "kompleksitas operasional melampaui kemampuan tim" }, mitigation: { en: "start with a modular monolith and invest in the platform first", id: "mulai dari modular monolith dan investasikan platform dulu" } },
    { likelihood: "med", impact: "high", description: { en: "cross-service data inconsistency", id: "data tidak konsisten antarlayanan" }, mitigation: { en: "sagas/outbox and contract tests", id: "pola saga/outbox dan contract test" } },
  ],
  "D1:serverless": [
    { likelihood: "med", impact: "med", description: { en: "vendor lock-in", id: "keterikatan vendor" }, mitigation: { en: "abstract handlers and use infrastructure-as-code", id: "abstraksikan handler dan pakai infrastructure-as-code" } },
    { likelihood: "med", impact: "med", description: { en: "cold-start latency", id: "latensi cold-start" }, mitigation: { en: "provisioned concurrency for latency-critical paths", id: "provisioned concurrency untuk jalur kritis latensi" } },
  ],
  "D2:synchronous": [
    { likelihood: "med", impact: "high", description: { en: "cascading failure at scale", id: "kegagalan berantai pada skala besar" }, mitigation: { en: "circuit breakers, timeouts, bulkheads", id: "circuit breaker, timeout, bulkhead" } },
    { likelihood: "low", impact: "med", description: { en: "latency stacking", id: "latensi menumpuk" }, mitigation: { en: "collapse hops and cache aggressively", id: "pangkas lompatan dan manfaatkan cache" } },
  ],
  "D2:async-messaging": [
    { likelihood: "med", impact: "med", description: { en: "poison messages and backlog", id: "pesan beracun dan penumpukan" }, mitigation: { en: "dead-letter queues and lag alerts", id: "dead-letter queue dan alarm keterlambatan" } },
    { likelihood: "med", impact: "med", description: { en: "duplicate processing", id: "pemrosesan ganda" }, mitigation: { en: "idempotent consumers", id: "konsumen idempoten" } },
  ],
  "D2:event-driven": [
    { likelihood: "med", impact: "high", description: { en: "invisible coupling through events", id: "keterikatan tak terlihat lewat event" }, mitigation: { en: "an event catalog and distributed tracing", id: "katalog event dan distributed tracing" } },
    { likelihood: "med", impact: "med", description: { en: "consumer lag", id: "konsumen tertinggal" }, mitigation: { en: "monitor offsets and autoscale consumers", id: "pantau offset dan autoscale konsumen" } },
  ],
  "D2:streaming": [
    { likelihood: "med", impact: "high", description: { en: "operational burden", id: "beban operasional" }, mitigation: { en: "managed streaming services first", id: "pakai layanan streaming terkelola dulu" } },
    { likelihood: "med", impact: "med", description: { en: "reprocessing bugs", id: "bug pemrosesan ulang" }, mitigation: { en: "idempotent sinks and versioned processors", id: "sink idempoten dan prosesor berversi" } },
  ],
  "D3:single-db": [
    { likelihood: "low", impact: "high", description: { en: "write bottleneck", id: "leher botol penulisan" }, mitigation: { en: "read replicas, caching, then a partitioning plan", id: "read replica, cache, lalu rencana partisi" } },
    { likelihood: "med", impact: "med", description: { en: "schema-change contention", id: "rebutan perubahan skema" }, mitigation: { en: "migration discipline and ownership", id: "disiplin migrasi dan kepemilikan" } },
  ],
  "D3:db-per-service": [
    { likelihood: "med", impact: "high", description: { en: "cross-service consistency bugs", id: "bug konsistensi lintas layanan" }, mitigation: { en: "saga and outbox patterns", id: "pola saga dan outbox" } },
    { likelihood: "med", impact: "med", description: { en: "operational sprawl", id: "operasional meluas" }, mitigation: { en: "automate database provisioning", id: "otomatisasi penyediaan database" } },
  ],
  "D3:cqrs": [
    { likelihood: "med", impact: "med", description: { en: "model drift", id: "model saling menyimpang" }, mitigation: { en: "contract tests and rebuildable projections", id: "contract test dan proyeksi yang bisa dibangun ulang" } },
    { likelihood: "med", impact: "low", description: { en: "stale reads confuse users", id: "data baca basi membingungkan pengguna" }, mitigation: { en: "show data freshness in the UI", id: "tampilkan kesegaran data di UI" } },
  ],
  "D3:event-sourcing": [
    { likelihood: "med", impact: "high", description: { en: "schema and replay complexity", id: "kompleksitas skema dan replay" }, mitigation: { en: "versioned events, upcasters, snapshots", id: "event berversi, upcaster, snapshot" } },
    { likelihood: "med", impact: "med", description: { en: "projection lag", id: "proyeksi tertinggal" }, mitigation: { en: "monitoring and rebuild tooling", id: "pemantauan dan perkakas rebuild" } },
  ],
  "D3:polyglot": [
    { likelihood: "med", impact: "med", description: { en: "operational sprawl", id: "operasional meluas" }, mitigation: { en: "cap the portfolio and manage it centrally", id: "batasi portofolio dan kelola terpusat" } },
    { likelihood: "med", impact: "med", description: { en: "drift between stores", id: "penyimpanan saling menyimpang" }, mitigation: { en: "outbox/CDC synchronization pipelines", id: "pipeline sinkronisasi outbox/CDC" } },
  ],
  "D4:hexagonal": [
    { likelihood: "low", impact: "med", description: { en: "over-abstraction slows delivery", id: "abstraksi berlebih memperlambat rilis" }, mitigation: { en: "apply only at boundaries that matter", id: "terapkan hanya pada batas yang penting" } },
    { likelihood: "low", impact: "low", description: { en: "team unfamiliarity", id: "tim belum terbiasa" }, mitigation: { en: "reference examples and ADRs", id: "contoh rujukan dan ADR" } },
  ],
  "D4:clean": [
    { likelihood: "low", impact: "med", description: { en: "ceremony overhead", id: "beban seremoni" }, mitigation: { en: "tailor the number of layers to the domain", id: "sesuaikan jumlah lapisan dengan domain" } },
    { likelihood: "low", impact: "low", description: { en: "dogma over intent", id: "dogma mengalahkan maksud" }, mitigation: { en: "review against the dependency rule, not the folder names", id: "review terhadap aturan dependensi, bukan nama folder" } },
  ],
  "D4:vertical-slice": [
    { likelihood: "med", impact: "med", description: { en: "duplication drift", id: "duplikasi menyimpang" }, mitigation: { en: "scheduled refactors and a small shared kernel", id: "refactor terjadwal dan shared kernel kecil" } },
    { likelihood: "low", impact: "med", description: { en: "inconsistent patterns per slice", id: "pola tak konsisten antar-irisan" }, mitigation: { en: "templates and linting", id: "template dan linting" } },
  ],
  "D4:layered": [
    { likelihood: "med", impact: "med", description: { en: "erosion into spaghetti as the domain grows", id: "erosi menjadi spageti saat domain tumbuh" }, mitigation: { en: "periodic refactoring, or move to slices/hexagonal when complexity hardens", id: "refactor berkala, atau beralih ke vertical slice/hexagonal saat kompleksitas mengeras" } },
  ],
  "D5:micro-frontends": [
    { likelihood: "med", impact: "med", description: { en: "UX fragmentation", id: "UX terfragmentasi" }, mitigation: { en: "a shared design system and contract tests", id: "design system bersama dan contract test" } },
    { likelihood: "med", impact: "med", description: { en: "performance overhead", id: "beban performa" }, mitigation: { en: "shared dependencies and performance budgets", id: "dependensi bersama dan anggaran performa" } },
  ],
  "D5:spa": [
    { likelihood: "med", impact: "med", description: { en: "bundle growth", id: "bundle membengkak" }, mitigation: { en: "performance budgets enforced in CI", id: "anggaran performa ditegakkan di CI" } },
    { likelihood: "low", impact: "med", description: { en: "SEO gaps", id: "celah SEO" }, mitigation: { en: "prerender or a hybrid SSR if it ever matters", id: "prerender atau hibrida SSR bila kelak dibutuhkan" } },
  ],
  "D5:ssr": [
    { likelihood: "med", impact: "med", description: { en: "runtime operating cost (SSR)", id: "biaya operasional runtime (SSR)" }, mitigation: { en: "prefer SSG/incremental rendering where possible", id: "utamakan SSG/rendering inkremental bila memungkinkan" } },
    { likelihood: "low", impact: "med", description: { en: "hydration mismatches", id: "ketidakcocokan hidrasi" }, mitigation: { en: "integration tests on critical pages", id: "tes integrasi pada halaman kritis" } },
  ],
};
