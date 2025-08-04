import { useForm } from 'react-hook-form';
import { Button } from 'flowbite-react';
import { CriteriaFields } from '../../shared/criteria/types';
import { SearchCriteriaActive } from '../../shared/criteria/SearchCriteriaActive';
import { SearchCriteriaFiles } from '../../shared/criteria/SearchCriteriaFiles';
import { SearchCriteriaOwners } from '../../shared/criteria/SearchCriteriaOwners';
import { SearchCriteriaScripts } from '../../shared/criteria/SearchCriteriaScripts';
import { SearchCriteriaScriptTypes } from '../../shared/criteria/SearchCriteriaScriptTypes';
import { SearchCriteriaVersions } from '../../shared/criteria/SearchCriteriaVersion';

interface Props {
  defaultCriteria: CriteriaFields;
  setCriteria: (criteria: CriteriaFields) => void;
}

export function RecordCriteria({ setCriteria, defaultCriteria }: Props) {
  const { register, handleSubmit } = useForm<CriteriaFields>({ defaultValues: defaultCriteria });

  function onSubmit(criteria: CriteriaFields) {
    console.log('Submitted details:', criteria);
    setCriteria(criteria);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Button type="submit">Get Scripts</Button>
      <div className="flex gap-4 p-2.5">
        <SearchCriteriaActive register={register} />
        <SearchCriteriaVersions register={register} />
        <SearchCriteriaScriptTypes register={register} />
        <SearchCriteriaScripts register={register} />
        <SearchCriteriaOwners register={register} title="Owner" />
        <SearchCriteriaFiles register={register} />
      </div>
    </form>
  );
}
