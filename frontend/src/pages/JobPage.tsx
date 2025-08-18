import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { JobBundle } from '@suiteworks/suitetools-shared';
import { JobResult } from '../components/features/job/RecordResult';
import { JobRuns } from '../components/features/job/JobRuns';

export function JobPage() {
  const data = useLoaderData();

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">Job</h2>
      <br />
      <Suspense fallback={<div>Fetching...</div>}>
        <Await resolve={data}>
          {(record) => {
            JobBundle.assert(record);
            return (
              <>
                <JobResult data={record} />
                <JobRuns job={String(record.id)} completed="" />
              </>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}
