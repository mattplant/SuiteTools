// SPDX-License-Identifier: GPL-3.0-or-later

import type { CriteriaFields } from '../../shared/criteria/types';
import { RecordCriteriaForm } from '../../shared/criteria/RecordCriteriaForm';
import { SearchCriteriaActive } from '../../shared/criteria/SearchCriteriaActive';

interface Props {
  defaultCriteria: CriteriaFields;
  setCriteria: (criteria: CriteriaFields) => void;
}

export function RecordCriteria({ setCriteria, defaultCriteria }: Props) {
  return (
    <RecordCriteriaForm
      defaultCriteria={defaultCriteria}
      setCriteria={setCriteria}
      submitLabel="Get Integrations"
    >
      {({ register }) => (
        <SearchCriteriaActive register={register} title="State" trueLabel="Enabled" falseLabel="Blocked" />
      )}
    </RecordCriteriaForm>
  );
}
