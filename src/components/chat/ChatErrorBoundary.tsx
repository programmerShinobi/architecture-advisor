import { Component, type ErrorInfo, type ReactNode } from 'react';

// Per-bubble crash isolation (Blueprint Phase 2.2). If a single message fails to render (e.g. a
// future LLM emits markup the renderer chokes on), THIS boundary shows a localized fallback in that
// one bubble — the chat and the whole app keep running. Local markdown is React-elements-only so it
// can't inject HTML; the boundary is the belt-and-braces for any future rich renderer.
interface Props {
  fallback: ReactNode;
  children: ReactNode;
}
interface State {
  failed: boolean;
}

export class ChatErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Non-fatal: keep a console breadcrumb for debugging without surfacing a global crash.
    if (import.meta.env.DEV) console.warn('[chat] message render failed', error, info);
  }

  render(): ReactNode {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
