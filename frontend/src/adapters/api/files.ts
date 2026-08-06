// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file API adapter for retrieving multiple File entities for SuiteTools.
 * @description
 * Fetches and validates an array of File records based on optional criteria.
 * Pattern: Schema → Adapter → View
 * - Validates via shared `.schema`
 * - Accepts `CriteriaFields` for query parameters
 * - Always returns a `Files` array (empty if none found)
 * - Minimal envelope; no paging/meta yet
 * @copyright Matthew Plant
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import { makeRequestResponseSchema, filesOrNotFoundSchema, isNotFound, toArray } from '@suiteworks/suitetools-shared';
import type { Files } from '@suiteworks/suitetools-shared';
import type { CriteriaFields } from '../../components/shared/criteria/types';
import { getData } from './netSuiteClient';

const filesRequestResponseSchema = makeRequestResponseSchema(filesOrNotFoundSchema);

/**
 * Fetch and validate a list of `File` records using optional criteria.
 * Always returns a `Files` array, empty if none found.
 * @param fields - Criteria to filter the files list (rows, fileTypes, dates, etc.).
 * @returns A Promise resolving to a `Files` array (empty if none found).
 * @throws {ZodError} When the response fails schema validation.
 * @throws {Error} When the underlying request fails (network, auth, etc.).
 */
export async function getFiles(fields: CriteriaFields): Promise<Files> {
  console.log('[files:getFiles] criteria: %o', fields);

  const urlParams = {
    rows: fields.rows,
    fileTypes: fields.fileTypes,
    dateCreated: fields.dateCreated,
    lastModifiedDate: fields.lastModifiedDate,
  };

  const response = await getData('files', urlParams);
  const parsed = filesRequestResponseSchema.parse(response);

  if (isNotFound(parsed.data)) return [];

  return toArray<Files[number]>(parsed.data);
}
