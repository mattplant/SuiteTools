import { Button } from 'flowbite-react';
import { Job } from './types';
import { saveData } from '../../api/api';
import { SavedEndpoint, SavedData, SaveMethod } from '../../api/types';
import { useAppSettingsContext } from '../AppSettingsContext';

type Props = {
  data: Job;
  modal?: boolean;
};

export function JobResult({ data, modal }: Props) {
  const { settings } = useAppSettingsContext();
  const appScriptUrl = settings?.appUrl;
  const initiateJobClick = async () => {
    console.log('initiateJobClick() iniitiated');
    // make API call
    const responseData: SavedData = await saveData(SavedEndpoint.INITIATEJOB, SaveMethod.POST, { id: data.id });
    console.log('initiateJobClick() response', responseData);
    if (responseData.status === 200) {
      // redirect to that job's detail page
      window.location.href = appScriptUrl + `#/job/${data.id}`;
    } else {
      console.error('Failed to initiate job');
    }
  };

  return (
    <>
      <p>
        <b>ID</b>: {data.id}
      </p>
      <p>
        <b>Name</b>: {data.name}
      </p>
      <Button.Group>
        {modal && (
          <Button onClick={() => appScriptUrl && window.open(appScriptUrl + data.urlDetail, '_blank')}>
            View Job Details
          </Button>
        )}
        <Button onClick={initiateJobClick}>Run Job</Button>
      </Button.Group>
    </>
  );
}
