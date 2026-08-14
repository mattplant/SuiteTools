import { z } from "zod";
import { zNetSuite } from "../zNetSuite";
import { zHelpers } from "../zodUtils";
import type { ZEntityBundle } from "../zodUtils";
import { orNotFoundSchema, type OrNotFound } from "./utils/schemaHelpers";

/**
 * Zod schema for a single Integration record.
 *
 * Fields:
 * - `id`: number
 * - `name`: string
 * - `applicationId`: string
 * - `state`: string
 * - `dateCreated`: string (ISO date format)
 * - `lastLogin`: string (optional, ISO date format)
 * - `urlNs`: string (optional)
 * - `urlDetail`: string (optional)
 */
export const IntegrationSchema = z.object({
  id: zNetSuite.numberFromString.schema,
  name: z.string(),
  applicationId: zNetSuite.stringOrEmpty.schema,
  state: zNetSuite.stringOrEmpty.schema,
  dateCreated: zNetSuite.stringOrEmpty.schema,
  lastLogin: z.string().optional(),
  // additional properties
  urlNs: z.string().optional(),
  urlDetail: z.string().optional(),
});

const IntegrationBundle: ZEntityBundle<typeof IntegrationSchema, "Integration"> = zHelpers.zCreateBundle(
  IntegrationSchema,
  { meta: { entity: "Integration", plural: "Integrations" } },
);

// ───────────────────────────────────────────────────────────
// Public Exports
// ───────────────────────────────────────────────────────────

export { IntegrationBundle };
export type Integration = typeof IntegrationBundle.types.single;
export type Integrations = typeof IntegrationBundle.types.array;

export const integrationOrNotFoundSchema = orNotFoundSchema(IntegrationSchema);
export type IntegrationOrNotFound = OrNotFound<Integration>;

export const integrationsOrNotFoundSchema = orNotFoundSchema(IntegrationBundle.schema.array());
export type IntegrationsOrNotFound = OrNotFound<Integrations>;
