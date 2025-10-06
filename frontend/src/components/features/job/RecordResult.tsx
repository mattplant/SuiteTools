import { Button, ButtonGroup } from 'flowbite-react';
import type { Job } from '@suiteworks/suitetools-shared';
import { postData } from '../../../api/api';
import { PostEndpoint } from '../../../api/types';
import type { HttpResponse } from '../../../api/types';
import { useAppSettingsContext } from '../../../hooks/useAppSettingsContext';

type Props = {
  data: Job;
  modal?: boolean;
};

export function JobResult({ data, modal }: Props) {
  const { settings } = useAppSettingsContext();
  const appScriptUrl = settings?.appUrl;
  const initiateJobClick = async () => {
    console.log('JobResult: initiateJobClick() iniitiated');
    const entityRecords: { type: string; name: string }[] = [];
    // make API call
    const responseData: HttpResponse = await postData(PostEndpoint.INITIATEJOB, {
      id: data.id,
      data: entityRecords,
    });
    console.log('JobResult: initiateJobClick() response', responseData);
    if (responseData.status === 200) {
      // redirect to job page
      const redirectToPage = appScriptUrl + `#/job/${data.id}`;
      console.log('JobResult: initiateJobClick() redirectToPage', redirectToPage);
      window.location.href = redirectToPage;
    } else {
      console.error('Failed to initiate job');
    }
  };

  function formatLastRun(lastRun: Date | undefined): string {
    if (lastRun instanceof Date) {
      return lastRun.toLocaleString();
    }
    return 'Never run';
  }

  return (
    <>
      <p>
        <b>ID</b>: {data.id}
      </p>
      <p>
        <b>Name</b>: {data.name}
      </p>
      <p>
        <b>Active</b>: {data.isinactive ? 'No' : 'Yes'}
      </p>
      <p>
        <b>Description</b>: {data.description}
      </p>
      <p>
        <b>Scheduled</b>: {data.scheduled ? 'Yes' : 'No'}
      </p>
      <p>
        <b>Notify</b>: {data.notify ? 'Yes' : 'No'}
      </p>
      <p>
        <b>Last Run</b>: {formatLastRun(data.lastRun)}
      </p>
      {modal && (
        <ButtonGroup>
          <Button onClick={() => appScriptUrl && window.open(appScriptUrl + data.urlDetail, '_blank')}>
            View Job Details
          </Button>
          <Button onClick={initiateJobClick}>Run Job</Button>
        </ButtonGroup>
      )}
    </>
  );
}
