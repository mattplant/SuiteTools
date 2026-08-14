// SPDX-License-Identifier: GPL-3.0-or-later

import type { CriteriaFields } from "../../shared/criteria/types";
import { RecordCriteriaForm } from "../../shared/criteria/RecordCriteriaForm";
import { SearchCriteriaActive } from "../../shared/criteria/SearchCriteriaActive";
import { SearchCriteriaIntegrationName } from "../../shared/criteria/SearchCriteriaIntegrationName";
import { SearchCriteriaTokenName } from "../../shared/criteria/SearchCriteriaTokenName";
import { SearchCriteriaRoles } from "../../shared/criteria/SearchCriteriaRoles";
import { SearchCriteriaRows } from "../../shared/criteria/SearchCriteriaRows";
import { SearchCriteriaUsers } from "../../shared/criteria/SearchCriteriaUsers";

interface Props {
  defaultCriteria: CriteriaFields;
  setCriteria: (criteria: CriteriaFields) => void;
}

export function RecordCriteria({ setCriteria, defaultCriteria }: Props) {
  return (
    <RecordCriteriaForm defaultCriteria={defaultCriteria} setCriteria={setCriteria} submitLabel="Get Logins">
      {({ register }) => (
        <>
          <SearchCriteriaRows register={register} />
          <SearchCriteriaActive register={register} title="Status" trueLabel="Success" falseLabel="Failure" />
          <SearchCriteriaIntegrationName register={register} title="OAuth Application" />
          <SearchCriteriaTokenName register={register} title="OAuth Access Token" />
          <SearchCriteriaUsers register={register} />
          <SearchCriteriaRoles register={register} />
          {/* TODO: Dates */}
        </>
      )}
    </RecordCriteriaForm>
  );
}
