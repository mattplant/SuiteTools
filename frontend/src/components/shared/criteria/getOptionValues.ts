// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * The single place criteria controls get an option list from, whatever its source.
 *
 * @fileoverview
 * Most types come from the server's `optionValues` endpoint. Integrations and tokens cannot —
 * the endpoint has no case for either — so they are built here from their own list adapters.
 * That split used to be three near-identical modules with two different signatures; folding it
 * into one call means `SearchCriteriaSelect` needs to know only the type token.
 *
 * @remarks
 * The two client-built lists are the reason `OptionValuesTypes` is wider than the endpoint: adding
 * a member here without a matching case in `SuiteToolsApiGetOptions.process()` makes the server
 * reject the request. Options carry the record id as `value`; a control that submits the display
 * string asks for that with `valueBy`, rather than the fetch returning a different shape.
 *
 * @see ../../../adapters/api/optionValues.ts – the endpoint-backed types
 * @see ./SearchCriteriaSelect.tsx – the only caller
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import type { OptionValues } from "@suiteworks/suitetools-shared";
import { getIntegrations } from "../../../adapters/api/integrations";
import { getOptionValues as getServerOptionValues } from "../../../adapters/api/optionValues";
import { getTokens } from "../../../adapters/api/tokens";
import { OptionValuesTypes } from "./types";

/**
 * Turn `{ id, name }` records into sorted options, dropping the markup a scraped name carries.
 * @param records - List rows from an entity adapter.
 * @returns Options sorted by display text.
 */
function toOptionValues(records: readonly { id: number; name: string }[]): OptionValues {
  return records
    .map((record) => ({ value: String(record.id), text: record.name.replace(/<[^>]*>?/gm, "").trim() }))
    .sort((a, b) => a.text.localeCompare(b.text));
}

/**
 * Fetch the option list for a criteria select.
 * @param type - Which list to build.
 * @returns Options, empty when the source has no rows.
 */
export async function getOptionValues(type: OptionValuesTypes): Promise<OptionValues> {
  switch (type) {
    case OptionValuesTypes.INTEGRATION:
      return toOptionValues(await getIntegrations({}));
    case OptionValuesTypes.TOKEN:
      return toOptionValues(await getTokens({}));
    default:
      return getServerOptionValues(type);
  }
}
