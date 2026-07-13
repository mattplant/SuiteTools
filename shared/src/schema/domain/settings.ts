// SPDX-License-Identifier: GPL-3.0-or-later

import { z } from "zod";
import { zNetSuite } from "../zNetSuite";
import { zHelpers } from "../zodUtils";
import type { ZEntityBundle } from "../zodUtils";

/**
 * Zod schema for SuiteTools application settings.
 *
 * Combines custom-record settings, runtime/system info, and current-user context
 * returned by the `settings` API endpoint.
 */
const LastLoginsSchema = z
  .object({
    finished: z.string(),
    data: z.array(
      z.object({
        name: z.object({
          type: z.string(),
          name: z.string(),
        }),
        lastLogin: z.string(),
      }),
    ),
  })
  .nullable()
  .optional();

const SettingsSchema = z.object({
  // core configurations
  cssUrl: zNetSuite.stringOrEmpty.schema,
  jsUrl: zNetSuite.stringOrEmpty.schema,
  // settings
  devMode: z.boolean(),
  notifyEmail: zNetSuite.stringOrEmpty.schema,
  // storage settings
  lastLogins: LastLoginsSchema,
  // system
  accountId: z.string(),
  envType: z.string(),
  isProduction: z.boolean().optional(),
  version: z.string(),
  processorCount: zNetSuite.numberFromString.schema,
  queueCount: zNetSuite.numberFromString.schema,
  appBundle: zNetSuite.stringOrEmpty.schema,
  // user
  userId: zNetSuite.numberFromString.schema,
  userName: z.string(),
  userEmail: z.string(),
  userLocation: zNetSuite.numberFromString.schema,
  userDepartment: zNetSuite.numberFromString.schema,
  userRole: z.string(),
  userRoleId: zNetSuite.numberFromString.schema,
  userSubsidiary: zNetSuite.numberFromString.schema,
  // user permissions
  isAdmin: z.boolean(),
});

const NewSettingsSchema = z.object({
  cssUrl: zNetSuite.stringOrEmpty.schema.optional(),
  jsUrl: zNetSuite.stringOrEmpty.schema.optional(),
  devMode: z.boolean(),
});

const SettingsBundle: ZEntityBundle<typeof SettingsSchema, "Settings"> =
  zHelpers.zCreateBundle(SettingsSchema, {
    meta: { entity: "Settings", plural: "Settings" },
  });

// ───────────────────────────────────────────────────────────
// Public Exports
// ───────────────────────────────────────────────────────────

export { SettingsBundle, SettingsSchema, NewSettingsSchema };
export type Settings = typeof SettingsBundle.types.single;
export type NewSettings = z.infer<typeof NewSettingsSchema>;
