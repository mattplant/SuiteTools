import { z } from "zod";
import { zNetSuite } from "../zNetSuite";
import { zHelpers } from "../zodUtils";
import type { ZEntityBundle } from "../zodUtils";

/**
 * Zod schema for a single login entry.
 *
 * Fields:
 * - `id`: unique numeric identifier
 * - `date`: ISO timestamp of the login
 * - `status`: status of the login (e.g., success, failure)
 * - `oauthappname`: name of the OAuth application used
 * - `oauthaccesstokenname`: name of the OAuth access token (optional, nullable)
 * - `user`: user ID (optional)
 * - `username`: username (optional)
 * - `role`: role ID (optional)
 * - `rolename`: name of the role (optional)
 * - `emailaddress`: email address (optional)
 * - `ipaddress`: IP address of the login
 * - `requesturi`: URI of the request
 * - `detail`: additional details (optional)
 * - `secchallenge`: security challenge (optional)
 * - `useragent`: user agent string (optional)
 * - `urlNs`: URL for NetSuite (optional)
 * - `urlDetail`: URL for additional context (optional)
 */
export const LoginSchema = z.object({
  id: z.number(),
  date: z.string().refine((s) => !Number.isNaN(Date.parse(s)), {
    message: "Invalid ISO timestamp",
  }),
  status: z.string(),
  oauthappname: z.string().optional().nullable(),
  oauthaccesstokenname: z.string().optional().nullable(),
  user: z.number().optional(),
  username: z.string().optional(),
  role: z.number().optional().nullable(),
  rolename: z.string().optional().nullable(),
  emailaddress: z.string().optional(),
  ipaddress: z.string(),
  requesturi: z.string(),
  detail: z.string().optional().nullable(),
  secchallenge: z.string().optional().nullable(),
  useragent: z.string().optional().nullable(),
  // additional properties
  urlNs: z.string().optional(),
  urlDetail: z.string().optional(),
});

const LoginBundle: ZEntityBundle<typeof LoginSchema, "Login"> =
  zHelpers.zCreateBundle(LoginSchema, {
    meta: { entity: "Login", plural: "Logins" },
  });

// ───────────────────────────────────────────────────────────
// Public Exports
// ───────────────────────────────────────────────────────────

export { LoginBundle };
export type Login = typeof LoginBundle.types.single;
export type Logins = typeof LoginBundle.types.array;
