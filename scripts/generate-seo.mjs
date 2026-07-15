#!/usr/bin/env node
/**
 * Architecture Advisor — SEO / SSG-lite generator (runs after `vite build`).
 *
 * The app itself stays a client-rendered SPA (no router, no hydration risk — see DECISIONS.md).
 * For search discoverability this script emits, into dist/:
 *   1. Static, crawlable HTML snapshots of every Markdown article under content/
 *      (dist/insights/<section>/<slug>/index.html) — self-canonical, JSON-LD TechArticle,
 *      linking back into the app. Pure HTML: adds zero bytes to the JS budgets.
 *   2. sitemap.xml — the app root + every snapshot, lastmod from `last_reviewed`.
 *
 * It is also a guard (fitness-function ethos): the canonical URL hardcoded in index.html and the
 * Sitemap line in public/robots.txt must match SITE_URL in src/config/site.ts, or the build fails —
 * so the three can never drift. Dependency-free, like the other scripts.
 * Run: node scripts/generate-seo.mjs   (after a build; exit 0 = OK)
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const read = (p) => readFileSync(join(root, p), 'utf8');

// ---- SITE_URL from the single source of truth, cross-checked against index.html/robots.txt ----
const siteTs = read('src/config/site.ts');
const SITE_URL = siteTs.match(/export const SITE_URL = '([^']+)'/)?.[1];
if (!SITE_URL) {
  console.error('✗ SEO: could not read SITE_URL from src/config/site.ts');
  process.exit(1);
}
const problems = [];
if (!read('index.html').includes(`<link rel="canonical" href="${SITE_URL}" />`))
  problems.push(`index.html canonical does not match SITE_URL (${SITE_URL})`);
if (!read('public/robots.txt').includes(`Sitemap: ${SITE_URL}sitemap.xml`))
  problems.push(`public/robots.txt Sitemap line does not match SITE_URL (${SITE_URL})`);
if (problems.length) {
  for (const p of problems) console.error(`✗ SEO guard: ${p}`);
  process.exit(1);
}

const DIST = join(root, 'dist');
if (!existsSync(DIST)) {
  console.error('✗ SEO: dist/ not found — run `vite build` first.');
  process.exit(1);
}

// ---- minimal frontmatter split (independent of the app parser, cross-check ethos) ----
function splitFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  return m ? { fm: m[1], body: m[2] } : null;
}
const fmValue = (fm, key) => {
  const m = fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  if (!m) return '';
  const v = m[1].trim();
  return v.startsWith('"') || v.startsWith("'") ? v.slice(1, -1) : v;
};
const fmSources = (fm) =>
  [...fm.matchAll(/\{\s*label:\s*"((?:[^"\\]|\\.)*)"[^}]*?url:\s*"([^"]+)"/g)].map((m) => ({ label: m[1], url: m[2] }));

// ---- tiny Markdown → HTML (headings, lists, tables, code fences, inline marks; escapes HTML) ----
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = (s) =>
  esc(s)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" rel="noopener">$1</a>');

function mdToHtml(md) {
  const out = [];
  // Drop the reading-mode markers; a static snapshot shows the whole article.
  const lines = md.replace(/^:::(guided|expert)\s*$/gm, '').replace(/^:::\s*$/gm, '').split('\n');
  let list = null; // 'ul' | 'ol'
  let table = false;
  let code = false;
  const closeList = () => { if (list) { out.push(`</${list}>`); list = null; } };
  const closeTable = () => { if (table) { out.push('</table>'); table = false; } };
  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      closeList(); closeTable();
      out.push(code ? '</code></pre>' : '<pre><code>');
      code = !code;
      continue;
    }
    if (code) { out.push(esc(line)); continue; }
    const t = line.trim();
    if (!t) { closeList(); closeTable(); continue; }
    const h = t.match(/^(#{1,4})\s+(.*)$/);
    // Articles use ## as their top level (the page <h1> is the frontmatter title), so ## → <h2>.
    if (h) { closeList(); closeTable(); const lvl = Math.max(2, h[1].length); out.push(`<h${lvl}>${inline(h[2])}</h${lvl}>`); continue; }
    if (t.startsWith('|')) {
      closeList();
      if (/^\|[\s\-|:]+\|$/.test(t)) continue; // separator row
      if (!table) { out.push('<table>'); table = true; }
      const cells = t.slice(1, -1).split('|').map((c) => `<td>${inline(c.trim())}</td>`).join('');
      out.push(`<tr>${cells}</tr>`);
      continue;
    }
    closeTable();
    const li = t.match(/^[-*]\s+(?:\[[ x]\]\s+)?(.*)$/);
    if (li) { if (list !== 'ul') { closeList(); out.push('<ul>'); list = 'ul'; } out.push(`<li>${inline(li[1])}</li>`); continue; }
    const oli = t.match(/^\d+\.\s+(.*)$/);
    if (oli) { if (list !== 'ol') { closeList(); out.push('<ol>'); list = 'ol'; } out.push(`<li>${inline(oli[1])}</li>`); continue; }
    const q = t.match(/^>\s?(.*)$/);
    if (q) { closeList(); out.push(`<blockquote><p>${inline(q[1])}</p></blockquote>`); continue; }
    closeList();
    out.push(`<p>${inline(t)}</p>`);
  }
  closeList(); closeTable();
  if (code) out.push('</code></pre>');
  return out.join('\n');
}

// ---- page shell for a snapshot ----
const CSS = `
  :root{color-scheme:light dark}
  body{font-family:system-ui,-apple-system,'Segoe UI',sans-serif;line-height:1.65;max-width:44rem;
    margin:0 auto;padding:2rem 1.25rem 4rem;color:#1e293b;background:#ffffff}
  @media (prefers-color-scheme:dark){body{color:#cbd5e1;background:#0f172a}
    a{color:#7dd3fc}.meta,blockquote{color:#94a3b8}pre,code,td{border-color:#334155}
    pre{background:#1e293b}}
  a{color:#0369a1}h1{font-size:1.6rem;line-height:1.3}h2{font-size:1.2rem;margin-top:2rem}
  h3{font-size:1.05rem;margin-top:1.5rem}.meta{font-size:.85rem;color:#64748b;margin:.25rem 0 1.5rem}
  blockquote{border-left:3px solid currentColor;margin:1rem 0;padding-left:1rem;color:#64748b}
  pre{background:#f1f5f9;border:1px solid #e2e8f0;border-radius:6px;padding:1rem;overflow-x:auto;font-size:.85rem}
  code{font-family:ui-monospace,'JetBrains Mono',monospace;font-size:.9em}
  table{border-collapse:collapse;width:100%;font-size:.9rem}td{border:1px solid #e2e8f0;padding:.4rem .6rem}
  .app-link{display:inline-block;margin-top:2rem;font-weight:600}
  .sources{margin-top:2.5rem;border-top:1px solid #e2e8f0;padding-top:1rem;font-size:.9rem}
`;

function snapshotHtml({ title, description, url, dateReviewed, sources, bodyHtml }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description,
    url,
    dateModified: dateReviewed,
    inLanguage: 'en',
    isPartOf: { '@type': 'WebSite', name: 'Architecture Advisor', url: SITE_URL },
    author: { '@type': 'Organization', name: 'Architecture Advisor' },
    citation: sources.map((s) => s.url),
  };
  const cites = sources
    .map((s) => `<li><a href="${s.url}" rel="noopener">${esc(s.label)}</a></li>`)
    .join('\n');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)} — Architecture Advisor</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="en" href="${url}">
<link rel="alternate" hreflang="x-default" href="${url}">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<style>${CSS}</style>
</head>
<body>
<p class="meta"><a href="${SITE_URL}">Architecture Advisor</a> · Insights</p>
<h1>${esc(title)}</h1>
<p class="meta">Last reviewed ${dateReviewed}</p>
${bodyHtml}
<div class="sources"><strong>Sources</strong><ul>
${cites}
</ul></div>
<a class="app-link" href="${SITE_URL}">Try it interactively in the Architecture Advisor →</a>
</body>
</html>
`;
}

// ---- generate snapshots + sitemap ----
const files = readdirSync(join(root, 'content'), { recursive: true })
  .filter((f) => String(f).endsWith('.md'))
  .map((f) => String(f).split('\\').join('/'));

const urls = [{ loc: SITE_URL, lastmod: new Date().toISOString().slice(0, 10) }];
let n = 0;
for (const rel of files) {
  const parsed = splitFrontmatter(read(`content/${rel}`));
  if (!parsed) { console.error(`✗ SEO: malformed frontmatter in content/${rel}`); process.exit(1); }
  const { fm, body: rawBody } = parsed;
  // Bodies are bilingual (English above a `<!-- lang:id -->` line, Indonesian below). The crawlable
  // snapshot is the English canonical (title_en/summary_tldr_en, JSON-LD lang en), so take the part
  // before the delimiter; the Indonesian body is served to real readers via the in-app toggle.
  const body = rawBody.split(/^<!--\s*lang:id\s*-->\s*$/m)[0].trimEnd();
  const section = fmValue(fm, 'section');
  const slug = fmValue(fm, 'slug');
  const title = fmValue(fm, 'title_en');
  const description = fmValue(fm, 'summary_tldr_en');
  const dateReviewed = fmValue(fm, 'last_reviewed');
  if (!section || !slug || !title || !description) {
    console.error(`✗ SEO: content/${rel} is missing section/slug/title_en/summary_tldr_en`);
    process.exit(1);
  }
  const url = `${SITE_URL}insights/${section}/${slug}/`;
  const html = snapshotHtml({ title, description, url, dateReviewed, sources: fmSources(fm), bodyHtml: mdToHtml(body) });
  const dir = join(DIST, 'insights', section, slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
  urls.push({ loc: url, lastmod: dateReviewed });
  n++;
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('\n')}
</urlset>
`;
writeFileSync(join(DIST, 'sitemap.xml'), sitemap);

console.log(`✓ SEO: ${n} static article snapshot(s) + sitemap.xml (${urls.length} URLs) written to dist/; canonical/robots cross-checked against SITE_URL.`);
