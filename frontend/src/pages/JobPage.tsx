// SPDX-License-Identifier: GPL-3.0-or-later

import { useLoaderData } from "react-router-dom";
import { JobResult } from "../components/features/job/RecordResult";
import { JobRuns } from "../components/features/job/JobRuns";
import type { JobLoaderData } from "../routes/jobLoader";

/**
 * Renders the job page with job details and related job runs.
 * @returns The rendered job page component.
 */
export function JobPage(): React.JSX.Element {
  const { job } = useLoaderData() as JobLoaderData;

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">Job</h2>
      <br />
      <JobResult data={job} />
      <JobRuns job={String(job.id)} completed="" />
    </div>
  );
}
