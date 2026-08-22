// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Detail view rendered inside the results modal.
 *
 * @fileoverview
 * Resolves the selected entity's detail renderer from `resultsRegistry` and hands it the
 * unvalidated modal payload; the registry entry asserts before rendering.
 *
 * @remarks
 * Private to this directory — reached only via `Results`. Replaced an eleven-case switch whose
 * `default:` branch returned `undefined`; the registry's exhaustive keying makes that unreachable.
 *
 * @see registry.tsx – where the bundle assertion is paired with each detail component
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import { resultsRegistry } from "./registry";
import type { ResultsTypes } from "./types";

type Props = { type: ResultsTypes; loading: boolean; data: unknown };

/**
 * Renders the detail view for the selected record inside the results modal.
 * @param root0 - The props object.
 * @param root0.type - Which entity's detail view to render.
 * @param root0.loading - Whether the modal payload is still being fetched.
 * @param root0.data - The unvalidated modal payload; asserted by the registry entry.
 * @returns The rendered detail view, or a status message.
 */
export function ResultsModal({ type, loading, data }: Props): React.ReactNode {
  if (loading) {
    return "Loading...";
  }
  if (!data) {
    return "No records found.";
  }
  return resultsRegistry[type].renderDetail(data);
}
