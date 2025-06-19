import { Button } from 'flowbite-react';
import { Job } from './types';
import { postData } from '../../api/api';
import { PostEndpoint, HttpResponse } from '../../api/types';
import { useAppSettingsContext } from '../AppSettingsContext';
import { getOptionValues as getIntegrationOptionValues } from '../integration/getOptionValues';
import { getOptionValues as getTokenOptionValues } from '../token/getOptionValues';

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
    // get integrations
    const integrationOptions = await getIntegrationOptionValues(true);
    integrationOptions.forEach((option) => {
      entityRecords.push({
        type: 'integration',
        name: option.text,
      });
    });
    // get tokens
    const tokenOptions = await getTokenOptionValues(true);
    tokenOptions.forEach((option) => {
      entityRecords.push({
        type: 'token',
        name: option.text,
      });
    });
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
        <b>Last Run</b>: {data.lastRun}
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
