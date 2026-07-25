import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { ChatPanel } from './ChatPanel';
import { CHAT_TOPICS } from './chatTopics';
import { renderWithI18n } from '../../test/render';

/**
 * The discoverability contract of the Chat Advisor panel.
 *
 * The adapter can answer ~27 intent families, but the panel used to advertise six chips, and the
 * full catalogue was reachable only by typing "help" — which a confused newcomer cannot know to do.
 * These tests pin the affordance that fixes it, because the failure mode is silent: the panel keeps
 * working perfectly while the depth stays invisible, which is exactly how the confusion survived
 * several rounds of "add more coverage".
 */

const noop = () => {};

const panel = (over: Partial<Parameters<typeof ChatPanel>[0]> = {}) =>
  renderWithI18n(
    <ChatPanel
      messages={[]}
      streaming={false}
      onSend={noop}
      onStop={noop}
      onRegenerate={noop}
      onReset={noop}
      onClose={noop}
      {...over}
    />,
  );

describe('ChatPanel — the capability browser is discoverable without prior knowledge', () => {
  beforeEach(() => localStorage.clear());

  it('offers a way into the full catalogue from the empty state (not just the six chips)', () => {
    panel();
    expect(screen.getByText('See everything I can answer')).toBeInTheDocument();
  });

  it('exposes the browser as a permanent header control, even mid-conversation', () => {
    panel({ messages: [{ id: '1', role: 'assistant', text: 'hi', ts: 0 }] });
    // Mid-conversation there is no empty state, so the header control is the ONLY way in.
    expect(screen.queryByText('See everything I can answer')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'What can I ask?' })).toBeInTheDocument();
  });

  it('lists every topic, then drills into that topic\'s real questions', () => {
    panel();
    fireEvent.click(screen.getByText('See everything I can answer'));

    for (const t of CHAT_TOPICS) expect(screen.getByText(t.label.en)).toBeInTheDocument();

    const first = CHAT_TOPICS[0];
    fireEvent.click(screen.getByText(first.label.en));
    for (const ask of first.asks) expect(screen.getByText(ask.en)).toBeInTheDocument();
    // Drilled in, the sibling topics are gone — that is the progressive disclosure.
    expect(screen.queryByText(CHAT_TOPICS[1].label.en)).not.toBeInTheDocument();
  });

  it('sends the question verbatim when tapped, so the suggestion is what the adapter receives', () => {
    const onSend = vi.fn();
    panel({ onSend });
    fireEvent.click(screen.getByText('See everything I can answer'));
    fireEvent.click(screen.getByText(CHAT_TOPICS[0].label.en));
    fireEvent.click(screen.getByText(CHAT_TOPICS[0].asks[0].en));

    expect(onSend).toHaveBeenCalledWith(CHAT_TOPICS[0].asks[0].en);
  });

  it('closes the browser after asking, so the answer is what the user lands on', () => {
    const { container } = panel({ onSend: noop });
    fireEvent.click(screen.getByText('See everything I can answer'));
    fireEvent.click(screen.getByText(CHAT_TOPICS[0].label.en));
    expect(container.querySelectorAll('.aa-chat-ask').length).toBeGreaterThan(0);

    fireEvent.click(screen.getByText(CHAT_TOPICS[0].asks[0].en));

    // Assert on the browser's own elements, not the question text: some catalogue questions are
    // deliberately also one of the six quick chips, so matching by text alone proves nothing.
    expect(container.querySelectorAll('.aa-chat-ask')).toHaveLength(0);
    expect(screen.queryByText('All topics')).not.toBeInTheDocument();
  });

  it('can go back up a level', () => {
    panel();
    fireEvent.click(screen.getByText('See everything I can answer'));
    fireEvent.click(screen.getByText(CHAT_TOPICS[0].label.en));
    fireEvent.click(screen.getByText('All topics'));

    for (const t of CHAT_TOPICS) expect(screen.getByText(t.label.en)).toBeInTheDocument();
  });
});
