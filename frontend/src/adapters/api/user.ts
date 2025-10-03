// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file API adapter for retrieving a single User entity from SuiteTools.
 * @description
 * Fetches and validates a single User record by ID, returning either a fully typed User object or a NotFound payload.
 * Pattern: Schema → Adapter → View
 * - Always validate via shared bundle `.schema`
 * - Transform only on success; propagate `NotFound` untouched
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://github.com/mattplant/SuiteTools/blob/main/LICENSE>
 */

import { makeRequestResponseSchema, userOrNotFoundSchema } from '@suiteworks/suitetools-shared';
import type { User } from '@suiteworks/suitetools-shared';
import { makeSingularAdapter } from './adapterUtils';

/**
 * Transform a validated `User` payload into the enriched view model used by the frontend.
 * @param user - The validated User payload to enrich.
 * @returns The enriched User object with navigation URLs.
 */
function adaptUser(user: User): User {
  return {
    ...user,
    urlNs: `/app/common/entity/employee.nl?id=${user.id}`,
    urlDetail: `#/user/${user.id}`,
  };
}

const userRequestResponseSchema = makeRequestResponseSchema(userOrNotFoundSchema);

/**
 * Fetch and validate a single `User` record by ID.
 * - Uses shared schemas for runtime validation and type inference.
 * - Adds `urlNs` and `urlDetail` to valid `User` records.
 * @param id - The ID of the user to retrieve.
 * @returns A Promise resolving to a User object or NotFound payload.
 */
export const getUser = makeSingularAdapter<User>('user', userRequestResponseSchema, adaptUser);
