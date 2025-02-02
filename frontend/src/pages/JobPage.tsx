import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { assertIsJob, Job } from '../components/job/types';
import { JobResult } from '../components/job/RecordResult';

export function JobPage() {
  const data = useLoaderData();
  assertIsData(data);

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">Job</h2>
      <br />
      <Suspense fallback={<div>Fetching...</div>}>
        <Await resolve={data.job}>
          {(job) => {
            assertIsJob(job);
            return <JobResult data={job} />;
          }}
        </Await>
      </Suspense>
    </div>
  );
}

type Data = {
  job: Job;
};

function assertIsData(data: unknown): asserts data is Data {
  if (typeof data !== 'object') {
    throw new Error('Data is not an object');
  }
  if (data === null) {
    throw new Error('Data is null');
  }
  if (!('job' in data)) {
    throw new Error('Data does not contain job');
  }
}
