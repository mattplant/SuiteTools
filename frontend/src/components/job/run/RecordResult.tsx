import { Button } from 'flowbite-react';
import { JobRun } from './types';
import { useAppSettingsContext } from '../../AppSettingsContext';

type Props = {
  data: JobRun;
  modal?: boolean;
};

export function JobRunResult({ data, modal }: Props) {
  const { settings } = useAppSettingsContext();
  const appScriptUrl = settings?.appUrl;

  return (
    <>
      <p>
        <b>Id</b>: {data.id}
      </p>
      <p>
        <b>Created At</b>: {data.created}
      </p>
      <p>
        <b>Job Name</b>: {data.jobname}
      </p>
      <p>
        <b>Completed</b>: {data.completed ? 'Yes' : 'No'}
      </p>
      <p>
        <b>Results</b>: {data.results}
      </p>
      {modal && (
        <Button.Group>
          <Button onClick={() => appScriptUrl && window.open(appScriptUrl + data.urlDetail, '_blank')}>
            View Job Details
          </Button>
        </Button.Group>
      )}
    </>
  );
}
