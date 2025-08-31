import { Component } from 'react';
import type { ReactNode } from 'react';
import { DefaultFallback } from './DefaultFallback';

type Props = { children: ReactNode };
type State = { error: Error | null };

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    // Unified logging/reporting
    console.error('[SuiteTools] Uncaught error in AppErrorBoundary:', error, info);
    // In dev, this could trigger DevSuiteErrorOverlay
  }

  render(): ReactNode {
    return this.state.error ? <DefaultFallback error={this.state.error} /> : this.props.children;
  }
}
