import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { assertIsJobRun, JobRun } from '../components/features/job/run/types';
import { JobRunResult } from '../components/features/job/run/RecordResult';

export function JobRunPage() {
  const data = useLoaderData();
  assertIsData(data);

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">Job Execution</h2>
      <br />
      <Suspense fallback={<div>Fetching...</div>}>
        <Await resolve={data.jobRun}>
          {(record) => {
            assertIsJobRun(record);
            return <JobRunResult data={record} />;
          }}
        </Await>
      </Suspense>
    </div>
  );
}

type Data = {
  jobRun: JobRun;
};

function assertIsData(data: unknown): asserts data is Data {
  if (typeof data !== 'object') {
    throw new Error('Data is not an object');
  }
  if (data === null) {
    throw new Error('Data is null');
  }
  if (!('jobRun' in data)) {
    throw new Error('Data does not contain job');
  }
}
