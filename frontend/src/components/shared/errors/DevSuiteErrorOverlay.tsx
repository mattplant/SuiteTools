import type { SuiteError } from '@suiteworks/suitetools-shared';

interface DevSuiteErrorOverlayProps {
  error: SuiteError;
}

/**
 * Displays a developer error overlay with error details and stack trace.
 * @param props - The props object containing the SuiteError.
 * @param props.error - The SuiteError object containing error information.
 * @returns JSX.Element representing the error overlay.
 */
export function DevSuiteErrorOverlay({ error }: DevSuiteErrorOverlayProps): JSX.Element {
  return (
    <div style={{ padding: '2rem', background: '#fee2e2', color: '#991b1b' }}>
      <h2>Dev Error Overlay</h2>
      <pre style={{ whiteSpace: 'pre-wrap' }}>
        {error.name}: {error.message}
      </pre>
      {error.stack && (
        <details>
          <summary>Stack trace</summary>
          <pre>{error.stack}</pre>
        </details>
      )}
    </div>
  );
}
