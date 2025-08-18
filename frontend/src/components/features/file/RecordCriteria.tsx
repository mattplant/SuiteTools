import { useForm } from 'react-hook-form';
import { Button } from 'flowbite-react';
import type { CriteriaFields } from '../../shared/criteria/types';
import { SearchCriteriaDateCreated } from '../../shared/criteria/SearchCriteriaDateCreated';
import { SearchCriteriaFileTypes } from '../../shared/criteria/SearchCriteriaFileTypes';
import { SearchCriteriaRows } from '../../shared/criteria/SearchCriteriaRows';
import { SearchCriteriaDateModified } from '../../shared/criteria/SearchCriteriaDateModified';

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
      <Button type="submit">Get Files</Button>
      <div className="flex gap-4 p-2.5">
        <SearchCriteriaRows register={register} />
        <SearchCriteriaFileTypes register={register} />
        <SearchCriteriaDateCreated register={register} title="Created Date" />
        <SearchCriteriaDateModified register={register} title="Modified Date" />
      </div>
    </form>
  );
}
