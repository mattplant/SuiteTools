import { Button, ButtonGroup } from 'flowbite-react';
import type { JobRun } from '@suiteworks/suitetools-shared';
import { openAppPage } from '../../../../utils/navigation';

type Props = {
  data: JobRun;
  modal?: boolean;
};

export function JobRunResult({ data, modal }: Props) {
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
      <ButtonGroup>
        {modal && <Button onClick={() => data.urlDetail && openAppPage(data.urlDetail)}>Execution Details</Button>}
        <Button onClick={() => data.urlJob && openAppPage(data.urlJob)}>Job Details</Button>
      </ButtonGroup>
    </>
  );
}
