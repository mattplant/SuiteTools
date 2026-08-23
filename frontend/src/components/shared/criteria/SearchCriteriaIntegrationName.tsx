// SPDX-License-Identifier: GPL-3.0-or-later

import type { UseFormRegister } from "react-hook-form";
import { SearchCriteriaSelect } from "./SearchCriteriaSelect";
import { OptionValuesTypes } from "./types";
import type { CriteriaFields } from "./types";

interface Props {
  register: UseFormRegister<CriteriaFields>;
  title?: string;
}

export function SearchCriteriaIntegrationName({ register, title = "Integration" }: Props): React.JSX.Element {
  return (
    <SearchCriteriaSelect
      register={register}
      name="integrationName"
      label={title}
      optionsType={OptionValuesTypes.INTEGRATION}
      valueBy="text"
    />
  );
}
