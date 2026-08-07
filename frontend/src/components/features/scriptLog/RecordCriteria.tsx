// SPDX-License-Identifier: GPL-3.0-or-later

import type { CriteriaFields } from '../../shared/criteria/types';
import { RecordCriteriaForm } from '../../shared/criteria/RecordCriteriaForm';
import { SearchCriteriaAdvancedTimePicker } from '../../shared/criteria/SearchCriteriaAdvancedTimePicker';
import { SearchCriteriaContent } from '../../shared/criteria/SearchCriteriaContent';
import { SearchCriteriaLevels } from '../../shared/criteria/SearchCriteriaLevels';
import { SearchCriteriaOwners } from '../../shared/criteria/SearchCriteriaOwners';
import { SearchCriteriaRows } from '../../shared/criteria/SearchCriteriaRows';
import { SearchCriteriaScripts } from '../../shared/criteria/SearchCriteriaScripts';
import { SearchCriteriaScriptTypes } from '../../shared/criteria/SearchCriteriaScriptTypes';

interface Props {
  defaultCriteria: CriteriaFields;
  setCriteria: (criteria: CriteriaFields) => void;
}

export function RecordCriteria({ defaultCriteria, setCriteria }: Props) {
  return (
    <RecordCriteriaForm
      defaultCriteria={defaultCriteria}
      setCriteria={setCriteria}
      submitLabel="Get Server Script Logs"
    >
      {({ register, control, setValue }) => (
        <>
          <SearchCriteriaRows register={register} />
          <SearchCriteriaLevels register={register} />
          <SearchCriteriaScriptTypes register={register} />
          <SearchCriteriaScripts register={register} />
          <SearchCriteriaOwners register={register} title="Owners" />
          <SearchCriteriaAdvancedTimePicker
            register={register}
            control={control}
            setValue={setValue}
            dateDefaultValue={new Date(Date.now())}
            timeDefaultValue={new Date().toLocaleTimeString('en-US', { hour12: false })}
          />
          <SearchCriteriaContent register={register} />
        </>
      )}
    </RecordCriteriaForm>
  );
}
