// SPDX-License-Identifier: GPL-3.0-or-later

import type { UseFormRegister } from "react-hook-form";
import { SearchCriteriaSelect } from "./SearchCriteriaSelect";
import { DATE_RANGE_OPTIONS } from "./staticOptions";
import type { CriteriaFields } from "./types";

interface Props {
  register: UseFormRegister<CriteriaFields>;
  title: string;
}

export function SearchCriteriaDateModified({ register, title }: Props): React.JSX.Element {
  return (
    <SearchCriteriaSelect
      register={register}
      name="lastModifiedDate"
      label={title}
      options={DATE_RANGE_OPTIONS}
      allValue="0"
    />
  );
}
