import { useLoaderData } from 'react-router-dom';
import { JobRunResult } from '../components/features/job/run/RecordResult';
import type { JobRunLoaderData } from '../routes/jobRunLoader';

/**
 * Renders the job run page with job execution details.
 * @returns The rendered job run page component.
 */
export function JobRunPage(): React.JSX.Element {
  const { jobRun } = useLoaderData() as JobRunLoaderData;

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">Job Execution</h2>
      <br />
      <JobRunResult data={jobRun} />
    </div>
  );
}
