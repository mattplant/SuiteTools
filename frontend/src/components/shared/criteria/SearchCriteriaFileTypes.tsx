// SPDX-License-Identifier: GPL-3.0-or-later

import type { UseFormRegister } from "react-hook-form";
import { SearchCriteriaSelect } from "./SearchCriteriaSelect";
import { OptionValuesTypes } from "./types";
import type { CriteriaFields } from "./types";

interface Props {
  register: UseFormRegister<CriteriaFields>;
}

export function SearchCriteriaFileTypes({ register }: Props): React.JSX.Element {
  return (
    <SearchCriteriaSelect
      register={register}
      name="fileTypes"
      label="File Types"
      optionsType={OptionValuesTypes.FILETYPE}
      multiple
    />
  );
}
