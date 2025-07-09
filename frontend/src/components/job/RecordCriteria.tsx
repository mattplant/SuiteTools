import { useForm } from 'react-hook-form';
import { Button } from 'flowbite-react';
import { postData } from '../../api/api';
import { PostEndpoint, HttpResponse } from '../../api/types';
import { CriteriaFields } from '../criteria/types';
import { SearchCriteriaActive } from '../criteria/SearchCriteriaActive';
import { useAppSettingsContext } from '../AppSettingsContext';

interface Props {
  defaultCriteria: CriteriaFields;
  setCriteria: (criteria: CriteriaFields) => void;
}

export function RecordCriteria({ setCriteria, defaultCriteria }: Props) {
  const { register, handleSubmit } = useForm<CriteriaFields>({ defaultValues: defaultCriteria });
  const { settings } = useAppSettingsContext();
  const appScriptUrl = settings?.appUrl;
  const initiateJobsClick = async () => {
    console.log('Jobs Crieria: initiateJobsClick() iniitiated');
    // make API call
    const responseData: HttpResponse = await postData(PostEndpoint.INITIATEJOB, { id: 0 });
    console.log('Jobs Crieria: initiateJobsClick() response', responseData);
    if (responseData.status === 200) {
      // redirect to job status page
      const redirectToPage = appScriptUrl + `#/jobRuns`;
      console.log('Jobs Crieria: initiateJobsClick() redirectToPage', redirectToPage);
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
      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-hidden focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-3 py-2 text-center"
      >
        Get Jobs
      </button>
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
