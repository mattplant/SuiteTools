// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Signals that NetSuite's APM tooling is not usable in this account.
 *
 * @fileoverview
 * The concurrency screens scrape APM scriptlets, which may be missing entirely or answer with
 * an HTML notice instead of JSON. This error marks that case as an expected environment
 * condition rather than a fault, and carries the user-facing copy the screens display.
 *
 * @remarks
 * Deliberately extends `Error`, not `SuiteError` — it must not travel through `handleError`,
 * because an account without APM is not something to log as a failure. Callers are expected to
 * soft-handle it and show `APM_UNAVAILABLE_MESSAGE`. The `setPrototypeOf` call is what keeps
 * `instanceof` working after transpilation; removing it silently breaks every catch site.
 *
 * @see ./collectData.ts – the scrape that raises this
 * @see ../../utils/concurrency.ts – the screens that soft-handle it
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

export class ApmUnavailableError extends Error {
  readonly reason = "apm_unavailable" as const;
  readonly url: string | undefined;
  readonly status: number | undefined;

  constructor(message: string, opts?: { url?: string; status?: number }) {
    super(message);
    this.name = "ApmUnavailableError";
    this.url = opts?.url;
    this.status = opts?.status;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** User-facing copy for concurrency pages when APM is unavailable. */
export const APM_UNAVAILABLE_MESSAGE =
  "Could not load concurrency data from NetSuite Application Performance Management (APM) tools " +
  "(Concurrency Monitor). APM may be unavailable in this account — check Customization > Performance.";

/**
 * Type guard for {@link ApmUnavailableError} so concurrency pages can soft-handle APM gaps.
 * @param err - Caught value from an APM scrape/fetch.
 */
export function isApmUnavailableError(err: unknown): err is ApmUnavailableError {
  return err instanceof ApmUnavailableError;
}
