import { useForm } from 'react-hook-form';
import { Button } from 'flowbite-react';
import { CriteriaFields } from '../../../shared/criteria/types';
import { SearchCriteriaJob } from '../../../shared/criteria/SearchCriteriaJob';
import { SearchCriteriaCompleted } from '../../../shared/criteria/SearchCriteriaCompleted';

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
      <Button type="submit">Get Job Status</Button>
      <div className="flex gap-4 p-2.5">
        <SearchCriteriaJob register={register} />
        <SearchCriteriaCompleted register={register} />
      </div>
    </form>
  );
}
