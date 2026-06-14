import type { Bilingual } from '../types';

// Lightweight i18n dictionary. UI chrome strings live here; model content (factor/QA/option
// copy) is bilingual in its own config files. Default language is Indonesian (Build Spec Section 2).
export const DICT = {
  'app.title': { en: 'Architecture Advisor', id: 'Architecture Advisor' },
  'app.tagline': {
    en: 'Quality-attribute-driven architecture decisions — transparent, not an oracle.',
    id: 'Keputusan arsitektur berbasis atribut kualitas — transparan, bukan ramalan.',
  },
  'disclaimer': {
    en: 'Decision support, not an oracle. The encoded weights are defensible expert defaults, not validated facts — every value is editable. Always apply team judgment and context this tool cannot capture.',
    id: 'Alat bantu keputusan, bukan ramalan. Bobot yang tertanam adalah default ahli yang dapat dipertanggungjawabkan, bukan fakta tervalidasi — semua nilai dapat diubah. Selalu gunakan pertimbangan tim dan konteks yang tidak dapat ditangkap alat ini.',
  },
  'factors.heading': { en: 'Project factors', id: 'Faktor proyek' },
  'factors.intro': {
    en: 'Describe your project. Each factor shifts the priority of certain quality attributes.',
    id: 'Jelaskan proyek Anda. Setiap faktor menggeser prioritas atribut kualitas tertentu.',
  },
  'priorities.heading': { en: 'Quality-attribute priorities', id: 'Prioritas atribut kualitas' },
  'priorities.intro': {
    en: 'The “utility tree”: your factors, normalized into weights that sum to 100%.',
    id: '“Pohon utilitas”: faktor Anda, dinormalkan menjadi bobot yang berjumlah 100%.',
  },
  'priorities.economic': { en: 'economic', id: 'ekonomi' },
  'results.top': { en: 'Top recommendation', id: 'Rekomendasi teratas' },
  'results.closeCall': {
    en: 'Close call — no clear winner. The top two are within 10%; weigh team judgment and context.',
    id: 'Selisih tipis — tak ada pemenang jelas. Dua teratas berselisih di bawah 10%; pertimbangkan penilaian tim dan konteks.',
  },
  'results.scoreUnit': { en: '/ 100', id: '/ 100' },
  'dimensions.heading': {
    en: 'Recommendation across dimensions',
    id: 'Rekomendasi lintas dimensi',
  },
  'dimensions.intro': {
    en: 'A coherent architecture spans several orthogonal dimensions. Pick an option in each to refine the combination.',
    id: 'Arsitektur yang koheren mencakup beberapa dimensi ortogonal. Pilih opsi di tiap dimensi untuk menyempurnakan kombinasi.',
  },
  'dim.recommended': { en: 'recommended', id: 'rekomendasi' },
  'combination.heading': { en: 'Your architecture', id: 'Arsitektur Anda' },
  'combination.intro': {
    en: 'The selected option in each dimension. Defaults to the top recommendation until you choose.',
    id: 'Opsi terpilih di tiap dimensi. Mengikuti rekomendasi teratas sampai Anda memilih sendiri.',
  },
  'antipatterns.heading': { en: 'Anti-pattern checks', id: 'Pemeriksaan anti-pattern' },
  'antipatterns.none': {
    en: 'No anti-patterns detected in this combination.',
    id: 'Tidak ada anti-pattern terdeteksi pada kombinasi ini.',
  },
  'severity.danger': { en: 'Danger', id: 'Bahaya' },
  'severity.warning': { en: 'Warning', id: 'Peringatan' },
  'severity.info': { en: 'Info', id: 'Info' },
  'analysis.heading': { en: 'Professional analysis', id: 'Analisis profesional' },
  'radar.heading': { en: 'Trade-off radar (top options)', id: 'Radar trade-off (opsi teratas)' },
  'radar.intro': {
    en: 'The top three deployment options overlaid across all 12 quality attributes.',
    id: 'Tiga opsi deployment teratas ditumpuk pada seluruh 12 atribut kualitas.',
  },
  'contribution.heading': { en: 'QA contribution breakdown', id: 'Rincian kontribusi QA' },
  'contribution.intro': {
    en: 'How each quality attribute contributes to the score of',
    id: 'Bagaimana tiap atribut kualitas menyumbang skor',
  },
  'contribution.qa': { en: 'Quality attribute', id: 'Atribut kualitas' },
  'contribution.weight': { en: 'Weight', id: 'Bobot' },
  'contribution.fit': { en: 'Fit', id: 'Kecocokan' },
  'contribution.points': { en: 'Points', id: 'Poin' },
  'contribution.total': { en: 'Composite score', id: 'Skor komposit' },
  'sensitivity.heading': { en: 'Sensitivity / robustness', id: 'Sensitivitas / ketangguhan' },
  'sensitivity.robust': {
    en: 'Robust — no single factor change (±1 level) flips the top deployment recommendation.',
    id: 'Tangguh — tidak ada perubahan satu faktor (±1 level) yang membalik rekomendasi deployment teratas.',
  },
  'sensitivity.lead': {
    en: 'The top deployment recommendation would change if you adjusted:',
    id: 'Rekomendasi deployment teratas akan berubah jika Anda mengubah:',
  },
  'sensitivity.raise': { en: 'raise to', id: 'naikkan ke' },
  'sensitivity.lower': { en: 'lower to', id: 'turunkan ke' },
  'sensitivity.wins': { en: 'wins', id: 'menang' },
  'risk.heading': { en: 'Risk register', id: 'Daftar risiko' },
  'risk.intro': {
    en: 'Risks of the options in your current combination.',
    id: 'Risiko dari opsi pada kombinasi Anda saat ini.',
  },
  'risk.risk': { en: 'Risk', id: 'Risiko' },
  'risk.likelihood': { en: 'Likelihood', id: 'Kemungkinan' },
  'risk.impact': { en: 'Impact', id: 'Dampak' },
  'risk.mitigation': { en: 'Mitigation', id: 'Mitigasi' },
  'risk.none': { en: 'No risks recorded for this combination.', id: 'Tidak ada risiko tercatat untuk kombinasi ini.' },
  'level.low': { en: 'Low', id: 'Rendah' },
  'level.med': { en: 'Med', id: 'Sedang' },
  'level.high': { en: 'High', id: 'Tinggi' },
  'fitness.heading': { en: 'Suggested fitness functions', id: 'Saran fitness function' },
  'fitness.intro': {
    en: 'Measurable checks for your top-weighted quality attributes (evolutionary architecture).',
    id: 'Pemeriksaan terukur untuk atribut kualitas berbobot tertinggi (evolutionary architecture).',
  },
  'costops.heading': { en: 'Cost & operational complexity', id: 'Biaya & kompleksitas operasional' },
  'costops.intro': {
    en: 'Qualitative profile per deployment option.',
    id: 'Profil kualitatif per opsi deployment.',
  },
  'costops.overhead': { en: 'Ops overhead', id: 'Overhead operasional' },
  'costops.infra': { en: 'Infra cost', id: 'Biaya infra' },
  'methodology.heading': { en: 'How it works — methodology', id: 'Cara kerja — metodologi' },
  'methodology.intro': {
    en: 'This tool turns project factors into weighted quality-attribute priorities (a utility tree), then scores each architecture option by how well it fits those priorities — an additive value model grounded in recognized methods. Two quality attributes (cost efficiency, time-to-market) are economic/delivery goals shown honestly outside the ISO product-quality model.',
    id: 'Alat ini mengubah faktor proyek menjadi prioritas atribut kualitas berbobot (pohon utilitas), lalu menilai tiap opsi arsitektur dari seberapa cocok dengan prioritas itu — model nilai aditif yang berlandaskan metode yang diakui. Dua atribut kualitas (efisiensi biaya, waktu rilis) adalah tujuan ekonomi/pengiriman yang ditampilkan jujur di luar model kualitas produk ISO.',
  },
  'presets.heading': { en: 'Scenario presets', id: 'Preset skenario' },
  'presets.intro': {
    en: 'Start from a typical scenario, then adjust. Applying a preset clears manual choices and overrides.',
    id: 'Mulai dari skenario umum, lalu sesuaikan. Menerapkan preset menghapus pilihan dan override manual.',
  },
  'mode.guided': { en: 'Guided', id: 'Terpandu' },
  'mode.expert': { en: 'Expert', id: 'Ahli' },
  'mode.switchToExpert': { en: 'Switch to Expert mode', id: 'Beralih ke mode Ahli' },
  'mode.switchToGuided': { en: 'Switch to Guided mode', id: 'Beralih ke mode Terpandu' },
  'override.heading': { en: 'Expert: QA weight overrides', id: 'Ahli: override bobot QA' },
  'override.intro': {
    en: 'Set a weight directly to lock it (ATAM stakeholder prioritization). Unlocked weights share the remainder, proportional to the factor-derived values.',
    id: 'Tetapkan bobot langsung untuk menguncinya (prioritisasi pemangku kepentingan ATAM). Bobot tak terkunci berbagi sisanya, proporsional terhadap nilai turunan faktor.',
  },
  'override.unlock': { en: 'Unlock', id: 'Buka kunci' },
  'override.clear': { en: 'Clear all overrides', id: 'Hapus semua override' },
  'override.locked': { en: 'locked', id: 'terkunci' },
  'glossary.heading': { en: 'Glossary', id: 'Glosarium' },
  'glossary.qa': { en: 'Quality attributes (ISO/IEC 25010:2023)', id: 'Atribut kualitas (ISO/IEC 25010:2023)' },
  'glossary.terms': { en: 'Key terms', id: 'Istilah kunci' },
  'action.reset': { en: 'Reset to defaults', id: 'Atur ulang ke default' },
  'action.followRec': { en: 'Follow recommendations', id: 'Ikuti rekomendasi' },
  'action.theme': { en: 'Toggle theme', id: 'Ganti tema' },
  'action.lang': { en: 'EN', id: 'ID' },
} satisfies Record<string, Bilingual>;

export type DictKey = keyof typeof DICT;
