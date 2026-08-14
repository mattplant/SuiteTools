// SPDX-License-Identifier: GPL-3.0-or-later

import { useState, useCallback } from "react";
import { SuiteError } from "@suiteworks/suitetools-shared";
import { useOptionalDevErrorOverlay } from "../components/shared/context/DevErrorOverlayContext";
import { useShowDevErrorOverlay } from "./useShowDevErrorOverlay";

/**
 * Custom hook to surface errors without always tearing down the tree.
 *
 * In error-dev mode, SuiteErrors open the floating {@link DevSuiteErrorOverlay}.
 * Otherwise the error is rethrown into the nearest React error boundary.
 * @returns A callback to report an error.
 */
export function useErrorBoundaryTrigger(): (err: unknown) => void {
  const overlay = useOptionalDevErrorOverlay();
  const showDevOverlay = useShowDevErrorOverlay();
  const [pendingError, setPendingError] = useState<Error | null>(null);

  if (pendingError) throw pendingError;

  return useCallback(
    (err: unknown) => {
      if (showDevOverlay && err instanceof SuiteError && overlay?.show(err)) {
        return;
      }
      setPendingError(err instanceof Error ? err : new Error(String(err)));
    },
    [overlay, showDevOverlay],
  );
}
