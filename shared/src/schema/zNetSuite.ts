// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * SuiteTools Zod Schema Helpers — centralized utilities for normalizing and validating common NetSuite field formats.
 *
 * @fileoverview
 * Provides a single source of truth for coercing raw NetSuite values into well-typed JS values using `z.preprocess`.
 *
 * ## Included Helpers
 * - booleanFromTF: `"T"` → true; all else → false
 * - dateFromString: ISO string or Date → Date object
 * - numberFromString: number-like string or number → number
 * - stringOrEmpty: any non-string value → empty string
 *
 * Each helper is bundled with parse/assert utilities from `zHelpers` for convenient, type-safe usage across the codebase.
 *
 * @module zNetSuite
 * @see Zod documentation https://github.com/colinhacks/zod
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://github.com/mattplant/SuiteTools/blob/main/LICENSE>
 */

import { z } from "zod";
import { zHelpers } from "./zodUtils";

// Preprocessing Schemas

/**
 * Converts NetSuite "T"/"F" string flags to booleans.
 * - "T" → true
 * - "F", "", undefined, or anything else → false
 */
const zBooleanFromTF = z.preprocess((val) => val === "T", z.boolean());

/**
 * Converts ISO date string or Date to Date object
 */
const zDateFromString = z.preprocess((val) => {
  if (typeof val === "string") {
    const date = new Date(val);
    return isNaN(date.getTime()) ? undefined : date;
  }
  return val;
}, z.date());

/**
 * Converts number-like string or number to number
 */
const zNumberFromString = z.preprocess(
  (val) => (typeof val === "string" ? Number(val) : val),
  z.number()
);

/**
 * Coerces any non-string (null, undefined, number, etc.) to an empty string.
 * Useful for NetSuite fields with inconsistent optional behavior.
 */
const zStringOrEmpty = z.preprocess(
  (val) => (typeof val === "string" ? val : ""),
  z.string()
);

// Semantic Namespaces

/**
 * Bundled schema helpers for NetSuite-specific field formats.
 */
const zNetSuite = {
  booleanFromTF: {
    schema: zBooleanFromTF,
    ...zHelpers.zParseHelpers(zBooleanFromTF),
  },
  dateFromString: {
    schema: zDateFromString,
    ...zHelpers.zParseHelpers(zDateFromString),
  },
  numberFromString: {
    schema: zNumberFromString,
    ...zHelpers.zParseHelpers(zNumberFromString),
  },
  stringOrEmpty: {
    schema: zStringOrEmpty,
    ...zHelpers.zParseHelpers(zStringOrEmpty),
  },
  zCreateBundle: zHelpers.zCreateBundle,
};

// --- Public Exports ---

export { zNetSuite };
