import { useForm } from 'react-hook-form';
import { Button } from 'flowbite-react';
import { CriteriaFields } from './types';
import { RecordCriteriaFieldDateRange } from './RecordCriteriaFieldDateRange';

interface Props {
  defaultCriteria: CriteriaFields;
  setCriteria: (criteria: CriteriaFields) => void;
}

export function RecordCriteria({ setCriteria, defaultCriteria }: Props) {
  const { register, handleSubmit, setValue } = useForm<CriteriaFields>({ defaultValues: defaultCriteria });

  function onSubmit(criteria: CriteriaFields) {
    console.log('Submitted details:', criteria);
    setCriteria(criteria);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Button type="submit">Get Server Script Logs</Button>
      <div className="flex gap-4 p-2.5">
        <RecordCriteriaFieldDateRange register={register} setValue={setValue} defaultValues={defaultCriteria} />
      </div>
    </form>
  );
}
