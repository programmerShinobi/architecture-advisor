import type { ReactNode } from 'react';

// A small, safe Markdown-subset renderer. It emits ONLY known React elements and never uses
// dangerouslySetInnerHTML, so raw HTML in content can never inject markup or scripts (React escapes
// all text) — the same safety `rehype-sanitize` would give, without the react-markdown/micromark
// dependency stack. Matches the repo's hand-built, dependency-free philosophy. Supports: H2/H3,
// paragraphs, unordered/ordered lists, blockquotes, fenced code, and inline bold/italic/code/links.
// Unit-tested in markdown.test.tsx.

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/;
const BOLD_RE = /\*\*([^*]+)\*\*/;
const ITALIC_RE = /\*([^*]+)\*/;
const CODE_RE = /`([^`]+)`/;

/** Only allow safe link targets (http(s) or in-app relative); anything else renders as plain text. */
function safeHref(url: string): string | null {
  const u = url.trim();
  if (/^https?:\/\//i.test(u) || u.startsWith('/') || u.startsWith('#')) return u;
  return null;
}

/** Parse inline markdown into React nodes (recursively, by precedence). */
function inline(text: string, key: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let rest = text;
  let i = 0;

  while (rest.length > 0) {
    const code = CODE_RE.exec(rest);
    const bold = BOLD_RE.exec(rest);
    const italic = ITALIC_RE.exec(rest);
    const link = LINK_RE.exec(rest);
    const candidates = [
      code && { kind: 'code', m: code },
      bold && { kind: 'bold', m: bold },
      italic && { kind: 'italic', m: italic },
      link && { kind: 'link', m: link },
    ].filter(Boolean) as { kind: string; m: RegExpExecArray }[];

    if (candidates.length === 0) {
      nodes.push(rest);
      break;
    }
    const next = candidates.reduce((a, b) => (b.m.index < a.m.index ? b : a));
    const { kind, m } = next;
    if (m.index > 0) nodes.push(rest.slice(0, m.index));
    const k = `${key}-${i++}`;

    if (kind === 'code') {
      nodes.push(<code key={k}>{m[1]}</code>);
    } else if (kind === 'bold') {
      nodes.push(<strong key={k}>{inline(m[1], k)}</strong>);
    } else if (kind === 'italic') {
      nodes.push(<em key={k}>{inline(m[1], k)}</em>);
    } else {
      const href = safeHref(m[2]);
      const external = href ? /^https?:\/\//i.test(href) : false;
      nodes.push(
        href ? (
          <a key={k} href={href} {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}>
            {m[1]}
          </a>
        ) : (
          <span key={k}>{m[0]}</span>
        ),
      );
    }
    rest = rest.slice(m.index + m[0].length);
  }
  return nodes;
}

/** Render a Markdown string into safe React nodes. */
export function renderMarkdown(md: string): ReactNode[] {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const blocks: ReactNode[] = [];
  let i = 0;
  let b = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '') {
      i++;
      continue;
    }

    // Audience blocks: ":::guided" / ":::expert" ... ":::" → a guided-only / expert-only container,
    // toggled by the app's Guided/Expert mode (the same `.guided-only`/`.expert-only` CSS the Advisor
    // uses). Lets one article serve both newcomers and experts.
    const fence = /^:::\s*(guided|expert)\s*$/.exec(line.trim());
    if (fence) {
      const cls = fence[1] === 'guided' ? 'guided-only' : 'expert-only';
      const buf: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== ':::') {
        buf.push(lines[i]);
        i++;
      }
      i++; // skip closing :::
      blocks.push(
        <div className={cls} key={`b${b++}`}>
          {renderMarkdown(buf.join('\n'))}
        </div>,
      );
      continue;
    }

    // Fenced code block
    if (line.trim().startsWith('```')) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        buf.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      blocks.push(
        <pre key={`b${b++}`}>
          <code>{buf.join('\n')}</code>
        </pre>,
      );
      continue;
    }

    // Headings
    if (line.startsWith('### ')) {
      blocks.push(<h3 key={`b${b++}`}>{inline(line.slice(4), `b${b}`)}</h3>);
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      blocks.push(<h2 key={`b${b++}`}>{inline(line.slice(3), `b${b}`)}</h2>);
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        buf.push(lines[i].slice(2));
        i++;
      }
      blocks.push(<blockquote key={`b${b++}`}>{inline(buf.join(' '), `b${b}`)}</blockquote>);
      continue;
    }

    // Unordered list
    if (/^[-*] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i])) {
        items.push(lines[i].slice(2));
        i++;
      }
      blocks.push(
        <ul key={`b${b++}`}>
          {items.map((it, idx) => (
            <li key={idx}>{inline(it, `b${b}-${idx}`)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    // Ordered list
    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ''));
        i++;
      }
      blocks.push(
        <ol key={`b${b++}`}>
          {items.map((it, idx) => (
            <li key={idx}>{inline(it, `b${b}-${idx}`)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    // Paragraph (gather consecutive non-blank, non-special lines)
    const buf: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].startsWith('#') &&
      !lines[i].startsWith('> ') &&
      !/^[-*] /.test(lines[i]) &&
      !/^\d+\. /.test(lines[i]) &&
      !lines[i].trim().startsWith('```')
    ) {
      buf.push(lines[i]);
      i++;
    }
    blocks.push(<p key={`b${b++}`}>{inline(buf.join(' '), `b${b}`)}</p>);
  }

  return blocks;
}
