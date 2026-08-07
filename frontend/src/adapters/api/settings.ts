// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file API adapter for retrieving SuiteTools application settings.
 * @description
 * Fetches and validates the singleton Settings payload.
 * Pattern: Schema → Adapter → View
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import { makeRequestResponseSchema, SettingsSchema, PutEndpoint } from '@suiteworks/suitetools-shared';
import type { NewSettings, Settings } from '@suiteworks/suitetools-shared';
import type { RequestResponse } from '@suiteworks/suitetools-shared';
import { getData, putData } from './netSuiteClient';

const settingsRequestResponseSchema = makeRequestResponseSchema(SettingsSchema);

/**
 * Fetch and validate SuiteTools application settings.
 * @returns A Promise resolving to a Settings object.
 */
export async function getSettings(): Promise<Settings> {
  const response = await getData('settings');
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
