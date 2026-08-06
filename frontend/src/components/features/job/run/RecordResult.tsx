import { Button, ButtonGroup } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import type { JobRun } from '@suiteworks/suitetools-shared';

type Props = {
  data: JobRun;
  modal?: boolean;
};

/**
 * Renders job execution details and in-app navigation actions.
 * @param root0 - Component props.
 * @param root0.data - Job run record to display.
 * @param root0.modal - When true, show the execution-details action used from result modals.
 * @returns The rendered job run result.
 */
export function JobRunResult({ data, modal }: Props): React.ReactElement {
  const navigate = useNavigate();

  return (
    <>
      <p>
        <b>Id</b>: {data.id}
      </p>
      <p>
        <b>Created At</b>: {data.created}
      </p>
      <p>
        <b>Job Name</b>: {data.jobName}
      </p>
      <p>
        <b>Completed</b>: {data.completed ? 'Yes' : 'No'}
      </p>
      <p>
        <b>Results</b>: {data.results}
      </p>
      <ButtonGroup>
        {modal && (
          <Button
            onClick={() => {
              navigate(`/jobRun/${data.id}`);
            }}
          >
            Execution Details
          </Button>
        )}
        <Button
          onClick={() => {
            if (!Number.isFinite(data.jobId) || data.jobId <= 0) {
              console.error('[JobRunResult] missing jobId on record', data);
              return;
            }
            navigate(`/job/${data.jobId}`);
          }}
        >
          Job Details
        </Button>
      </ButtonGroup>
    </>
  );
}
