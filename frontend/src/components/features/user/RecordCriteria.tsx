// SPDX-License-Identifier: GPL-3.0-or-later

import type { CriteriaFields } from "../../shared/criteria/types";
import { RecordCriteriaForm } from "../../shared/criteria/RecordCriteriaForm";
import { SearchCriteriaActive } from "../../shared/criteria/SearchCriteriaActive";
import { SearchCriteriaOwners } from "../../shared/criteria/SearchCriteriaOwners";
import { SearchCriteriaRoles } from "../../shared/criteria/SearchCriteriaRoles";

interface Props {
  defaultCriteria: CriteriaFields;
  setCriteria: (criteria: CriteriaFields) => void;
}

export function RecordCriteria({ setCriteria, defaultCriteria }: Props) {
  return (
    <RecordCriteriaForm defaultCriteria={defaultCriteria} setCriteria={setCriteria} submitLabel="Get Users">
      {({ register }) => (
        <>
          <SearchCriteriaActive register={register} />
          <SearchCriteriaRoles register={register} />
          <SearchCriteriaOwners register={register} title="Supervisors" />
        </>
      )}
    </RecordCriteriaForm>
  );
}
