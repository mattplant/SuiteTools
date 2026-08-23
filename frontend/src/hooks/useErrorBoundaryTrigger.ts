// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Reports an error without always tearing down the React tree.
 *
 * @fileoverview
 * The single way the app raises errors from async work. In error-dev mode a `SuiteError` opens
 * the floating dev overlay and the tree keeps rendering; otherwise the error is rethrown during
 * render so the nearest error boundary catches it.
 *
 * @remarks
 * The rethrow works by storing the error in state and throwing it on the next render — that is
 * what makes an error from a promise reach a boundary at all, since boundaries do not catch
 * async throws. Only `SuiteError` instances can be diverted to the overlay; anything else
 * always reaches the boundary.
 *
 * @see ../components/shared/context/DevErrorOverlayContext.tsx – the overlay this can divert to
 * @see ./useEntityList.ts – the main caller
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

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
