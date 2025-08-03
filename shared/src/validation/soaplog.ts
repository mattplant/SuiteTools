import { z } from "zod";
import { createSchemaHelpers } from "./helpers";

/**
 * Zod schema for a single SOAP log entry.
 *
 * Fields:
 * - `id`: unique numeric identifier
 * - `startDate`: ISO8601 string (validated via `Date.parse`)
 * - `duration`: duration in milliseconds
 * - `integration`: name of the integration
 * - `integrationId` (optional): numeric integration identifier
 * - `action`: action performed
 * - `recordType`: type or category of the record
 * - `user`: user who initiated the action
 * - `status`: resulting status string
 * - `records`: total number of records processed
 * - `recordsFinished`: count of successfully processed records
 * - `recordsFailed`: count of records that failed
 * - `recordsReturned`: count of records returned
 * - `request`: raw request payload
 * - `response`: raw response payload
 * - `urlDetail` (optional): additional context URL
 */
export const SoapLogSchema = z.object({
  id: z.number(),
  startDate: z.string().refine((s) => !Number.isNaN(Date.parse(s)), {
    message: "Invalid ISO timestamp",
  }),
  duration: z.number(),
  integration: z.string(),
  integrationId: z.number().optional(),
  action: z.string(),
  recordType: z.string(),
  user: z.string(),
  status: z.string(),
  records: z.number(),
  recordsFinished: z.number(),
  recordsFailed: z.number(),
  recordsReturned: z.number(),
  request: z.string(),
  response: z.string(),
  urlDetail: z.string().optional(),
});

export type SoapLog = z.infer<typeof SoapLogSchema>;

/**
 * Helpers bound to the single‐entry SOAP schema:
 * - `assert`: throws if invalid (narrows `input` to `SoapLog`)
 * - `parse`: returns `SoapLog` or throws
 * - `safeParse`: returns `{ success; data?; error? }` without throwing
 */
const singleHelpers = createSchemaHelpers(SoapLogSchema);

/**
 * Asserts that `input` is a valid `SoapLog`.
 * Narrows `input` to `SoapLog` on success.
 *
 * @param input - value to validate
 * @throws `ZodError` when validation fails
 */
export const assertValidSoapLog: typeof singleHelpers.assert =
  singleHelpers.assert;

/**
 * Parses `input` into a `SoapLog`.
 *
 * @param input - value to parse
 * @returns The validated `SoapLog`
 * @throws `ZodError` when parsing fails
 */
export const parseSoapLog: typeof singleHelpers.parse = singleHelpers.parse;

/**
 * Safely parses `input` into a `SoapLog`.
 *
 * @param input - value to parse
 * @returns `{ success: true; data: SoapLog }` or `{ success: false; error: ZodError }`
 */
export const safeParseSoapLog: typeof singleHelpers.safeParse =
  singleHelpers.safeParse;

/**
 * Helpers bound to the array‐of‐entries SOAP schema:
 * - `assert`: throws if invalid (narrows `input` to `SoapLog[]`)
 * - `parse`: returns `SoapLog[]` or throws
 * - `safeParse`: returns `{ success; data?; error? }[]` without throwing
 */
const arrayHelpers = createSchemaHelpers(SoapLogSchema.array());

/**
 * Asserts that `input` is a valid `SoapLog[]`.
 * Narrows `input` to `SoapLog[]` on success.
 *
 * @param input - value to validate
 * @throws `ZodError` when validation fails
 */
export const assertValidSoapLogs: typeof arrayHelpers.assert =
  arrayHelpers.assert;

/**
 * Parses `input` into a `SoapLog[]`.
 *
 * @param input - value to parse
 * @returns The validated `SoapLog[]`
 * @throws `ZodError` when parsing fails
 */
export const parseSoapLogs: typeof arrayHelpers.parse = arrayHelpers.parse;

/**
 * Safely parses `input` into a `SoapLog[]`.
 *
 * @param input - value to parse
 * @returns `{ success: true; data: SoapLog[] }` or `{ success: false; error: ZodError }`
 */
export const safeParseSoapLogs: typeof arrayHelpers.safeParse =
  arrayHelpers.safeParse;

/**
 * Cleans soap log data
 * @param data
 * @returns clean soap log data
 */
export function cleanSoapLogData(data: SoapLog): SoapLog {
  // clear recordType field if blank
  if (data.recordType === "&nbsp;") {
    data.recordType = "";
  }
  if (data.integration) {
    const matchResult = data.integration.match(/id=(\d+)/);
    if (matchResult) {
      data.integrationId = Number(matchResult[1]);
    }
    data.integration = data.integration.replace(/<[^>]*>?/gm, "").trim();
  }
  if (data.request) {
    const matchResult = data.request.match(/jobid=([^&"]*)/);
    if (matchResult) {
      data.request = `/app/webservices/wslog.nl?req=T&jobid=${matchResult[1]}`;
    }
  }
  if (data.response) {
    const matchResult = data.response.match(/jobid=([^&"]*)/);
    if (matchResult) {
      data.response = `/app/webservices/wslog.nl?req=F&jobid=${matchResult[1]}`;
    }
  }

  return data;
}

/**
 * Cleans soap logs data
 * @param data
 * @returns clean soap logs data
 */
export function cleanSoapLogsData(data: SoapLog[]): SoapLog[] {
  console.log("cleanSoapLogsData() initiated", { data });
  if (data) {
    data.forEach((record) => {
      cleanSoapLogData(record);
    });
  }

  return data;
}
