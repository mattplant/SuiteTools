import { useEffect, useState } from 'react';
import type { CriteriaFields } from '../../shared/criteria/types';
import { getJobRun } from '../../../adapters/api/jobRun';
import { getJobRuns } from '../../../adapters/api/jobRuns';
import type { JobRuns } from '@suiteworks/suitetools-shared';
import { Results } from '../../shared/results/Results';
import { ResultsTypes } from '../../shared/results/types';
import { useErrorBoundaryTrigger } from '../../../hooks/useErrorBoundaryTrigger';
import { handleError, toArray } from '@suiteworks/suitetools-shared';

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
  const triggerError = useErrorBoundaryTrigger();
  const [results, setResults] = useState<JobRuns>([]);

  useEffect(() => {
    let ignore = false;
    const criteria: CriteriaFields = {
      job: job,
      completed: completed,
    };

    async function fetchData(): Promise<void> {
      try {
        const data = await getJobRuns(criteria);
        const normalized = toArray<JobRuns[number]>(data);
        if (!ignore) {
          setResults(normalized);
        }
      } catch (err) {
        if (!ignore) {
          setResults([]);
        }
        handleError(err, { reactTrigger: triggerError });
      }
    }

    fetchData();
    return (): void => {
      ignore = true;
    };
  }, [job, completed, triggerError]);

  return (
    <>
      <br />
      <br />
      <h3 className="text-lg font-bold text-slate-900">Job Executions</h3>
      <Results type={ResultsTypes.JOBRUN} lines={results} getModalData={getJobRun} />
    </>
  );
}
