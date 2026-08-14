// SPDX-License-Identifier: GPL-3.0-or-later

import { z } from "zod";
import { zNetSuite } from "../zNetSuite";
import { zHelpers } from "../zodUtils";
import type { ZEntityBundle } from "../zodUtils";
import { orNotFoundSchema, OrNotFound } from "./utils/schemaHelpers";

/**
 * Zod schema for a single SOAP web services status / log entry.
 */
export const SoapLogSchema = z.object({
  id: zNetSuite.numberFromString.schema,
  startDate: zNetSuite.stringOrEmpty.schema,
  duration: zNetSuite.numberFromString.schema,
  integration: zNetSuite.stringOrEmpty.schema,
  integrationId: zNetSuite.numberFromString.schema.optional(),
  action: zNetSuite.stringOrEmpty.schema,
  recordType: zNetSuite.stringOrEmpty.schema,
  user: zNetSuite.stringOrEmpty.schema,
  status: zNetSuite.stringOrEmpty.schema,
  records: zNetSuite.numberFromString.schema,
  recordsFinished: zNetSuite.numberFromString.schema,
  recordsFailed: zNetSuite.numberFromString.schema,
  recordsReturned: zNetSuite.numberFromString.schema,
  request: zNetSuite.stringOrEmpty.schema,
  response: zNetSuite.stringOrEmpty.schema,
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
  if (data.recordType === "&nbsp;") data.recordType = "";

  const integration = data.integration;
  data.integration = integration.replace(/<[^>]*>?/g, "").trim();
  const match = integration.match(/id=(\d+)/);
  if (match) data.integrationId = Number(match[1]);

  const rewrite = (txt: string, flag: "T" | "F") => {
    const m = txt.match(/jobid=([^&"]*)/);
    return m ? `/app/webservices/wslog.nl?req=${flag}&jobid=${m[1]}` : txt;
  };
  data.request = rewrite(data.request, "T");
  data.response = rewrite(data.response, "F");

  return data;
});

const SoapLogBundle = zHelpers.zCreateBundle(SoapLogSchema, {
  meta: { entity: "SoapLog", plural: "SoapLogs" },
  normalize: (data: z.output<typeof SoapLogSchema>) => NormalizedSoapLogSchema.parse(data),
});

export { SoapLogBundle };
export type SoapLog = typeof SoapLogBundle.types.single;
export type SoapLogs = typeof SoapLogBundle.types.array;

export const soapLogOrNotFoundSchema = orNotFoundSchema(SoapLogSchema);
export type SoapLogOrNotFound = OrNotFound<SoapLog>;

export const soapLogsOrNotFoundSchema = orNotFoundSchema(SoapLogBundle.schema.array());
export type SoapLogsOrNotFound = OrNotFound<SoapLogs>;
