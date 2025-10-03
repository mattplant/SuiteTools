// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file API adapter for retrieving a single Role entity from SuiteTools.
 * @description
 * Uses the shared singular adapter factory to fetch and validate a Role by ID,
 * enriching the record with navigation URLs. Returns either a Role object or a NotFound payload.
 * Pattern: Schema → Adapter → View
 * - Always validate via shared bundle `.schema`
 * - Transform only on success; propagate `NotFound` untouched
 * @copyright Matthew Plant
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://github.com/mattplant/SuiteTools/blob/main/LICENSE>
 */

import { makeRequestResponseSchema, roleOrNotFoundSchema } from '@suiteworks/suitetools-shared';
import type { Role } from '@suiteworks/suitetools-shared';
import { makeSingularAdapter } from './adapterUtils';

/**
 * Transform a validated `Role` payload into the enriched view model used by the frontend.
 * @param role - The validated Role payload to enrich.
 * @returns The enriched Role object with navigation URLs.
 */
function adaptRole(role: Role): Role {
  return {
    ...role,
    urlNs: `/app/setup/role.nl?id=${role.id}`,
    urlDetail: `#/role/${role.id}`,
  };
}

const roleRequestResponseSchema = makeRequestResponseSchema(roleOrNotFoundSchema);

/**
 * Fetch and validate a single `Role` record by ID.
 * - Uses shared schemas for runtime validation and type inference.
 * - Adds `urlNs` and `urlDetail` to valid `Role` records.
 * @param id - The ID of the role to retrieve.
 * @returns A Promise resolving to a Role object or NotFound payload.
 */
export const getRole = makeSingularAdapter<Role>('role', roleRequestResponseSchema, adaptRole);
