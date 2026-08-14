// SPDX-License-Identifier: GPL-3.0-or-later

import { useAppSettingsContext } from "./useAppSettingsContext";

/**
 * Whether the floating developer error overlay should be shown.
 *
 * Uses React settings state (and Vite DEV) only — not the module-level
 * {@link isErrorDevMode} flag — so toggling Dev Mode applies without a reload.
 */
export function useShowDevErrorOverlay(): boolean {
  const { settings, loading } = useAppSettingsContext();

  if (import.meta.env.DEV) {
    return true;
  }

  // While settings are still loading, prefer the conservative non-overlay path
  // so we do not flash the overlay from a stale module flag.
  if (loading || !settings) {
    return false;
  }

  return Boolean(settings.devMode);
}
