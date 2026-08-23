// SPDX-License-Identifier: GPL-3.0-or-later

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

export function SearchCriteriaCompleted({
  register,
  title = "Completed",
  trueLabel = "Yes",
  falseLabel = "No",
}: Props): React.JSX.Element {
  return (
    <SearchCriteriaSelect
      register={register}
      name="completed"
      label={title}
      options={yesNoOptions(trueLabel, falseLabel)}
    />
  );
}
