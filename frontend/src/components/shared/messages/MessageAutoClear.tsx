// SPDX-License-Identifier: GPL-3.0-or-later

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useInlineMessage } from "../../../hooks/useInlineMessage";

/**
 * Clears inline messages on route changes.
 * @returns null (side-effect only).
 */
export function MessageAutoClear(): null {
  const { clearMessage } = useInlineMessage();
  const location = useLocation();

  // Permanent by design, not deferred work: the rule reports `location.pathname` as an
  // unnecessary dependency because the body never reads it. It is the effect's *trigger* —
  // clearing on route change is the entire purpose — and neither Biome nor React's own rule
  // can express "trigger, not a read". Removing it would break the component.
  // biome-ignore lint/correctness/useExhaustiveDependencies: location.pathname is the trigger for this effect, not a value it reads
  useEffect(() => {
    clearMessage();
  }, [location.pathname, clearMessage]);

  return null;
}
