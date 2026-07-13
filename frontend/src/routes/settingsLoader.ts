// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file settingsLoader.ts
 * @description
 * Route data loader for the `/settings` view.
 * @copyright Matthew Plant
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://github.com/mattplant/SuiteTools/blob/main/LICENSE>
 */

import { getSettings } from '../adapters/api/settings';
import type { Settings } from '@suiteworks/suitetools-shared';

/**
 * Loader for the `/settings` route.
 * Awaits settings before returning so the page receives a concrete `Settings` object.
 * @returns An object with a resolved `settings` record.
 */
export async function settingsLoader(): Promise<{ settings: Settings }> {
  try {
    const settings = await getSettings();
    return { settings };
  } catch (err) {
    console.error('router:getSettings() failed', err);
    throw err;
  }
}

export type SettingsLoaderData = Awaited<ReturnType<typeof settingsLoader>>;
