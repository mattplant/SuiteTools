// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file API adapter utilities for SuiteTools.
 * @description
 * Shared helpers for API adapter modules, including:
 * - pickCriteria: safely project whitelisted fields from criteria objects
 * - toEntityArray: normalize array-like values into strongly typed arrays
 *
 * Keep this file focused on adapter-layer concerns only.
 * If utilities grow beyond ~200–300 lines or mix concerns,
 * split into thematic files (e.g. `criteria.ts`, `normalizers.ts`)
 * and re-export from an index barrel.
 */

import { toArray } from '@suiteworks/suitetools-shared';
import type { NotFound } from '@suiteworks/suitetools-shared';

/* -------------------------------------------------------------------------- */
/* pickCriteria                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Pick only the allowed keys from a criteria object.
 * Ensures adapters only forward whitelisted fields to the API.
 * @param fields - The full criteria object.
 * @param keys - The keys to include in the output.
 * @returns A partial object containing only the selected keys.
 * @example
 * const urlParams = pickCriteria(fields, ['active', 'roles'] as const);
 */
export function pickCriteria<T extends object, K extends keyof T>(fields: T, keys: readonly K[]): Partial<T> {
  return keys.reduce((acc, key) => {
    if (!(key in fields)) {
      throw new Error(`Invalid criteria key: ${String(key)}`);
    }
    if (fields[key] !== undefined) {
      acc[key] = fields[key];
    }
    return acc;
  }, {} as Partial<T>);
}

/* -------------------------------------------------------------------------- */
/* toEntityArray                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Generic adapter-facing wrapper around `toArray`.
 * Intended for use *after schema validation* in API adapters.
 * @template T - The entity type (e.g. `Users[number]`).
 * @param res - Raw array-like value or NotFound.
 * @returns A strongly typed array of T.
 */
export function toEntityArray<T>(res: readonly T[] | NotFound): T[] {
  return toArray<T>(res);
}
