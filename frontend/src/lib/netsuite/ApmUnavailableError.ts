// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Thrown when a NetSuite APM scriptlet is missing or returns a non-JSON failure
 * (HTTP error / HTML Notice). Callers should soft-handle this instead of
 * escalating through {@link handleError}.
 */
export class ApmUnavailableError extends Error {
  readonly reason = 'apm_unavailable' as const;
  readonly url: string | undefined;
  readonly status: number | undefined;

  constructor(message: string, opts?: { url?: string; status?: number }) {
    super(message);
    this.name = 'ApmUnavailableError';
    this.url = opts?.url;
    this.status = opts?.status;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** User-facing copy for concurrency pages when APM is unavailable. */
export const APM_UNAVAILABLE_MESSAGE =
  'Could not load concurrency data from NetSuite Application Performance Management (APM) tools ' +
  '(Concurrency Monitor). APM may be unavailable in this account — check Customization > Performance.';

/**
 * Type guard for {@link ApmUnavailableError} so concurrency pages can soft-handle APM gaps.
 * @param err - Caught value from an APM scrape/fetch.
 */
export function isApmUnavailableError(err: unknown): err is ApmUnavailableError {
  return err instanceof ApmUnavailableError;
}
