// SPDX-License-Identifier: GPL-3.0-or-later

import type { UseFormRegister } from "react-hook-form";
import { SearchCriteriaSelect } from "./SearchCriteriaSelect";
import { OptionValuesTypes } from "./types";
import type { CriteriaFields } from "./types";

interface Props {
  register: UseFormRegister<CriteriaFields>;
}

export function SearchCriteriaIntegrations({ register }: Props): React.JSX.Element {
  return (
    <SearchCriteriaSelect
      register={register}
      name="integrations"
      label="Integrations"
      optionsType={OptionValuesTypes.INTEGRATION}
      multiple
    />
  );
}
