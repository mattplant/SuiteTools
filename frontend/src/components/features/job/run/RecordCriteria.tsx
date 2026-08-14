// SPDX-License-Identifier: GPL-3.0-or-later

import type { CriteriaFields } from "../../../shared/criteria/types";
import { RecordCriteriaForm } from "../../../shared/criteria/RecordCriteriaForm";
import { SearchCriteriaJob } from "../../../shared/criteria/SearchCriteriaJob";
import { SearchCriteriaCompleted } from "../../../shared/criteria/SearchCriteriaCompleted";

interface Props {
  defaultCriteria: CriteriaFields;
  setCriteria: (criteria: CriteriaFields) => void;
}

export function RecordCriteria({ setCriteria, defaultCriteria }: Props) {
  return (
    <RecordCriteriaForm defaultCriteria={defaultCriteria} setCriteria={setCriteria} submitLabel="Get Job Status">
      {({ register }) => (
        <>
          <SearchCriteriaJob register={register} />
          <SearchCriteriaCompleted register={register} />
        </>
      )}
    </RecordCriteriaForm>
  );
}
