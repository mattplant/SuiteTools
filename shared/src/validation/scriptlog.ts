import { z } from "zod";
import { createSchemaHelpers } from "./helpers";

/**
 * Zod schema for a single script log entry.
 *
 * Fields:
 * - `id`: unique numeric identifier
 * - `timestamp`: ISO8601 string (validated via `Date.parse`)
 * - `type`: arbitrary string (consider swapping for an `enum`)
 * - `scripttype`: string category
 * - `owner`: name of the script owner
 * - `scriptname`: script identifier
 * - `title`: human-readable title
 * - `detail`: detailed message or payload
 * - `urlNs`, `urlDetail` (optional): additional context properties
 */
export const ScriptLogSchema = z.object({
  id: z.number(),
  timestamp: z.string().refine((s) => !Number.isNaN(Date.parse(s)), {
    message: "Invalid ISO timestamp",
  }),
  type: z.string(),
  scripttype: z.string(),
  owner: z.string(),
  scriptname: z.string(),
  title: z.string(),
  detail: z.string(),
  urlNs: z.string().optional(),
  urlDetail: z.string().optional(),
});

export type ScriptLog = z.infer<typeof ScriptLogSchema>;

/**
 * Helpers bound to the single‐entry schema:
 * - `assert`: assertion‐style (throws if invalid)
 * - `parse`: return‐value style (throws if invalid)
 * - `safeParse`: non‐throwing, returns success flag + data/error
 */
const singleHelpers = createSchemaHelpers(ScriptLogSchema);

/**
 * Asserts that `input` is a valid `ScriptLog`.
 * Narrows `input` to `ScriptLog` on success.
 *
 * @param input - value to validate
 * @throws `ZodError` when validation fails
 */
export const assertValidScriptLog: typeof singleHelpers.assert =
  singleHelpers.assert;

/**
 * Parses `input` into a `ScriptLog`.
 *
 * @param input - value to parse
 * @returns the validated `ScriptLog`
 * @throws `ZodError` when parsing fails
 */
export const parseScriptLog: typeof singleHelpers.parse = singleHelpers.parse;

/**
 * Safely parses `input` into a `ScriptLog`.
 *
 * @param input - value to parse
 * @returns `{ success: true; data: ScriptLog }` or `{ success: false; error: ZodError }`
 */
export const safeParseScriptLog: typeof singleHelpers.safeParse =
  singleHelpers.safeParse;

/**
 * Helpers bound to the array‐of‐entries schema:
 * - `assert`: assertion‐style (throws if invalid)
 * - `parse`: return‐value style (throws if invalid)
 * - `safeParse`: non‐throwing, returns success flag + data/error
 */
const arrayHelpers = createSchemaHelpers(ScriptLogSchema.array());

/**
 * Asserts that `input` is a valid `ScriptLog[]`.
 * Narrows `input` to `ScriptLog[]` on success.
 *
 * @param input - value to validate
 * @throws `ZodError` when validation fails
 */
export const assertValidScriptLogs: typeof arrayHelpers.assert =
  arrayHelpers.assert;

/**
 * Parses `input` into a `ScriptLog[]`.
 *
 * @param input - value to parse
 * @returns the validated `ScriptLog[]`
 * @throws `ZodError` when parsing fails
 */
export const parseScriptLogs: typeof arrayHelpers.parse = arrayHelpers.parse;

/**
 * Safely parses `input` into a `ScriptLog[]`.
 *
 * @param input - value to parse
 * @returns `{ success: true; data: ScriptLog[] }` or `{ success: false; error: ZodError }`
 */
export const safeParseScriptLogs: typeof arrayHelpers.safeParse =
  arrayHelpers.safeParse;

// TODO: Consider adding a function to parse with error details
// that returns an object with valid logs, error count, and details
// /**
//  * Parses an array of potential `ScriptLog` entries.
//  * @param data - the value to parse (expected to be an array)
//  * @returns object containing valid logs, error count, and error details
//  */
// export function parseScriptLogsWithErrors(data: unknown): {
//   validLogs: ScriptLog[];
//   errorCount: number;
//   errorDetails: string[];
// } {
//   if (!Array.isArray(data)) {
//     throw new Error("Expected an array of ScriptLogs");
//   }

//   const results = data.map((item, idx) => {
//     const result = ScriptLogSchema.safeParse(item);
//     return result.success
//       ? { success: true, data: result.data }
//       : { success: false, error: `Index ${idx}: ${result.error.message}` };
//   });

//   const validLogs = results
//     .filter((r): r is { success: true; data: ScriptLog } => r.success)
//     .map((r) => r.data);

//   const errorDetails = results
//     .filter((r) => !r.success)
//     .map((r) => r.error as string);

//   return {
//     validLogs,
//     errorCount: errorDetails.length,
//     errorDetails,
//   };
// }
