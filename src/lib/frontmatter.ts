// A small, dependency-free parser for the constrained YAML frontmatter our content uses — no
// js-yaml / gray-matter (keeps the bundle lean and matches the repo's hand-built, dependency-free
// ethos). It handles exactly the shapes in src/config/contentSchema.ts: top-level scalars, inline
// arrays ([a, b]), one level of nested `key: value` maps, and lists of flow maps (- { k: v, ... }).
// The build-time guard (scripts/check-content.mjs) validates strictly; this parser reads
// already-well-formed files at runtime. Unit-tested in frontmatter.test.ts.

export type FrontmatterValue =
  | string
  | string[]
  | Record<string, unknown>
  | Record<string, unknown>[];

export interface ParsedFile {
  data: Record<string, FrontmatterValue>;
  body: string;
}

/** Strip surrounding quotes from a scalar. */
function unquote(s: string): string {
  const t = s.trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    return t.slice(1, -1);
  }
  return t;
}

/** Split on a delimiter, ignoring delimiters inside single/double quotes or braces. */
function splitTop(s: string, delim: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let quote = '';
  let cur = '';
  for (const ch of s) {
    if (quote) {
      if (ch === quote) quote = '';
      cur += ch;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
      cur += ch;
    } else if (ch === '{' || ch === '[') {
      depth++;
      cur += ch;
    } else if (ch === '}' || ch === ']') {
      depth--;
      cur += ch;
    } else if (ch === delim && depth === 0) {
      out.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

/** Parse an inline array literal: [a, "b", c]. */
function parseInlineArray(s: string): string[] {
  const inner = s.trim().slice(1, -1).trim();
  if (!inner) return [];
  return splitTop(inner, ',').map((x) => unquote(x)).filter((x) => x.length > 0);
}

/** Parse a flow map literal: { k: v, k2: "v2" }. */
function parseFlowMap(s: string): Record<string, unknown> {
  const inner = s.trim().slice(1, -1).trim();
  const obj: Record<string, unknown> = {};
  if (!inner) return obj;
  for (const pair of splitTop(inner, ',')) {
    const idx = pair.indexOf(':');
    if (idx === -1) continue;
    const key = pair.slice(0, idx).trim();
    obj[key] = parseScalar(pair.slice(idx + 1).trim());
  }
  return obj;
}

/** Parse a scalar value: inline array, flow map, number, or (un)quoted string. */
function parseScalar(raw: string): unknown {
  const s = raw.trim();
  if (s.startsWith('[')) return parseInlineArray(s);
  if (s.startsWith('{')) return parseFlowMap(s);
  const uq = unquote(s);
  return uq;
}

const indentOf = (line: string): number => line.length - line.trimStart().length;

/**
 * Split a Markdown file into its frontmatter object and body. Files without a leading `---` block
 * are treated as all-body with empty data.
 */
export function parseFrontmatter(raw: string): ParsedFile {
  const text = raw.replace(/^\uFEFF/, '');
  if (!text.startsWith('---')) return { data: {}, body: text };

  const lines = text.split('\n');
  // find the closing '---'
  let end = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      end = i;
      break;
    }
  }
  if (end === -1) return { data: {}, body: text };

  const fmLines = lines.slice(1, end);
  const body = lines.slice(end + 1).join('\n').replace(/^\n+/, '');
  const data: Record<string, FrontmatterValue> = {};

  for (let i = 0; i < fmLines.length; i++) {
    const line = fmLines[i];
    if (!line.trim() || indentOf(line) !== 0) continue;
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const rest = line.slice(colon + 1).trim();

    if (rest) {
      data[key] = parseScalar(rest) as FrontmatterValue;
      continue;
    }

    // Block value: gather indented child lines.
    const children: string[] = [];
    let j = i + 1;
    while (j < fmLines.length && (fmLines[j].trim() === '' || indentOf(fmLines[j]) > 0)) {
      if (fmLines[j].trim()) children.push(fmLines[j]);
      j++;
    }
    i = j - 1;

    if (children.length === 0) {
      data[key] = '';
    } else if (children[0].trim().startsWith('- ')) {
      // list (of flow maps or scalars)
      data[key] = children.map((c) => parseScalar(c.trim().slice(2).trim())) as FrontmatterValue;
    } else {
      // nested map
      const obj: Record<string, unknown> = {};
      for (const c of children) {
        const ci = c.indexOf(':');
        if (ci === -1) continue;
        obj[c.slice(0, ci).trim()] = parseScalar(c.slice(ci + 1).trim());
      }
      data[key] = obj as FrontmatterValue;
    }
  }

  return { data, body };
}
