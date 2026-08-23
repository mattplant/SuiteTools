// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Reader for the app-settings context.
 *
 * @fileoverview
 * A one-line `useContext` wrapper, kept as its own module because it is the seam tests mock to
 * supply settings without mounting a provider. Ten modules outside this directory use it.
 *
 * @remarks
 * Returns the context value as-is, including whatever the provider's default is when a
 * component renders outside the provider — it does not throw on missing context. Callers that
 * require real settings must check, rather than assuming a provider was present.
 *
 * @see ../components/shared/context/AppSettingsContext.tsx – the provider and its default
 * @see ../adapters/api/settings.ts – where the settings payload is fetched
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import { useContext } from "react";
import { AppSettingsContext } from "../components/shared/context/AppSettingsContext";

/**
 * Custom hook to access the AppSettingsContext.
 * @returns The current value of AppSettingsContext.
 */
export function useAppSettingsContext(): React.ContextType<typeof AppSettingsContext> {
  return useContext(AppSettingsContext);
}
