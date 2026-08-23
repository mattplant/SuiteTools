// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * The factory every entity adapter in this directory is built from.
 *
 * @fileoverview
 * Nineteen of the 34 adapters here are a few lines of configuration over `makeSingularAdapter`
 * or `makeListAdapter`. Those two encode the fetch → validate → adapt pipeline once: call the
 * RESTlet, parse the envelope with a Zod schema, narrow away `NotFound`, then map rows through
 * an adapt function. `pickCriteria` and `toEntityArray` are the supporting pieces.
 *
 * @remarks
 * The two factories differ deliberately on absence. A singular miss throws through
 * `handleNotFound`, because a detail view has nothing to render; a list miss returns `[]`,
 * because an empty grid is a valid result. Do not "fix" that asymmetry.
 *
 * `pickCriteria` is a whitelist, not a filter — only the keys an adapter names reach the API,
 * so a new criteria field is invisible until it is added to that list. `makeSingularAdapter`
 * rejects ids that are 0, NaN or non-finite up front, which is what keeps `id = NaN` out of
 * SuiteQL.
 *
 * @see ./netSuiteClient.ts – the HTTP call these wrap
 * @see ./tokens.ts – a representative list adapter, including client-side filtering
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import { handleError, isNotFound, NotFoundError, toArray } from "@suiteworks/suitetools-shared";
import type { BaseSchema, EndpointName, NotFound, SingularEntityName } from "@suiteworks/suitetools-shared";
import { getData } from "./netSuiteClient";

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
  schema: BaseSchema<TEntity | { message: string; code: "NOT_FOUND" }>,
  adapt: (record: TEntity) => TEntity,
) {
  return async (id: number): Promise<TEntity> => {
    // Reject 0 / NaN / non-finite so SuiteQL never sees `id = NaN`.
    if (!Number.isFinite(id) || id <= 0) {
      return handleNotFound(entity, id);
    }
    const response = await getData(entity, { id });

    // Nullish data is treated as miss; empty `{}` is not (must be canonical NotFound).
    if (response.data == null) {
      return handleNotFound(entity, id);
    }

    const parsed = schema.parse(response);

    if (isNotFound(parsed.data)) {
      return handleNotFound(entity, id);
    }

    return adapt(parsed.data as TEntity);
  };
}

/* -------------------------------------------------------------------------- */
/* makeListAdapter                                                             */
/* -------------------------------------------------------------------------- */

type MakeListAdapterOptions<TItem, TCriteria extends object> = {
  /** Enrich each validated row (e.g. add `urlNs` / `urlDetail`). */
  adaptItem?: (item: TItem) => TItem;
  /**
   * Optional transform after {@link pickCriteria} (e.g. join multi-selects).
   * Default: forward the picked object as query params.
   */
  mapParams?: (picked: Partial<TCriteria>) => Record<string, unknown>;
};

/**
 * Creates a list entity adapter for fetching and adapting records by criteria.
 * Always returns an array (empty on NotFound / nullish / non-array data).
 * @template TItem - Element type of the list.
 * @template TCriteria - Criteria object type (e.g. `CriteriaFields`).
 * @template K - Whitelisted criteria keys forwarded to the API.
 * @param endpoint - Plural (or list) endpoint name for {@link getData}.
 * @param schema - Request/response envelope schema (`makeRequestResponseSchema` + list-or-NotFound).
 * @param criteriaKeys - Keys projected via {@link pickCriteria}.
 * @param [options] - Optional per-item adapt and param mapping.
 * @returns An async function `(fields) => TItem[]`.
 */
export function makeListAdapter<TItem, TCriteria extends object, K extends keyof TCriteria>(
  endpoint: EndpointName,
  schema: BaseSchema<TItem[] | NotFound>,
  criteriaKeys: readonly K[],
  options?: MakeListAdapterOptions<TItem, TCriteria>,
): (fields: TCriteria) => Promise<TItem[]> {
  return async (fields: TCriteria): Promise<TItem[]> => {
    const picked = pickCriteria(fields, criteriaKeys);
    const urlParams = options?.mapParams ? options.mapParams(picked) : (picked as Record<string, unknown>);
    const response = await getData(endpoint, urlParams);
    const parsed = schema.parse(response);

    if (parsed.data == null || isNotFound(parsed.data)) {
      return [];
    }

    const rows = toEntityArray<TItem>(parsed.data);
    return options?.adaptItem ? rows.map(options.adaptItem) : rows;
  };
}

/* -------------------------------------------------------------------------- */
/* pickCriteria                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Pick only the allowed keys from a criteria object.
 * Ensures adapters only forward whitelisted fields to the API.
 * Missing / undefined keys are skipped (form submit often returns a partial object vs page defaults).
 * @param fields - The full criteria object.
 * @param keys - The keys to include in the output.
 * @returns A partial object containing only the selected keys that are defined.
 * @example
 * const urlParams = pickCriteria(fields, ['active', 'roles'] as const);
 */
export function pickCriteria<T extends object, K extends keyof T>(fields: T, keys: readonly K[]): Partial<T> {
  const out: Partial<T> = {};
  for (const key of keys) {
    if (fields[key] !== undefined) {
      out[key] = fields[key];
    }
  }
  return out;
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
