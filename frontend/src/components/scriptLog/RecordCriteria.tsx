import { useForm } from 'react-hook-form';
import { Button } from 'flowbite-react';
import { CriteriaFields } from '../criteria/types';
import { SearchCriteriaAdvancedTimePicker } from '../criteria/SearchCriteriaAdvancedTimePicker';
import { SearchCriteriaContent } from '../criteria/SearchCriteriaContent';
import { SearchCriteriaLevels } from '../criteria/SearchCriteriaLevels';
import { SearchCriteriaOwners } from '../criteria/SearchCriteriaOwners';
import { SearchCriteriaRows } from '../criteria/SearchCriteriaRows';
import { SearchCriteriaScripts } from '../criteria/SearchCriteriaScripts';
import { SearchCriteriaScriptTypes } from '../criteria/SearchCriteriaScriptTypes';
// import { SearchCriteriaUser } from '../../components/search/criteria/SearchCriteriaUser';

interface Props {
  defaultCriteria: CriteriaFields;
  setCriteria: (criteria: CriteriaFields) => void;
}

export function RecordCriteria({ defaultCriteria, setCriteria }: Props) {
  const { register, handleSubmit, control } = useForm<CriteriaFields>({
    defaultValues: defaultCriteria,
  });

  function onSubmit(criteria: CriteriaFields) {
    console.log('Submitted details:', criteria);
    setCriteria(criteria);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Button type="submit">Get Server Script Logs</Button>
      <div className="flex gap-4 p-2.5">
        <SearchCriteriaRows register={register} />
        <SearchCriteriaLevels register={register} />
        {/* <SearchCriteriaUser register={register} /> */}
        <SearchCriteriaScriptTypes register={register} />
        <SearchCriteriaScripts register={register} />
        <SearchCriteriaOwners register={register} title="Owners" />
        <SearchCriteriaAdvancedTimePicker
          register={register}
          control={control}
          dateDefaultValue={new Date(Date.now())}
          timeDefaultValue={new Date().toLocaleTimeString('en-US', { hour12: false })}
        />
        <SearchCriteriaContent register={register} />
      </div>
    </form>
  );
}
