// SPDX-License-Identifier: GPL-3.0-or-later

import type { UseFormRegister } from "react-hook-form";
import { SearchCriteriaSelect } from "./SearchCriteriaSelect";
import { API_VERSION_OPTIONS } from "./staticOptions";
import type { CriteriaFields } from "./types";

interface Props {
  register: UseFormRegister<CriteriaFields>;
}

export function SearchCriteriaVersions({ register }: Props): React.JSX.Element {
  return (
    <SearchCriteriaSelect register={register} name="versions" label="API" options={API_VERSION_OPTIONS} multiple />
  );
}
