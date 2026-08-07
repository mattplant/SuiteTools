// SPDX-License-Identifier: GPL-3.0-or-later

import type { CriteriaFields } from '../../shared/criteria/types';
import { RecordCriteriaForm } from '../../shared/criteria/RecordCriteriaForm';
import { SearchCriteriaIntegrations } from '../../shared/criteria/SearchCriteriaIntegrations';

interface Props {
  defaultCriteria: CriteriaFields;
  setCriteria: (criteria: CriteriaFields) => void;
}

export function RecordCriteria({ defaultCriteria, setCriteria }: Props) {
  return (
    <RecordCriteriaForm
      defaultCriteria={defaultCriteria}
      setCriteria={setCriteria}
      submitLabel="Get SOAP Logs"
    >
      {({ register }) => <SearchCriteriaIntegrations register={register} />}
    </RecordCriteriaForm>
  );
}
