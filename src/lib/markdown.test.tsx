import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { renderMarkdown } from './markdown';

// The safe Markdown-subset renderer: known elements only, links sanitized, no HTML passthrough.
describe('renderMarkdown', () => {
  const R = (md: string) => render(<div>{renderMarkdown(md)}</div>);

  it('renders headings, paragraphs, and lists', () => {
    const { container } = R('## Title\n\nA paragraph.\n\n- one\n- two');
    expect(container.querySelector('h2')?.textContent).toBe('Title');
    expect(container.querySelector('p')?.textContent).toBe('A paragraph.');
    expect(container.querySelectorAll('li')).toHaveLength(2);
  });

  it('renders inline bold, italic, and code', () => {
    const { container } = R('a **bold** and *em* and `code` here');
    expect(container.querySelector('strong')?.textContent).toBe('bold');
    expect(container.querySelector('em')?.textContent).toBe('em');
    expect(container.querySelector('code')?.textContent).toBe('code');
  });

  it('renders safe links with external rel/target', () => {
    const { container } = R('see [docs](https://example.com/a)');
    const a = container.querySelector('a');
    expect(a?.getAttribute('href')).toBe('https://example.com/a');
    expect(a?.getAttribute('rel')).toContain('noreferrer');
    expect(a?.getAttribute('target')).toBe('_blank');
  });

  it('does not emit anchors for unsafe (javascript:) URLs', () => {
    const { container } = R('click [x](javascript:alert(1))');
    expect(container.querySelector('a')).toBeNull();
    expect(container.textContent).toContain('[x](javascript:alert(1))');
  });

  it('never injects raw HTML (escaped as text)', () => {
    const { container } = R('<img src=x onerror=alert(1)>');
    expect(container.querySelector('img')).toBeNull();
    expect(container.textContent).toContain('<img src=x onerror=alert(1)>');
  });

  it('wraps :::guided / :::expert blocks in mode-toggled containers', () => {
    const { container } = R('intro\n\n:::guided\nfor newcomers\n:::\n\n:::expert\nfor experts\n:::');
    const guided = container.querySelector('.guided-only');
    const expert = container.querySelector('.expert-only');
    expect(guided?.textContent).toContain('for newcomers');
    expect(expert?.textContent).toContain('for experts');
  });
});
