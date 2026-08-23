// SPDX-License-Identifier: GPL-3.0-or-later

import type { UseFormRegister } from "react-hook-form";
import { SearchCriteriaSelect } from "./SearchCriteriaSelect";
import { LOG_LEVEL_OPTIONS } from "./staticOptions";
import type { CriteriaFields } from "./types";

interface Props {
  register: UseFormRegister<CriteriaFields>;
}

export function SearchCriteriaLevels({ register }: Props): React.JSX.Element {
  return <SearchCriteriaSelect register={register} name="levels" label="Levels" options={LOG_LEVEL_OPTIONS} multiple />;
}
