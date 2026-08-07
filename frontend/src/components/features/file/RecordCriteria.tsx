// SPDX-License-Identifier: GPL-3.0-or-later

import type { CriteriaFields } from '../../shared/criteria/types';
import { RecordCriteriaForm } from '../../shared/criteria/RecordCriteriaForm';
import { SearchCriteriaDateCreated } from '../../shared/criteria/SearchCriteriaDateCreated';
import { SearchCriteriaFileTypes } from '../../shared/criteria/SearchCriteriaFileTypes';
import { SearchCriteriaRows } from '../../shared/criteria/SearchCriteriaRows';
import { SearchCriteriaDateModified } from '../../shared/criteria/SearchCriteriaDateModified';

interface Props {
  defaultCriteria: CriteriaFields;
  setCriteria: (criteria: CriteriaFields) => void;
}

export function RecordCriteria({ setCriteria, defaultCriteria }: Props) {
  return (
    <RecordCriteriaForm
      defaultCriteria={defaultCriteria}
      setCriteria={setCriteria}
      submitLabel="Get Files"
    >
      {({ register }) => (
        <>
          <SearchCriteriaRows register={register} />
          <SearchCriteriaFileTypes register={register} />
          <SearchCriteriaDateCreated register={register} title="Created Date" />
          <SearchCriteriaDateModified register={register} title="Modified Date" />
        </>
      )}
    </RecordCriteriaForm>
  );
}
