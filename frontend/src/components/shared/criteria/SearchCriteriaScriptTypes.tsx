// SPDX-License-Identifier: GPL-3.0-or-later

import type { UseFormRegister } from "react-hook-form";
import { SearchCriteriaSelect } from "./SearchCriteriaSelect";
import { OptionValuesTypes } from "./types";
import type { CriteriaFields } from "./types";

interface Props {
  register: UseFormRegister<CriteriaFields>;
}

export function SearchCriteriaScriptTypes({ register }: Props): React.JSX.Element {
  return (
    <SearchCriteriaSelect
      register={register}
      name="scriptTypes"
      label="Script Types"
      optionsType={OptionValuesTypes.SCRIPTTYPE}
      multiple
    />
  );
}
