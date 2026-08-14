// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file loaderUtils.ts
 * @description Shared helpers for React Router loaders.
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
