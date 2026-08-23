// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Active/inactive criteria control.
 *
 * @fileoverview
 * A labelled select bound to the `active` field, used by seven screens. Titles and both option
 * labels are props because the same yes/no shape reads differently per entity — "State" with
 * Enabled/Blocked for integrations, "Status" with Success/Failure for logins.
 *
 * @remarks
 * Registers directly against the parent form's `register`; it holds no state of its own. The
 * value is a string, not a boolean, because it round-trips through form serialisation and the
 * query string.
 *
 * @see ./SearchCriteriaSelect.tsx – the shell it renders through
 * @see ./types.ts – the active field
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import type { UseFormRegister } from "react-hook-form";
import { SearchCriteriaSelect } from "./SearchCriteriaSelect";
import { yesNoOptions } from "./staticOptions";
import type { CriteriaFields } from "./types";

interface Props {
  register: UseFormRegister<CriteriaFields>;
  title?: string;
  trueLabel?: string;
  falseLabel?: string;
}

export function SearchCriteriaActive({
  register,
  title = "Active",
  trueLabel = "Yes",
  falseLabel = "No",
}: Props): React.JSX.Element {
  return (
    <SearchCriteriaSelect
      register={register}
      name="active"
      label={title}
      options={yesNoOptions(trueLabel, falseLabel)}
    />
  );
}
