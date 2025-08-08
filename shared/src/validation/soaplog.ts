import { z } from "zod";
import { createSchemaHelpers, createZodDate } from "./helpers";

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
export const BaseSoapLog = z.object({
  id: z.number(),

  startDate: z.string().refine((s) => !Number.isNaN(Date.parse(s)), {
    message: "Invalid ISO timestamp",
  }),
  // TODO: change over to date with "startDate: createZodDate(),""

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

const CleanedSoapLog = BaseSoapLog.transform((data) => {
  // recordType - strip placeholder recordType
  if (data.recordType === "&nbsp;") data.recordType = "";

  // integration - strip HTML tags and trim whitespace
  const integration = data.integration;
  data.integration = integration.replace(/<[^>]*>?/g, "").trim();
  // integrationId - extract integrationId from integration string
  const match = integration.match(/id=(\d+)/);
  if (match) data.integrationId = Number(match[1]);
  // strip HTML and extract integrationId
  // const raw = data.integration;
  // const match = raw.match(/id=(\d+)/);
  // if (match) data.integrationId = Number(match[1]);
  // data.integration = raw.replace(/<[^>]*>?/g, "").trim();

  // rewrite request/response links
  const rewrite = (txt: string, flag: "T" | "F") => {
    const m = txt.match(/jobid=([^&"]*)/);
    return m ? `/app/webservices/wslog.nl?req=${flag}&jobid=${m[1]}` : txt;
  };
  data.request = rewrite(data.request, "T");
  data.response = rewrite(data.response, "F");

  return data;
});

export type SoapLog = z.infer<typeof BaseSoapLog>;

/**
 * Helpers bound to the single‐entry SOAP schema:
 * - `assert`: throws if invalid (narrows `input` to `SoapLog`)
 * - `parse`: returns `SoapLog` or throws
 * - `safeParse`: returns `{ success; data?; error? }` without throwing
 */
const singleHelpers = createSchemaHelpers(CleanedSoapLog);

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
const arrayHelpers = createSchemaHelpers(CleanedSoapLog.array());

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
