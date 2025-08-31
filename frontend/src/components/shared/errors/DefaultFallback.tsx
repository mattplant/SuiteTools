import type { FC } from 'react';

interface DefaultFallbackProps {
  error?: Error | null;
}

export const DefaultFallback: FC<DefaultFallbackProps> = ({ error }) => (
  <div>
    <h1>Something went wrong</h1>
    {error && <pre style={{ whiteSpace: 'pre-wrap' }}>{error.message}</pre>}
  </div>
);
