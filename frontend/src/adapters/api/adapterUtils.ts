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

import { handleError, isNotFound, NotFoundError, toArray } from '@suiteworks/suitetools-shared';
import type { BaseSchema, NotFound, SingularEntityName } from '@suiteworks/suitetools-shared';
import { getData } from './netSuiteClient';

/* -------------------------------------------------------------------------- */
/* handleNotFound                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Normalize and rethrow a NotFoundError through handleError.
 *
 * Ensures the error follows the full lifecycle:
 * normalize → log → (dev) surface → rethrow.
 * @param resource - The name of the resource that was not found.
 * @param id - The identifier of the resource that was not found.
 */
export function handleNotFound(resource: string, id: string | number): never {
  throw handleError(new NotFoundError(resource, id));
}

/* -------------------------------------------------------------------------- */
/* makeSingularAdapter                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Creates a singular entity adapter for fetching and adapting a single record.
 * @template TEntity - The entity name type.
 * @template TType - The entity data type.
 * @param entity - The singular entity name.
 * @param schema - The Zod schema for validation.
 * @param adapt - Function to adapt the validated record.
 * @returns An async function to fetch and adapt a single entity by ID.
 */
export function makeSingularAdapter<TEntity>(
  entity: SingularEntityName,
  schema: BaseSchema<TEntity | { message: string; code: 'NOT_FOUND' }>,
  adapt: (record: TEntity) => TEntity,
) {
  return async (id: number): Promise<TEntity> => {
    if (id === 0) {
      // invalid ID
      return handleNotFound(entity, id);
    }
    const response = await getData(entity, { id });
    const parsed = schema.parse(response);

    if (isNotFound(parsed.data)) {
      // Governance‑aligned: throw a SuiteError subclass
      return handleNotFound(entity, id);
    }

    return adapt(parsed.data as TEntity);
  };
}

/* -------------------------------------------------------------------------- */
/* pickCriteria                                                               */
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
/* toEntityArray                                                              */
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
