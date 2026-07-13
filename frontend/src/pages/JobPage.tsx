import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { JobResult } from '../components/features/job/RecordResult';
import { JobRuns } from '../components/features/job/JobRuns';
import type { JobLoaderData } from '../routes/jobLoader';

/**
 * Renders the job page with job details and related job runs.
 * @returns The rendered job page component.
 */
export function JobPage(): JSX.Element {
  const data = useLoaderData() as JobLoaderData;

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">Job</h2>
      <br />
      <Suspense fallback={<div>Fetching...</div>}>
        <Await resolve={data.job}>
          {(record) => {
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
