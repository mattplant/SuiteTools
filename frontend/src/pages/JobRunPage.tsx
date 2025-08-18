import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { JobRunBundle } from '@suiteworks/suitetools-shared';
import { JobRunResult } from '../components/features/job/run/RecordResult';

export function JobRunPage() {
  const data = useLoaderData();
  JobRunBundle.assert(data);

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">Job Execution</h2>
      <br />
      <Suspense fallback={<div>Fetching...</div>}>
        <Await resolve={data}>
          {(record) => {
            JobRunBundle.assert(record);
            return <JobRunResult data={record} />;
          }}
        </Await>
      </Suspense>
    </div>
  );
}
