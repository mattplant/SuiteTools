// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file API adapter for option-value dropdown lists.
 * @description
 * Fetches and validates `optionValues` from the SuiteTools RESTlet.
 * Pattern: Schema → Adapter → View
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import {
  makeRequestResponseSchema,
  optionValuesOrNotFoundSchema,
  isNotFound,
  toArray,
} from "@suiteworks/suitetools-shared";
import type { OptionValues } from "@suiteworks/suitetools-shared";
import type { OptionValuesTypes } from "../../components/shared/criteria/types";
import { getData } from "./netSuiteClient";

const optionValuesRequestResponseSchema = makeRequestResponseSchema(optionValuesOrNotFoundSchema);

/**
 * Fetch and validate option values for a criteria dropdown type.
 * Always returns an array (empty if none / NotFound).
 * @param type - Option list type token (e.g. `fileType`, `scriptType`).
 * @throws {ZodError} When the response fails schema validation.
 */
export async function getOptionValues(type: OptionValuesTypes): Promise<OptionValues> {
  const response = await getData("optionValues", { type });
  const parsed = optionValuesRequestResponseSchema.parse(response);

  if (isNotFound(parsed.data)) return [];

  return toArray<OptionValues[number]>(parsed.data);
}
