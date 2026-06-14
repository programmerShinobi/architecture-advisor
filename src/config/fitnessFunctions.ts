import type { Bilingual, QaId } from '../types';

// One measurable fitness-function template per quality attribute (evolutionary architecture).
// Verbatim from docs/03-blueprint/option-content-sheet.md Section 7 (Build Spec Section 11).
// `X`/`N` are placeholders the team fills in. The UI surfaces templates for the top-weighted QAs.

export const FITNESS_TEMPLATES: Record<QaId, Bilingual> = {
  performance: {
    en: 'p95/p99 latency of the critical path is measured continuously; alert when p99 exceeds X ms.',
    id: 'Latensi p95/p99 jalur kritis diukur terus-menerus; beri peringatan saat p99 melewati X ms.',
  },
  scalability: {
    en: 'A load test sustains N req/s at p99 < X ms with autoscaling enabled, run on every release.',
    id: 'Uji beban mampu menahan N req/s pada p99 < X ms dengan autoscaling aktif, dijalankan pada tiap rilis.',
  },
  availability: {
    en: 'A chaos test tolerates the loss of a node/zone within the error budget; SLO dashboards track it.',
    id: 'Uji chaos mentoleransi hilangnya satu node/zona dalam batas error budget; dasbor SLO memantaunya.',
  },
  security: {
    en: 'SAST, dependency, and secret scanning gate the pipeline; the budget for critical CVEs is zero.',
    id: 'Pemindaian SAST, dependensi, dan rahasia menjadi gerbang pipeline; anggaran CVE kritis adalah nol.',
  },
  maintainability: {
    en: 'Architecture/dependency tests forbid layering violations; change failure rate and lead time (DORA) are tracked.',
    id: 'Tes arsitektur/dependensi melarang pelanggaran lapisan; change failure rate dan lead time (DORA) dipantau.',
  },
  deployability: {
    en: 'Each unit deploys independently in < N minutes via CI; the build fails on cyclic dependencies.',
    id: 'Tiap unit dirilis independen dalam < N menit lewat CI; build gagal bila ada dependensi melingkar.',
  },
  testability: {
    en: 'Core logic holds ≥ X% branch coverage with fast, deterministic unit tests.',
    id: 'Logika inti memiliki cakupan cabang ≥ X% dengan unit test yang cepat dan deterministik.',
  },
  observability: {
    en: 'Every request is traceable end-to-end via a trace ID; golden signals have dashboards and alerts.',
    id: 'Setiap request dapat ditelusuri ujung-ke-ujung lewat trace ID; golden signals punya dasbor dan peringatan.',
  },
  dataConsistency: {
    en: 'Concurrency tests assert no lost updates under parallel writes; invariants are checked by contract tests.',
    id: 'Uji konkurensi memastikan tidak ada pembaruan hilang saat penulisan paralel; invarian diperiksa lewat contract test.',
  },
  interoperability: {
    en: 'Every public contract is schema-validated in CI; breaking changes fail the build (consumer-driven contracts).',
    id: 'Setiap kontrak publik divalidasi skemanya di CI; perubahan yang merusak menggagalkan build (consumer-driven contract).',
  },
  costEfficiency: {
    en: 'Cost per 1,000 requests (or per tenant) is tracked monthly; alerts fire on a > X% regression.',
    id: 'Biaya per 1.000 request (atau per tenant) dipantau bulanan; peringatan menyala saat regresi > X%.',
  },
  timeToMarket: {
    en: 'Lead time from merge to production is measured; the target is < N days (DORA).',
    id: 'Lead time dari merge ke produksi diukur; targetnya < N hari (DORA).',
  },
};
