import { useForm } from 'react-hook-form';
import { Button } from 'flowbite-react';
import { initiateJob } from '../../../adapters/api/job';
import type { CriteriaFields } from '../../shared/criteria/types';
import { SearchCriteriaActive } from '../../shared/criteria/SearchCriteriaActive';
import { getAppBaseUrl } from '../../../utils/navigation';

interface Props {
  defaultCriteria: CriteriaFields;
  setCriteria: (criteria: CriteriaFields) => void;
}

export function RecordCriteria({ setCriteria, defaultCriteria }: Props) {
  const { register, handleSubmit } = useForm<CriteriaFields>({ defaultValues: defaultCriteria });
  const initiateJobsClick = async () => {
    console.log('Jobs Criteria: initiateJobsClick() initiated');
    const responseData = await initiateJob({ id: 0 });
    console.log('Jobs Criteria: initiateJobsClick() response', responseData);
    if (responseData.status === 200) {
      const redirectToPage = getAppBaseUrl() + `#/jobRuns`;
      console.log('Jobs Criteria: initiateJobsClick() redirectToPage', redirectToPage);
      window.location.href = redirectToPage;
    } else {
      console.error('Failed to initiate jobs');
    }
  };

  function onSubmit(criteria: CriteriaFields) {
    console.log('Submitted details:', criteria);
    setCriteria(criteria);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Button type="submit">Get Jobs</Button>
      <Button
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          initiateJobsClick();
        }}
      >
        Run Jobs
      </Button>
      <div className="flex gap-4 p-2.5">
        <SearchCriteriaActive register={register} />
      </div>
    </form>
  );
}
