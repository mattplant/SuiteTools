// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file loaderUtils.ts
 * @description Shared helpers for React Router loaders.
 */

import { isNotFoundError } from '@suiteworks/suitetools-shared';

/**
 * Map a failed singular-entity fetch into a React Router error.
 *
 * NotFound is rethrown as {@link NotFoundError} so ErrorPage can choose
 * DevSuiteErrorOverlay (devMode) vs a friendly HTTP 404 UI. Converting to
 * `Response` here raced settings load and always hid the overlay in Sandbox.
 *
 * @param err - The error thrown by an adapter.
 * @param resourceLabel - Human-readable resource name for messages/logs (e.g. "User").
 */
export function mapLoaderError(err: unknown, resourceLabel: string): never {
  if (isNotFoundError(err)) {
    throw err;
  }
  console.error(`router: ${resourceLabel} loader failed`, err);
  throw err;
}
