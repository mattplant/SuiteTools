// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file API adapter for retrieving a single ScriptLog entity from SuiteTools.
 * @description
 * Fetches and validates a single ScriptLog record by ID, returning either a fully typed ScriptLog object or a NotFound payload.
 * Pattern: Schema → Adapter → View
 * - Always validate via shared bundle `.schema`
 * - Transform only on success; propagate `NotFound` untouched
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://github.com/mattplant/SuiteTools/blob/main/LICENSE>
 */

import { makeRequestResponseSchema, scriptLogOrNotFoundSchema } from '@suiteworks/suitetools-shared';
import type { ScriptLog } from '@suiteworks/suitetools-shared';
import { makeSingularAdapter } from './adapterUtils';

/**
 * Transform a validated `ScriptLog` payload into the enriched view model used by the frontend.
 * @param scriptLog - The validated ScriptLog payload to enrich.
 * @returns The enriched ScriptLog object with navigation URLs.
 */
function adaptScriptLog(scriptLog: ScriptLog): ScriptLog {
  return {
    ...scriptLog,
    urlNs: `/app/common/scripting/scriptnote.nl?id=${scriptLog.id}`,
    urlDetail: `#/scriptLog/${scriptLog.id}`,
  };
}

const scriptLogRequestResponseSchema = makeRequestResponseSchema(scriptLogOrNotFoundSchema);

/**
 * Fetch and validate a single `ScriptLog` record by ID.
 * - Uses shared schemas for runtime validation and type inference.
 * - Adds `urlNs` and `urlDetail` to valid `ScriptLog` records.
 * @param id - The ID of the script log to retrieve.
 * @returns A Promise resolving to a ScriptLog object or NotFound payload.
 */
export const getScriptLog = makeSingularAdapter<ScriptLog>('scriptLog', scriptLogRequestResponseSchema, adaptScriptLog);
