// SPDX-License-Identifier: GPL-3.0-or-later

import type { CriteriaFields } from '../../shared/criteria/types';
import { getJobRun } from '../../../adapters/api/jobRun';
import { getJobRuns } from '../../../adapters/api/jobRuns';
import type { JobRuns } from '@suiteworks/suitetools-shared';
import { Results } from '../../shared/results/Results';
import { ResultsTypes } from '../../shared/results/types';
import { useEntityList } from '../../../hooks/useEntityList';

type Props = {
  job: string;
  completed: string;
};

/**
 * Renders job executions for a related job context.
 * @param props - Component props.
 * @param props.job - Job ID filter.
 * @param props.completed - Completed-status filter.
 * @returns The rendered job executions section.
 */
export function JobRuns({ job, completed }: Props): React.ReactElement {
  const { results } = useEntityList<JobRuns[number], CriteriaFields>({
    defaultCriteria: { job, completed },
    fetchList: () => getJobRuns({ job, completed }),
    deps: [job, completed],
  });

  return (
    <>
      <br />
      <br />
      <h3 className="text-lg font-bold text-slate-900">Job Executions</h3>
      <Results type={ResultsTypes.JOBRUN} lines={results} getModalData={getJobRun} />
    </>
  );
}
