import { Button } from 'flowbite-react';
import { Job } from './types';
import { useAppSettingsContext } from '../AppSettingsContext';

type Props = {
  data: Job;
  modal?: boolean;
};

export function JobResult({ data, modal }: Props) {
  const { settings } = useAppSettingsContext();
  const appScriptUrl = settings?.appUrl;

  return (
    <>
      <p>
        <b>ID</b>: {data.id}
      </p>
      <p>
        <b>Name</b>: {data.name}
      </p>
      {modal && (
        <Button.Group>
          <Button onClick={() => appScriptUrl && window.open(appScriptUrl + data.urlDetail, '_blank')}>
            View Job Details
          </Button>
          <Button onClick={() => appScriptUrl && window.open(appScriptUrl + data.urlRun, '_blank')}>Run Job</Button>
        </Button.Group>
      )}
    </>
  );
}
