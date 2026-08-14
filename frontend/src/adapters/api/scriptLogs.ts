// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file API adapter for retrieving multiple ScriptLog entities for SuiteTools.
 * @description
 * Fetches and validates an array of ScriptLog records based on optional criteria.
 * Pattern: Schema → Adapter → View
 * @copyright Matthew Plant
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import { makeRequestResponseSchema, scriptLogsOrNotFoundSchema } from "@suiteworks/suitetools-shared";
import type { ScriptLogs } from "@suiteworks/suitetools-shared";
import type { CriteriaFields } from "../../components/shared/criteria/types";
import { makeListAdapter } from "./adapterUtils";

const scriptLogsRequestResponseSchema = makeRequestResponseSchema(scriptLogsOrNotFoundSchema);

/**
 * Fetch and validate a list of `ScriptLog` records using optional criteria.
 * Always returns a `ScriptLogs` array, empty if none found.
 */
export const getScriptLogs = makeListAdapter<
  ScriptLogs[number],
  CriteriaFields,
  | "rows"
  | "levels"
  | "scriptTypes"
  | "scriptNames"
  | "owners"
  | "dateCreated"
  | "title"
  | "detail"
  | "timeMode"
  | "customDateTime"
  | "customDuration"
>("scriptLogs", scriptLogsRequestResponseSchema, [
  "rows",
  "levels",
  "scriptTypes",
  "scriptNames",
  "owners",
  "dateCreated",
  "title",
  "detail",
  "timeMode",
  "customDateTime",
  "customDuration",
] as const);
