// SPDX-License-Identifier: GPL-3.0-or-later

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { SuiteError } from '@suiteworks/suitetools-shared';
import { DevSuiteErrorOverlay } from '../errors/DevSuiteErrorOverlay';

type DevErrorOverlayContextValue = {
  /** Show the floating overlay for a SuiteError (no-op if not a SuiteError). */
  show: (err: unknown) => boolean;
  dismiss: () => void;
  error: SuiteError | null;
};

const DevErrorOverlayContext = createContext<DevErrorOverlayContextValue | null>(null);

type Props = {
  children: ReactNode;
};

/**
 * Provides a dismissible floating {@link DevSuiteErrorOverlay} above app content.
 */
export function DevErrorOverlayProvider({ children }: Props): React.JSX.Element {
  const [error, setError] = useState<SuiteError | null>(null);

  const dismiss = useCallback(() => {
    setError(null);
  }, []);

  const show = useCallback((err: unknown): boolean => {
    if (err instanceof SuiteError) {
      setError(err);
      return true;
    }
    return false;
  }, []);

  const value = useMemo(() => ({ show, dismiss, error }), [show, dismiss, error]);

  return (
    <DevErrorOverlayContext.Provider value={value}>
      {children}
      {error ? <DevSuiteErrorOverlay error={error} onDismiss={dismiss} /> : null}
    </DevErrorOverlayContext.Provider>
  );
}

/**
 * Access the floating developer error overlay controls.
 */
export function useDevErrorOverlay(): DevErrorOverlayContextValue {
  const ctx = useContext(DevErrorOverlayContext);
  if (!ctx) {
    throw new Error('useDevErrorOverlay must be used within DevErrorOverlayProvider');
  }
  return ctx;
}

/**
 * Optional access when a provider may not be mounted (e.g. tests).
 */
export function useOptionalDevErrorOverlay(): DevErrorOverlayContextValue | null {
  return useContext(DevErrorOverlayContext);
}
