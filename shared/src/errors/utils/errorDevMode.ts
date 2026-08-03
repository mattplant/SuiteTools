// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file errorDevMode.ts
 * @description
 * Process-wide flag controlling whether {@link handleError} surfaces errors to React
 * and whether the SPA shows the developer error overlay.
 *
 * Defaults to `false` (production-safe). The frontend bootstraps this from
 * `import.meta.env.DEV` and/or SuiteTools `settings.devMode`.
 */

let errorDevMode = false;

/**
 * Enable or disable developer-oriented error surfacing.
 * @param enabled - When true, overlays / reactTrigger may run.
 */
export function setErrorDevMode(enabled: boolean): void {
  errorDevMode = enabled;
}

/**
 * @returns Whether developer error surfacing is currently enabled.
 */
export function isErrorDevMode(): boolean {
  return errorDevMode;
}
