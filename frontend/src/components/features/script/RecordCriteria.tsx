// SPDX-License-Identifier: GPL-3.0-or-later

import type { CriteriaFields } from "../../shared/criteria/types";
import { RecordCriteriaForm } from "../../shared/criteria/RecordCriteriaForm";
import { SearchCriteriaActive } from "../../shared/criteria/SearchCriteriaActive";
import { SearchCriteriaFiles } from "../../shared/criteria/SearchCriteriaFiles";
import { SearchCriteriaOwners } from "../../shared/criteria/SearchCriteriaOwners";
import { SearchCriteriaScripts } from "../../shared/criteria/SearchCriteriaScripts";
import { SearchCriteriaScriptTypes } from "../../shared/criteria/SearchCriteriaScriptTypes";
import { SearchCriteriaVersions } from "../../shared/criteria/SearchCriteriaVersion";

interface Props {
  defaultCriteria: CriteriaFields;
  setCriteria: (criteria: CriteriaFields) => void;
}

export function RecordCriteria({ setCriteria, defaultCriteria }: Props) {
  return (
    <RecordCriteriaForm defaultCriteria={defaultCriteria} setCriteria={setCriteria} submitLabel="Get Scripts">
      {({ register }) => (
        <>
          <SearchCriteriaActive register={register} />
          <SearchCriteriaVersions register={register} />
          <SearchCriteriaScriptTypes register={register} />
          <SearchCriteriaScripts register={register} />
          <SearchCriteriaOwners register={register} title="Owner" />
          <SearchCriteriaFiles register={register} />
        </>
      )}
    </RecordCriteriaForm>
  );
}
