import { z } from "zod";
import { zNetSuite } from "./zNetSuite";
import { zHelpers } from "./zodUtils";
import type { BundleOf, BundleArrayOf } from "./zodUtils";
import type {
  ZEntityBundleWithNormalize,
  ZEntityBundleWithoutNormalize,
} from "./zodUtils";

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

/**
 * SoapLog schema transformations:
 * - `recordType`: strips placeholder value "&nbsp;" if present
 * - `integration`: strips HTML tags and trims whitespace
 * - `integrationId`: extracts numeric ID from `integration` string
 * - `request` and `response`: rewrites URLs to point to the correct request/
 */
const NormalizedSoapLogSchema = SoapLogSchema.transform((data) => {
  // recordType - strip placeholder recordType
  if (data.recordType === "&nbsp;") data.recordType = "";

  // integration - strip HTML tags and trim whitespace
  const integration = data.integration;
  data.integration = integration.replace(/<[^>]*>?/g, "").trim();
  // integrationId - extract integrationId from integration string
  const match = integration.match(/id=(\d+)/);
  if (match) data.integrationId = Number(match[1]);

  // rewrite request/response links
  const rewrite = (txt: string, flag: "T" | "F") => {
    const m = txt.match(/jobid=([^&"]*)/);
    return m ? `/app/webservices/wslog.nl?req=${flag}&jobid=${m[1]}` : txt;
  };
  data.request = rewrite(data.request, "T");
  data.response = rewrite(data.response, "F");

  return data;
});

/**
 * Bundled schema + helpers.
 */

// const SoapLogBundle: ZEntityBundleWithNormalize<> = zHelpers.zCreateEntity(
//   SoapLogSchema,
//   {
//     normalize: (data) => ({ ...data, name: data.integration.trim() }),
//   }
// );

const SoapLogBundle: ZEntityBundleWithoutNormalize<
  typeof SoapLogSchema,
  "SoapLog"
> = zHelpers.zCreateEntity(SoapLogSchema, {
  meta: { entity: "SoapLog" },
});

/**
 * Output type of the schema.
 */
type SoapLog = BundleOf<typeof SoapLogBundle>;

/**
 * Output type of the array schema.
 */
type SoapLogs = BundleArrayOf<typeof SoapLogBundle>;

// ───────────────────────────────────────────────────────────
// Public Exports
// ───────────────────────────────────────────────────────────

export type { SoapLog, SoapLogs };
export { SoapLogBundle, zNetSuite };
