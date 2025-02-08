import { useForm } from 'react-hook-form';
import { Button } from 'flowbite-react';
import { saveData } from '../../api/api';
import { SavedEndpoint, SavedData, SaveMethod } from '../../api/types';
import { CriteriaFields } from '../criteria/types';
import { SearchCriteriaRows } from '../criteria/SearchCriteriaRows';
import { useAppSettingsContext } from '../AppSettingsContext';

interface RecordsCriteriaProps {
  defaultCriteria: CriteriaFields;
  setCriteria: (criteria: CriteriaFields) => void;
}

export function RecordsCriteria({ setCriteria, defaultCriteria }: RecordsCriteriaProps) {
  const { register, handleSubmit } = useForm<CriteriaFields>({ defaultValues: defaultCriteria });
  const { settings } = useAppSettingsContext();
  const appScriptUrl = settings?.appUrl;
  const initiateJobClick = async () => {
    console.log('initiateJobClick() iniitiated');
    // make API call
    const responseData: SavedData = await saveData(SavedEndpoint.INITIATEJOB, SaveMethod.POST, { id: 0 });
    console.log('initiateJobClick() response', responseData);
    if (responseData.status === 200) {
      // redirect job status page
      window.location.href = appScriptUrl + `#/jobRuns`;
    } else {
      console.error('Failed to initiate job');
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
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-3 py-2 text-center"
      >
        Get Jobs
      </button>
      <Button
        type="button"
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          initiateJobClick();
        }}
      >
        Run Jobs
      </Button>
      <div className="flex gap-4 p-2.5">
        <SearchCriteriaRows register={register} />
      </div>
    </form>
  );
}
