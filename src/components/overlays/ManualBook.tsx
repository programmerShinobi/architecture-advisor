import { IconX } from '@tabler/icons-react';
import { useI18n } from '../../i18n/I18nContext';
import { QA_ORDER, QUALITY_ATTRIBUTES } from '../../config/qualityAttributes';
import { FACTOR_ORDER, FACTORS } from '../../config/factors';
import { INFLUENCE } from '../../config/factorQaMatrix';
import { DIMENSIONS } from '../../config/dimensions';
import { METHOD_REFERENCES } from '../../config/references';
import { READER_SECTIONS, READER_CITATIONS } from '../../config/readerContent';
import { composite, contributions, displayScore, rankWith, roundWeights } from '../../lib/scoring';
import type { Levels, QaId, Weights } from '../../types';

const READER_DOC_URL =
  'https://github.com/programmerShinobi/architecture-advisor/blob/main/docs/03-blueprint/architecture-reader.md';

interface Props {
  open: boolean;
  onClose: () => void;
  levels: Levels;
  weights: Weights;
}

export function ManualBook({ open, onClose, levels, weights }: Props) {
  const { t, tr, lang } = useI18n();
  if (!open) return null;
  const L = (en: string, id: string) => (lang === 'id' ? id : en);

  // ---- live worked example, from the user's current scenario ----
  const rounded = roundWeights(weights);
  const topPriorities = (QA_ORDER.filter((q) => rounded[q] > 0) as QaId[]).sort((a, b) => rounded[b] - rounded[a]);
  const d1 = rankWith(weights, 'D1');
  const topOpt = DIMENSIONS.D1.options.find((o) => o.id === d1[0].id) ?? DIMENSIONS.D1.options[0];
  const contribRows = contributions(weights, topOpt.qaFit).filter((c) => c.weight > 0.05);
  const compositeScore = composite(weights, topOpt.qaFit);
  const budgetLevel = levels.budget ?? 2;

  // active factors (those sending a signal) for the Step-1 illustration
  const activeFactors = FACTOR_ORDER.filter((f) => {
    const lvl = levels[f] ?? 0;
    const eff = f === 'budget' ? 2 - lvl : lvl;
    return eff !== 0;
  });

  const card: React.CSSProperties = {
    background: 'var(--color-background-secondary)',
    borderRadius: 'var(--border-radius-md)',
    padding: '12px 14px',
    margin: '8px 0',
  };
  const code: React.CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    background: 'var(--color-background-secondary)',
    borderRadius: 'var(--border-radius-md)',
    padding: '10px 12px',
    display: 'block',
    whiteSpace: 'pre-wrap',
    margin: '8px 0',
    color: 'var(--color-text-primary)',
  };
  const h = (s: string) => (
    <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '22px 0 6px' }}>{s}</h3>
  );
  const p = (en: string, id: string) => (
    <p style={{ fontSize: '13px', lineHeight: 1.65, color: 'var(--color-text-secondary)', margin: '6px 0' }}>
      {L(en, id)}
    </p>
  );

  return (
    <div className="f-ov open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div
        role="dialog"
        aria-label={t('manual.title')}
        style={{ width: '100%', maxWidth: '760px', maxHeight: '85vh', overflow: 'auto', background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-secondary)', borderRadius: 'var(--border-radius-lg)', boxShadow: '0 12px 40px rgba(0,0,0,.25)' }}
      >
        <div style={{ position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '0.5px solid var(--color-border-tertiary)', background: 'var(--color-background-primary)' }}>
          <span style={{ fontSize: '15px', fontWeight: 600 }}>{t('manual.title')}</span>
          <button type="button" onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', display: 'flex' }}>
            <IconX size={18} aria-hidden />
          </button>
        </div>

        <div style={{ padding: '6px 18px 22px' }}>
          {/* 1. Overview */}
          {h(L('1 · What this tool is', '1 · Apa itu alat ini'))}
          {p(
            'Architecture Advisor turns a few questions about your project into a recommended software architecture across five independent dimensions — and shows the full reasoning. It is decision support, not an oracle: every weight is a defensible default you can edit, and every score is traceable. Everything runs 100% in your browser — free, no account, no server, installable, and it keeps working offline.',
            'Architecture Advisor mengubah beberapa pertanyaan tentang proyek Anda menjadi rekomendasi arsitektur perangkat lunak pada lima dimensi independen — dan menunjukkan seluruh penalarannya. Ini alat bantu keputusan, bukan ramalan: tiap bobot adalah default yang bisa Anda ubah, dan tiap skor dapat ditelusuri. Semuanya berjalan 100% di browser Anda — gratis, tanpa akun, tanpa server, dapat dipasang, dan tetap bekerja offline.',
          )}
          {p(
            'The app has three areas: Home (the landing you saw first), the Advisor (the analysis itself), and Insights (a bilingual learning library over the same 21 architectures — catalog, playbooks, reviews, reference, learning paths, quizzes, and a lab). Section 7 maps every feature.',
            'Aplikasi punya tiga area: Beranda (halaman depan), Advisor (analisisnya sendiri), dan Wawasan (pustaka belajar dwibahasa atas 21 arsitektur yang sama — katalog, playbook, review, referensi, jalur belajar, kuis, dan lab). Bagian 7 memetakan semua fiturnya.',
          )}
          <span style={code}>{L('PROJECT FACTORS → QUALITY-ATTRIBUTE PRIORITIES → ARCHITECTURE FIT → ANALYSIS', 'FAKTOR PROYEK → PRIORITAS ATRIBUT KUALITAS → KECOCOKAN ARSITEKTUR → ANALISIS')}</span>

          {/* 2. The four steps */}
          {h(L('2 · The four steps', '2 · Empat langkah'))}
          {p(
            '(1) Describe your project with the 14 factors — start from one of the 10 scenario presets if one is close, and use the real-world example shown under each answer. (2) See the quality-attribute priorities the tool derives. (3) Get the recommendation across all five dimensions, with the trade-off radar and the reasoning. (4) Save or share — export an ADR, a full report, CSV/JSON, or a link that reproduces your exact scenario.',
            '(1) Jelaskan proyek Anda lewat 14 faktor — mulai dari salah satu dari 10 preset skenario bila ada yang mirip, dan manfaatkan contoh nyata di bawah tiap jawaban. (2) Lihat prioritas atribut kualitas yang diturunkan alat. (3) Dapatkan rekomendasi di kelima dimensi, dengan radar trade-off dan alasannya. (4) Simpan atau bagikan — ekspor ADR, laporan lengkap, CSV/JSON, atau tautan yang mereproduksi skenario Anda persis.',
          )}

          {/* 3. THE CALCULATION */}
          {h(L('3 · The calculation, in full detail', '3 · Perhitungan, selengkap-lengkapnya'))}
          {p(
            'This is an additive multi-attribute value model (MAVT) — the same family ATAM’s utility tree draws on. There are four steps.',
            'Ini model nilai multi-atribut aditif (MAVT) — keluarga yang sama dengan utility tree pada ATAM. Ada empat langkah.',
          )}

          <strong style={{ fontSize: '13px' }}>{L('Step 1 — Factor → quality-attribute weights', 'Langkah 1 — Faktor → bobot atribut kualitas')}</strong>
          {p(
            'Each factor level (0, 1, or 2) raises the priority of certain quality attributes through a fixed influence matrix. A factor’s contribution to a QA is influence × level. The budget factor is inverted — a tight budget is the strong signal — so it uses (2 − level). Negative contributions are clamped to 0, then all weights are normalized to sum to 100.',
            'Tiap level faktor (0, 1, atau 2) menaikkan prioritas atribut kualitas tertentu lewat matriks pengaruh tetap. Kontribusi sebuah faktor ke QA adalah pengaruh × level. Faktor anggaran terbalik — anggaran ketat adalah sinyal kuat — jadi memakai (2 − level). Kontribusi negatif dipangkas ke 0, lalu semua bobot dinormalkan agar berjumlah 100.',
          )}
          <span style={code}>{'raw[QA]   = Σ over factors of  influence(factor,QA) × effectiveLevel\n' + 'effective = (factor = budget) ? (2 − level) : level\nweight[QA] = max(0, raw[QA]) / Σ max(0, raw) × 100   // sums to 100'}</span>

          <strong style={{ fontSize: '13px' }}>{L('Step 2 — Composite score per option', 'Langkah 2 — Skor komposit per opsi')}</strong>
          {p(
            'Every option has a qaFit vector: an integer 1–5 per quality attribute (1 = poor fit, 5 = excellent). The composite is the weighted sum of fits. Because weights sum to 100 and fits are 1–5, the composite always lands in [1, 5].',
            'Tiap opsi punya vektor qaFit: bilangan bulat 1–5 per atribut kualitas (1 = buruk, 5 = sangat baik). Komposit adalah jumlah tertimbang dari kecocokan. Karena bobot berjumlah 100 dan kecocokan 1–5, komposit selalu di rentang [1, 5].',
          )}
          <span style={code}>{'composite(option) = Σ over QA of  ( weight[QA] / 100 ) × fit(option, QA)'}</span>

          <strong style={{ fontSize: '13px' }}>{L('Step 3 — Ranking, tie-break, close-call & display', 'Langkah 3 — Peringkat, tie-break, selisih tipis & tampilan')}</strong>
          {p(
            'Options are ranked by composite, descending. Ties break by canonical order (deterministic — the same inputs always give the same result). A “close call” is flagged when the top two are within 10% relative. The displayed 0–100 score is round(composite / 5 × 100); the priority percentages use largest-remainder (Hamilton) rounding so they sum to exactly 100.',
            'Opsi diperingkat berdasarkan komposit, menurun. Seri dipecah berdasarkan urutan kanonik (deterministik — input sama selalu memberi hasil sama). “Selisih tipis” ditandai saat dua teratas berjarak di bawah 10% relatif. Skor 0–100 yang ditampilkan adalah round(komposit / 5 × 100); persentase prioritas memakai pembulatan sisa-terbesar (Hamilton) agar berjumlah tepat 100.',
          )}

          <strong style={{ fontSize: '13px' }}>{L('Step 4 — Sensitivity & expert overrides', 'Langkah 4 — Sensitivitas & override ahli')}</strong>
          {p(
            'Sensitivity tries every single factor change of ±1 level and reports which one would flip the top pick (or “robust” if none does). In Expert mode you can override any QA weight, which locks it; the unlocked weights then share the remainder proportionally to their derived values.',
            'Sensitivitas mencoba tiap perubahan satu faktor sebesar ±1 level dan melaporkan mana yang membalik pilihan teratas (atau “tangguh” bila tak ada). Di mode Ahli Anda bisa override bobot QA mana pun, yang menguncinya; bobot tak terkunci lalu berbagi sisanya secara proporsional terhadap nilai turunannya.',
          )}

          {/* Live worked example */}
          {h(L('4 · Your numbers, computed live', '4 · Angka Anda, dihitung langsung'))}
          {p(
            'Nothing is hidden — here is the exact calculation for your current inputs. Change anything and reopen this to watch it update.',
            'Tidak ada yang disembunyikan — berikut perhitungan persis untuk input Anda saat ini. Ubah apa saja lalu buka lagi untuk melihatnya berubah.',
          )}
          <div style={card}>
            <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginBottom: '6px' }}>
              {L('Step 1 — factors sending a signal now', 'Langkah 1 — faktor yang mengirim sinyal saat ini')}
            </div>
            {activeFactors.length === 0 ? (
              <div style={{ fontSize: '12px' }}>{L('No factor is raised above its no-signal level.', 'Tidak ada faktor yang dinaikkan di atas level tanpa-sinyalnya.')}</div>
            ) : (
              <div style={{ fontSize: '12px', lineHeight: 1.7 }}>
                {activeFactors.map((f) => {
                  const lvl = levels[f] ?? 0;
                  const eff = f === 'budget' ? 2 - lvl : lvl;
                  const infl = Object.entries(INFLUENCE[f]).map(([q, w]) => `${QUALITY_ATTRIBUTES[q as QaId].name[lang]} ${w > 0 ? '+' : ''}${w * eff}`).join(', ');
                  return (
                    <div key={f}>
                      <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{tr(FACTORS[f].label)}</span>
                      {f === 'budget' ? ` (${L('inverted', 'terbalik')}, level ${budgetLevel} → ${eff})` : ` (level ${eff})`} → {infl}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div style={card}>
            <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginBottom: '6px' }}>
              {L('Normalized priorities (sum to 100)', 'Prioritas ternormalkan (berjumlah 100)')}
            </div>
            <div style={{ fontSize: '12px' }}>
              {topPriorities.map((q) => `${QUALITY_ATTRIBUTES[q].name[lang]} ${rounded[q]}%`).join(' · ')}
            </div>
          </div>
          <div style={card}>
            <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginBottom: '6px' }}>
              {L('Step 2 — composite for your top pick:', 'Langkah 2 — komposit untuk pilihan teratas Anda:')}{' '}
              <span style={{ color: 'var(--color-text-info)', fontWeight: 500 }}>{topOpt.name}</span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ color: 'var(--color-text-tertiary)', textAlign: 'right' }}>
                  <th style={{ textAlign: 'left', padding: '3px 6px' }}>{t('contribution.qa')}</th>
                  <th style={{ padding: '3px 6px' }}>{t('contribution.weight')}</th>
                  <th style={{ padding: '3px 6px' }}>{t('contribution.fit')}</th>
                  <th style={{ padding: '3px 6px' }}>{t('contribution.points')}</th>
                </tr>
              </thead>
              <tbody>
                {contribRows.map((c) => (
                  <tr key={c.qa} style={{ textAlign: 'right' }}>
                    <td style={{ textAlign: 'left', padding: '3px 6px' }}>{QUALITY_ATTRIBUTES[c.qa].name[lang]}</td>
                    <td className="num" style={{ padding: '3px 6px' }}>{Math.round(c.weight)}%</td>
                    <td className="num" style={{ padding: '3px 6px' }}>{c.fit}</td>
                    <td className="num" style={{ padding: '3px 6px' }}>{c.points.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ fontSize: '12px', marginTop: '8px', borderTop: '0.5px solid var(--color-border-tertiary)', paddingTop: '8px' }}>
              {L('Composite', 'Komposit')} = <span className="num">{compositeScore.toFixed(2)}</span> →{' '}
              {L('displayed', 'ditampilkan')} round({compositeScore.toFixed(2)} / 5 × 100) ={' '}
              <span className="num" style={{ color: 'var(--color-text-info)', fontWeight: 600 }}>{displayScore(compositeScore)}</span>/100.
            </div>
          </div>

          {/* 5. Dimensions — every option explained, plain-language + deeper, evidence-grounded */}
          {h(L('5 · The five dimensions — every option explained', '5 · Lima dimensi — tiap opsi dijelaskan'))}
          {p(
            'A coherent architecture is more than one label. The tool decides across five orthogonal dimensions, each scored independently with the same model. Below, every option is explained for newcomers and experts alike — what it is, when it fits, what it costs, and a deeper note with the evidence. These are defensible, well-supported explanations grounded in recognised standards and the software-architecture literature (see the sources under each note and the bibliography in Section 9) — not universal laws; context decides.',
            'Arsitektur yang koheren lebih dari satu label. Alat memutuskan pada lima dimensi ortogonal, masing-masing dinilai independen dengan model yang sama. Di bawah ini tiap opsi dijelaskan untuk pemula maupun ahli — apa itu, kapan cocok, apa biayanya, dan catatan lebih dalam beserta buktinya. Ini penjelasan yang dapat dipertanggungjawabkan dan berbasis standar yang diakui serta literatur arsitektur perangkat lunak (lihat sumber di tiap catatan dan daftar pustaka pada Bagian 9) — bukan hukum mutlak; konteks yang menentukan.',
          )}
          <p style={{ fontSize: '12.5px', margin: '6px 0' }}>
            <a href={READER_DOC_URL} target="_blank" rel="noreferrer" style={{ color: 'var(--color-text-info)' }}>
              {t('reader.learnMore')} ↗
            </a>
          </p>
          {READER_SECTIONS.map((section) => (
            <div key={section.dim} style={{ margin: '14px 0' }}>
              <h4 style={{ fontSize: '13.5px', fontWeight: 600, margin: '14px 0 4px' }}>
                {section.dim} · {tr(DIMENSIONS[section.dim].name)}{' '}
                <span style={{ color: 'var(--color-text-tertiary)', fontWeight: 400 }}>— {tr(DIMENSIONS[section.dim].guidedLabel)}</span>
              </h4>
              <p style={{ fontSize: '12.5px', lineHeight: 1.6, color: 'var(--color-text-secondary)', margin: '4px 0 8px' }}>{tr(section.intro)}</p>
              {section.entries.map((e) => (
                <div key={e.optionId} style={card}>
                  <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '5px' }}>{e.name}</div>
                  <dl style={{ display: 'grid', gap: '4px', margin: 0, fontSize: '12.5px', lineHeight: 1.5 }}>
                    <div>
                      <dt style={{ display: 'inline', fontWeight: 600 }}>{t('reader.what')}: </dt>
                      <dd style={{ display: 'inline', margin: 0, color: 'var(--color-text-secondary)' }}>{tr(e.what)}</dd>
                    </div>
                    <div>
                      <dt style={{ display: 'inline', fontWeight: 600, color: 'var(--color-text-success)' }}>{t('reader.fits')}: </dt>
                      <dd style={{ display: 'inline', margin: 0, color: 'var(--color-text-secondary)' }}>{tr(e.fits)}</dd>
                    </div>
                    <div>
                      <dt style={{ display: 'inline', fontWeight: 600, color: 'var(--color-text-cost)' }}>{t('reader.cost')}: </dt>
                      <dd style={{ display: 'inline', margin: 0, color: 'var(--color-text-secondary)' }}>{tr(e.cost)}</dd>
                    </div>
                    <div>
                      <dt style={{ display: 'inline', fontWeight: 600, color: 'var(--color-text-info)' }}>{t('reader.deeper')}: </dt>
                      <dd style={{ display: 'inline', margin: 0, color: 'var(--color-text-secondary)' }}>{tr(e.deeper)}</dd>
                    </div>
                  </dl>
                  {e.cites.length > 0 && (
                    <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', marginTop: '5px' }}>
                      {L('Sources', 'Sumber')}:{' '}
                      {e.cites.map((k, i) => {
                        const c = READER_CITATIONS[k];
                        if (!c) return null;
                        return (
                          <span key={k}>
                            {i > 0 && ' · '}
                            {c.url ? (
                              <a href={c.url} target="_blank" rel="noreferrer" style={{ color: 'var(--color-text-info)' }}>{c.label}</a>
                            ) : (
                              c.label
                            )}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}

          {/* 6. Analysis */}
          {h(L('6 · Analysis & safeguards', '6 · Analisis & pengaman'))}
          {p(
            'The radar overlays options across all 12 attributes so trade-offs are visible. Anti-pattern checks flag known-bad combinations (e.g. microservices on one shared database — a distributed monolith). The sensitivity card shows how fragile the pick is; migration paths give a safe, incremental route (Strangler Fig) if you already have a system.',
            'Radar menumpuk opsi pada seluruh 12 atribut agar trade-off terlihat. Pemeriksaan anti-pattern menandai kombinasi yang dikenal buruk (mis. microservices pada satu database bersama — distributed monolith). Kartu sensitivitas menunjukkan seberapa rapuh pilihan; jalur migrasi memberi rute bertahap yang aman (Strangler Fig) bila Anda sudah punya sistem.',
          )}

          {/* 7. Feature map — everything in the app (Fase 2: the Guide covers ALL features) */}
          {h(L('7 · Everything in the app — the feature map', '7 · Semua yang ada di aplikasi — peta fitur'))}

          <strong style={{ fontSize: '13px' }}>{L('Home', 'Beranda')}</strong>
          {p(
            'The landing page introduces the idea, shows the five-dimension radar motif, and deep-links into featured architectures. "Start free analysis" jumps straight into the Advisor.',
            'Halaman depan memperkenalkan idenya, menampilkan motif radar lima dimensi, dan menaut langsung ke arsitektur unggulan. "Mulai analisis gratis" langsung membuka Advisor.',
          )}

          <strong style={{ fontSize: '13px' }}>{L('Advisor — guided or expert', 'Advisor — terpandu atau ahli')}</strong>
          {p(
            'Guided mode asks plain-language questions — every factor now shows a real-world example for the level you picked. Expert mode adds technical names, editable ISO/IEC 25010 weights (lock any attribute), per-option overrides, the data grid, and CSV/JSON export. Ten scenario presets fill all 14 factors in one click: five calibrated (machine-verified against the model’s outcome targets) and five helper scenarios (B2B SaaS, consumer mobile, data platform, legacy modernization, real-time collaboration).',
            'Mode Terpandu bertanya dengan bahasa awam — tiap faktor kini menampilkan contoh nyata untuk level yang Anda pilih. Mode Ahli menambah nama teknis, bobot ISO/IEC 25010 yang dapat diedit (kunci atribut mana pun), override per opsi, tabel data, dan ekspor CSV/JSON. Sepuluh preset skenario mengisi 14 faktor dalam satu klik: lima terkalibrasi (terverifikasi mesin terhadap target hasil model) dan lima skenario bantuan (SaaS B2B, mobile konsumen, platform data, modernisasi legacy, kolaborasi real-time).',
          )}
          {p(
            'The analysis section adds the trade-off radar, sensitivity ("what single change flips this pick?"), pin-A/B scenario compare, anti-pattern warnings, migration paths, a risk register, fitness functions, cost/ops indicators, and a C4 sketch.',
            'Bagian analisis menambah radar trade-off, sensitivitas ("perubahan tunggal apa yang membalik pilihan?"), pembanding skenario pin-A/B, peringatan anti-pattern, jalur migrasi, daftar risiko, fitness function, indikator biaya/operasional, dan sketsa C4.',
          )}

          <strong style={{ fontSize: '13px' }}>{L('Insights — seven ways into the same knowledge', 'Insights — tujuh pintu ke pengetahuan yang sama')}</strong>
          {p(
            'Catalog (discover each of the 21 architectures), Playbook (step-by-step implementation), Review (structured evaluation with a verdict), Library (reference: concepts & terminology + evergreen articles), Roadmap (learning paths), Academy (quizzes with explanations), and Lab (experiments that load a prepared scenario into the real engine). Everything is bilingual and cross-linked.',
            'Katalog (kenali 21 arsitektur), Playbook (implementasi langkah demi langkah), Review (evaluasi terstruktur dengan verdict), Pustaka (referensi: konsep & terminologi + artikel evergreen), Peta Belajar (jalur belajar), Akademi (kuis dengan penjelasan), dan Lab (eksperimen yang memuat skenario siap pakai ke mesin sungguhan). Semuanya dwibahasa dan saling bertaut.',
          )}

          <strong style={{ fontSize: '13px' }}>{L('Save, export & share', 'Simpan, ekspor & bagikan')}</strong>
          {p(
            'Your scenario saves locally as you type. Export an ADR (MADR markdown), a print-ready report, or CSV/JSON (expert); the full state also lives in the share link, so a URL reproduces your exact scenario on any device. Import a saved JSON to continue where you left off.',
            'Skenario Anda tersimpan lokal saat mengetik. Ekspor ADR (markdown MADR), laporan siap cetak, atau CSV/JSON (ahli); seluruh state juga ada di tautan berbagi, sehingga sebuah URL mereproduksi skenario Anda persis di perangkat mana pun. Impor JSON tersimpan untuk melanjutkan.',
          )}

          <strong style={{ fontSize: '13px' }}>{L('Chrome: palette, language, themes, mobile & offline', 'Antarmuka: palette, bahasa, tema, mobile & offline')}</strong>
          {p(
            'Press ⌘K for the command palette (every action, searchable) and ? for keyboard shortcuts. The header switches Guided/Expert, EN/ID (the whole app is bilingual to the deepest level), and dark/light themes. On phones, a bottom tab bar and action bar take over. The app installs as a PWA and keeps working offline.',
            'Tekan ⌘K untuk command palette (semua aksi, dapat dicari) dan ? untuk pintasan keyboard. Header mengganti Terpandu/Ahli, EN/ID (seluruh aplikasi dwibahasa sampai level terdalam), dan tema gelap/terang. Di ponsel, tab bar bawah dan action bar mengambil alih. Aplikasi dapat dipasang sebagai PWA dan tetap bekerja offline.',
          )}

          {/* 8. Honesty */}
          {h(L('8 · Honesty & limitations', '8 · Kejujuran & batasan'))}
          {p(
            'The encoded weights and fit values are defensible expert defaults, not empirically validated facts. The tool cannot capture your team’s tacit knowledge, politics, or unique constraints. Treat a close call as a genuine tie and apply judgment. Empirical validation is a future (v3.0) goal.',
            'Bobot dan nilai kecocokan yang tertanam adalah default ahli yang dapat dipertanggungjawabkan, bukan fakta yang tervalidasi empiris. Alat tidak bisa menangkap pengetahuan tersirat tim, politik, atau kendala unik Anda. Anggap selisih tipis sebagai seri sungguhan dan gunakan pertimbangan. Validasi empiris adalah tujuan mendatang (v3.0).',
          )}

          {/* 9. Methodology */}
          {h(L('9 · Methodology & sources', '9 · Metodologi & sumber'))}
          {p(
            'The method the tool operationalizes:',
            'Metode yang dioperasionalkan alat ini:',
          )}
          <ul style={{ fontSize: '13px', lineHeight: 1.7, paddingLeft: '18px' }}>
            {METHOD_REFERENCES.map((r) => (
              <li key={r.label}>
                <a href={r.url} target="_blank" rel="noreferrer" style={{ color: 'var(--color-text-info)' }}>{r.label}</a>
                <span style={{ color: 'var(--color-text-secondary)' }}> — {tr(r.note)}</span>
              </li>
            ))}
          </ul>
          {p(
            'Bibliography — the architecture literature the Section 5 explanations draw on (recognised standards, seminal books, and peer-reviewed / widely-cited works; the method sources above are not repeated):',
            'Daftar pustaka — literatur arsitektur yang menjadi dasar penjelasan Bagian 5 (standar yang diakui, buku mani, dan karya peer-review / banyak dikutip; sumber metode di atas tidak diulang):',
          )}
          <ul style={{ fontSize: '13px', lineHeight: 1.7, paddingLeft: '18px' }}>
            {Object.values(READER_CITATIONS)
              .filter((c) => !['iso25010', 'atam', 'add', 'mavt', 'evoarch'].includes(c.key))
              .map((c) => (
                <li key={c.key}>
                  {c.url ? (
                    <a href={c.url} target="_blank" rel="noreferrer" style={{ color: 'var(--color-text-info)' }}>{c.label}</a>
                  ) : (
                    <span style={{ color: 'var(--color-text-primary)' }}>{c.label}</span>
                  )}
                  <span style={{ color: 'var(--color-text-secondary)' }}> — {tr(c.note)}</span>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// Default export so the Manual can be React.lazy-loaded (it carries the detailed architecture
// explanations, kept out of the initial bundle). The named export stays for direct test imports.
export default ManualBook;
