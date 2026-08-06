// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file API adapter for retrieving multiple Script entities for SuiteTools.
 * @description
 * Fetches and validates an array of Script records based on optional criteria.
 * Pattern: Schema → Adapter → View
 * - Validates via shared `.schema`
 * - Accepts `CriteriaFields` for query parameters
 * - Always returns a `Scripts` array (empty if none found)
 * - Minimal envelope; no paging/meta yet
 * @copyright Matthew Plant
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import { makeRequestResponseSchema, scriptsOrNotFoundSchema, isNotFound, toArray } from '@suiteworks/suitetools-shared';
import type { Scripts } from '@suiteworks/suitetools-shared';
import type { CriteriaFields } from '../../components/shared/criteria/types';
import { getData } from './netSuiteClient';
import { adaptScript } from './script';

const scriptsRequestResponseSchema = makeRequestResponseSchema(scriptsOrNotFoundSchema);

/**
 * Fetch and validate a list of `Script` records using optional criteria.
 * Always returns a `Scripts` array, empty if none found.
 * @param fields - Criteria to filter the scripts list.
 * @returns A Promise resolving to a `Scripts` array (empty if none found).
 * @throws {ZodError} When the response fails schema validation.
 * @throws {Error} When the underlying request fails (network, auth, etc.).
 */
export async function getScripts(fields: CriteriaFields): Promise<Scripts> {
  console.log('[scripts:getScripts] criteria: %o', fields);

  const urlParams = {
    active: fields.active,
    versions: fields.versions,
    scriptTypes: fields.scriptTypes,
    scriptNames: fields.scriptNames,
    owners: fields.owners,
    files: fields.files,
  };

  const response = await getData('scripts', urlParams);
  const parsed = scriptsRequestResponseSchema.parse(response);

  if (isNotFound(parsed.data)) return [];

  return toArray<Scripts[number]>(parsed.data).map(adaptScript);
}
