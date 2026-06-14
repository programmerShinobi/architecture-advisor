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
  'action.reset': { en: 'Reset to defaults', id: 'Atur ulang ke default' },
  'action.followRec': { en: 'Follow recommendations', id: 'Ikuti rekomendasi' },
  'action.theme': { en: 'Toggle theme', id: 'Ganti tema' },
  'action.lang': { en: 'EN', id: 'ID' },
} satisfies Record<string, Bilingual>;

export type DictKey = keyof typeof DICT;
