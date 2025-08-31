import { useState, useCallback } from 'react';

/**
 * Custom hook to trigger an error boundary by throwing an error from state.
 * @returns A callback function to set an error, which will be thrown on the next render.
 */
export function useErrorBoundaryTrigger(): (err: unknown) => void {
  const [pendingError, setPendingError] = useState<Error | null>(null);

  if (pendingError) throw pendingError;

  return useCallback((err: unknown) => {
    setPendingError(err instanceof Error ? err : new Error(String(err)));
  }, []);
}
