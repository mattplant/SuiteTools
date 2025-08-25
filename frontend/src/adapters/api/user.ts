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

import { makeRequestResponseSchema, userOrNotFoundSchema, isNotFound } from '@suiteworks/suitetools-shared';
import type { User, UserOrNotFound } from '@suiteworks/suitetools-shared';

import { getData } from './netSuiteClient';

const userRequestResponseSchema = makeRequestResponseSchema(userOrNotFoundSchema);

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

/**
 * Handle a NotFound payload.
 * Currently returns the payload untouched, but this is the place to log, instrument, or wrap errors if needed.
 * @param payload - The NotFound payload object.
 * @param payload.message - The error message describing the not found condition.
 * @param payload.code - The error code, always 'NOT_FOUND'.
 * @returns The NotFound payload object unchanged.
 */
function handleNotFound(payload: { message: string; code: 'NOT_FOUND' }): { message: string; code: 'NOT_FOUND' } {
  return payload;
}

/**
 * Fetch and validate a single `User` record by ID.
 * - Uses shared schemas for runtime validation and type inference.
 * - Adds `urlNs` and `urlDetail` to valid `User` records.
 * - Returns a `NotFound` payload unchanged.
 * @param id - The ID of the user to retrieve.
 * @returns A Promise resolving to a User object or NotFound payload.
 */
export async function getUser(id: number): Promise<UserOrNotFound> {
  const response = await getData('user', { id });
  // console.log('[users:getUser] raw data:', JSON.stringify(response, null, 2));

  const parsed = userRequestResponseSchema.parse(response);

  return isNotFound(parsed.data)
    ? handleNotFound(parsed.data) // TS sees: { message: string; code: 'NOT_FOUND' }
    : adaptUser(parsed.data); // TS sees: User
}
