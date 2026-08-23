// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Adapter for the SuiteTools settings singleton.
 *
 * @fileoverview
 * Settings is one record rather than a collection, so this file does not use the singular
 * adapter factory — there is no id to fetch by. It pairs a `getSettings` read with a
 * `saveSettings` write.
 *
 * @remarks
 * The payload carries `lastLogins`, which several list adapters join against to enrich rows.
 * That makes settings a read dependency of screens that appear unrelated to configuration, so
 * a shape change here reaches further than the settings page.
 *
 * @see ../../hooks/useAppSettingsContext.ts – how screens consume the loaded settings
 * @see ./tokens.ts – a consumer of the lastLogins payload
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import { makeRequestResponseSchema, SettingsSchema, PutEndpoint } from "@suiteworks/suitetools-shared";
import type { NewSettings, Settings } from "@suiteworks/suitetools-shared";
import type { RequestResponse } from "@suiteworks/suitetools-shared";
import { getData, putData } from "./netSuiteClient";

const settingsRequestResponseSchema = makeRequestResponseSchema(SettingsSchema);

/**
 * Fetch and validate SuiteTools application settings.
 * @returns A Promise resolving to a Settings object.
 */
export async function getSettings(): Promise<Settings> {
  const response = await getData("settings");
  const parsed = settingsRequestResponseSchema.parse(response);
  return parsed.data;
}

/**
 * Persist SuiteTools settings via PUT.
 * @param data - Settings fields to save.
 * @returns The API response envelope.
 */
export async function saveSettings(data: NewSettings): Promise<RequestResponse> {
  return putData(PutEndpoint.SETTINGS, data);
}
