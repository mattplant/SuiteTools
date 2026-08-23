// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Shared error handling for React Router loaders.
 *
 * @fileoverview
 * Eleven route loaders funnel their failures through `mapLoaderError`, so every route decides
 * what a failed fetch looks like in one place rather than eleven.
 *
 * @remarks
 * A NotFound is rethrown as `NotFoundError` rather than converted to a `Response`. That is
 * deliberate and was arrived at the hard way: converting here raced the settings load and
 * always suppressed the dev error overlay in Sandbox. `ErrorPage` needs the error instance to
 * choose between the overlay and the friendly 404, so returning a `Response` breaks it.
 *
 * @see ../components/shared/context/DevErrorOverlayContext.tsx – the overlay this preserves
 * @see ../adapters/api/adapterUtils.ts – where singular-fetch misses are thrown
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import type { LoaderFunctionArgs } from "react-router-dom";
import { isNotFoundError, NotFoundError } from "@suiteworks/suitetools-shared";

/**
 * Map a failed singular-entity fetch into a React Router error.
 *
 * NotFound is rethrown as {@link NotFoundError} so ErrorPage can choose
 * DevSuiteErrorOverlay (devMode) vs a friendly HTTP 404 UI. Converting to
 * `Response` here raced settings load and always hid the overlay in Sandbox.
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

type MakeEntityLoaderOptions = {
  /**
   * When true, reject non-finite / ≤0 ids with {@link NotFoundError} before fetch
   * (Job loader — e.g. `/job/undefined` from stale wire keys).
   */
  requirePositiveId?: boolean;
};

/**
 * Creates an id-based singular entity route loader.
 * Always awaits the fetch and returns `{ [key]: T }` for `useLoaderData`.
 * @param key - Result object key matching what the page reads from `useLoaderData`.
 * @param resourceLabel - Label passed to {@link mapLoaderError} / NotFound.
 * @param fetchById - Adapter fetch for a numeric id.
 * @param [options] - Optional id guard.
 */
export function makeEntityLoader<T, K extends string>(
  key: K,
  resourceLabel: string,
  fetchById: (id: number) => Promise<T>,
  options?: MakeEntityLoaderOptions,
): (args: LoaderFunctionArgs) => Promise<{ [P in K]: T }> {
  const requirePositiveId = options?.requirePositiveId === true;

  return async (args: LoaderFunctionArgs) => {
    const rawId = args.params.id;
    const id = Number(rawId);

    if (requirePositiveId && (!Number.isFinite(id) || id <= 0)) {
      throw new NotFoundError(resourceLabel, rawId ?? "");
    }

    try {
      const record = await fetchById(id);
      return { [key]: record } as { [P in K]: T };
    } catch (err) {
      mapLoaderError(err, resourceLabel);
    }
  };
}
