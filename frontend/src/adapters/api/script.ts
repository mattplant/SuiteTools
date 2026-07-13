// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file API adapter for retrieving a single Script entity from SuiteTools.
 * @description
 * Fetches and validates a single Script record by ID, returning either a fully typed Script object or throwing NotFound.
 * Pattern: Schema → Adapter → View
 * - Always validate via shared bundle `.schema`
 * - Transform only on success; propagate `NotFound` via SuiteError
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://github.com/mattplant/SuiteTools/blob/main/LICENSE>
 */

import { makeRequestResponseSchema, scriptOrNotFoundSchema } from '@suiteworks/suitetools-shared';
import type { Script } from '@suiteworks/suitetools-shared';
import { makeSingularAdapter } from './adapterUtils';

/**
 * Transform a validated `Script` payload into the enriched view model used by the frontend.
 * @param script - The validated Script payload to enrich.
 * @returns The enriched Script object with navigation URLs.
 */
export function adaptScript(script: Script): Script {
  return {
    ...script,
    urlNs: `/app/common/scripting/script.nl?id=${script.id}`,
    urlDetail: `#/script/${script.id}`,
    urlScriptLogs: `#/scriptLogs/${script.id}`,
  };
}

const scriptRequestResponseSchema = makeRequestResponseSchema(scriptOrNotFoundSchema);

/**
 * Fetch and validate a single `Script` record by ID.
 * - Uses shared schemas for runtime validation and type inference.
 * - Adds `urlNs`, `urlDetail`, and `urlScriptLogs` to valid `Script` records.
 * @param id - The ID of the script to retrieve.
 * @returns A Promise resolving to a Script object.
 */
export const getScript = makeSingularAdapter<Script>('script', scriptRequestResponseSchema, adaptScript);

/**
 * Resolve a Script for the Scripts list modal.
 * Prefer the already-loaded grid row (includes navigation URLs) so actions like
 * "View Script Logs" work even when the singular `script` endpoint returns empty/`{}`.
 * @param id - Script internal id.
 * @param lines - Optional rows from the current Scripts results grid.
 * @returns Enriched Script for the modal.
 */
export async function getScriptModalData(id: number, lines?: readonly unknown[]): Promise<Script> {
  if (lines?.length) {
    const match = lines.find((line) => {
      if (!line || typeof line !== 'object' || !('id' in line)) return false;
      return Number((line as Script).id) === id;
    }) as Script | undefined;
    if (match) {
      return adaptScript(match);
    }
  }
  return getScript(id);
}
