// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file API adapter for retrieving multiple ScriptLog entities for SuiteTools.
 * @description
 * Fetches and validates an array of ScriptLog records based on optional criteria.
 * Pattern: Schema → Adapter → View
 * - Validates via shared `.schema`
 * - Accepts `CriteriaFields` for query parameters
 * - Always returns a `ScriptLogs` array (empty if none found)
 * - Minimal envelope; no paging/meta yet
 * @copyright Matthew Plant
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://github.com/mattplant/SuiteTools/blob/main/LICENSE>
 */

import {
  makeRequestResponseSchema,
  scriptLogsOrNotFoundSchema,
  isNotFound,
  toArray,
} from '@suiteworks/suitetools-shared';
import type { ScriptLogs } from '@suiteworks/suitetools-shared';
import type { CriteriaFields } from '../../components/shared/criteria/types';
import { getData } from './netSuiteClient';

const scriptLogsRequestResponseSchema = makeRequestResponseSchema(scriptLogsOrNotFoundSchema);

/**
 * Fetch and validate a list of `ScriptLog` records using optional criteria.
 * Always returns a `ScriptLogs` array, empty if none found.
 * @param fields - Criteria to filter the script logs list.
 * @returns A Promise resolving to a `ScriptLogs` array (empty if none found).
 * @throws {ZodError} When the response fails schema validation.
 * @throws {Error} When the underlying request fails (network, auth, etc.).
 */
export async function getScriptLogs(fields: CriteriaFields): Promise<ScriptLogs> {
  console.log('[scriptLogs:getScriptLogs] criteria: %o', fields);

  const urlParams = {
    rows: fields.rows,
    levels: fields.levels,
    scripttypes: fields.scripttypes,
    scriptnames: fields.scriptnames,
    owners: fields.owners,
    createddate: fields.createddate,
    title: fields.title,
    detail: fields.detail,
    timemode: fields.timemode,
    customdatetime: fields.customdatetime ? fields.customdatetime : undefined,
    customduration: fields.customduration ? fields.customduration : undefined,
  };

  const response = await getData('scriptLogs', urlParams);
  const parsed = scriptLogsRequestResponseSchema.parse(response);

  if (isNotFound(parsed.data)) return [];

  return toArray<ScriptLogs[number]>(parsed.data);
}
