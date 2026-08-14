// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file API adapter for retrieving multiple File entities for SuiteTools.
 * @description
 * Fetches and validates an array of File records based on optional criteria.
 * Pattern: Schema → Adapter → View
 * @copyright Matthew Plant
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import { makeRequestResponseSchema, filesOrNotFoundSchema } from "@suiteworks/suitetools-shared";
import type { Files } from "@suiteworks/suitetools-shared";
import type { CriteriaFields } from "../../components/shared/criteria/types";
import { makeListAdapter } from "./adapterUtils";

const filesRequestResponseSchema = makeRequestResponseSchema(filesOrNotFoundSchema);

/**
 * Fetch and validate a list of `File` records using optional criteria.
 * Always returns a `Files` array, empty if none found.
 */
export const getFiles = makeListAdapter<
  Files[number],
  CriteriaFields,
  "rows" | "fileTypes" | "dateCreated" | "lastModifiedDate"
>("files", filesRequestResponseSchema, ["rows", "fileTypes", "dateCreated", "lastModifiedDate"] as const);
