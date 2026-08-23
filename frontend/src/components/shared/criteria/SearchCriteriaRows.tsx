// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Row-limit criteria control.
 *
 * @fileoverview
 * A fixed select bound to the `rows` field, capping how many records a search returns. Shared
 * so the row-limit choices stay identical across screens.
 *
 * @remarks
 * `rows` is the one numeric field in `CriteriaFields`, and it is enforced server-side — this
 * control only chooses the value, so changing the options here does not change any limit the
 * backend applies. Its catch-all entry submits `0`, not the empty string every other control uses.
 *
 * @see ./staticOptions.ts – the row caps offered
 * @see ./types.ts – the rows field
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import type { UseFormRegister } from "react-hook-form";
import { SearchCriteriaSelect } from "./SearchCriteriaSelect";
import { ROW_LIMIT_OPTIONS } from "./staticOptions";
import type { CriteriaFields } from "./types";

interface Props {
  register: UseFormRegister<CriteriaFields>;
}

export function SearchCriteriaRows({ register }: Props): React.JSX.Element {
  return <SearchCriteriaSelect register={register} name="rows" label="Rows" options={ROW_LIMIT_OPTIONS} allValue="0" />;
}
