import { z } from "zod";
import { zHelpers } from "./zodUtils";

// --- Preprocessing Schemas ---

/**
 * Converts NetSuite "T"/"F" string flags to booleans.
 * - "T" → true
 * - "F", "", undefined, or anything else → false
 */
const zBooleanFromTF = z.preprocess((val) => val === "T", z.boolean());

/**
 * Converts ISO date string or Date to Date object
 */
const zDateFromString = z.preprocess(
  (val) => (typeof val === "string" ? new Date(val) : val),
  z.date()
);

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

// --- Semantic Namespaces ---

/**
 * Bundled schema helpers for NetSuite-specific field formats.
 */
const zNetSuite = {
  // raw: {
  //   /** Converts "T"/"F" strings into booleans. */
  //   booleanFromTF: zBooleanFromTF,
  //   /** Parses ISO date strings or Date objects into Date instances. */
  //   dateFromString: zDateFromString,
  //   /** Coerces number-like strings and numbers into numeric types. */
  //   numberFromString: zNumberFromString,
  //   /** Converts any non-string value (null, undefined, number) to an empty string. */
  //   stringOrEmpty: zStringOrEmpty,
  // },
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
  createBundle: zHelpers.zCreateBundle, // TODO: remove after verifying zCreateEntity works
};

// --- Public Exports ---

export { zNetSuite };
