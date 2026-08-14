// SPDX-License-Identifier: GPL-3.0-or-later

import type { CriteriaFields } from "../../shared/criteria/types";
import { RecordCriteriaForm } from "../../shared/criteria/RecordCriteriaForm";
import { SearchCriteriaActive } from "../../shared/criteria/SearchCriteriaActive";
import { SearchCriteriaIntegrationName } from "../../shared/criteria/SearchCriteriaIntegrationName";
import { SearchCriteriaRoleName } from "../../shared/criteria/SearchCriteriaRoleName";
import { SearchCriteriaUserName } from "../../shared/criteria/SearchCriteriaUserName";

interface Props {
  defaultCriteria: CriteriaFields;
  setCriteria: (criteria: CriteriaFields) => void;
}

export function RecordCriteria({ defaultCriteria, setCriteria }: Props) {
  return (
    <RecordCriteriaForm defaultCriteria={defaultCriteria} setCriteria={setCriteria} submitLabel="Get Tokens">
      {({ register }) => (
        <>
          <SearchCriteriaActive register={register} title="Status" trueLabel="Active" falseLabel="Revoked" />
          <SearchCriteriaIntegrationName register={register} />
          <SearchCriteriaUserName register={register} />
          <SearchCriteriaRoleName register={register} />
        </>
      )}
    </RecordCriteriaForm>
  );
}
