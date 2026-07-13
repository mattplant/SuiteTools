import { useEffect, useState } from 'react';
import type { CriteriaFields } from '../components/shared/criteria/types';
import { getJobRun } from '../adapters/api/jobRun';
import { getJobRuns } from '../adapters/api/jobRuns';
import type { JobRuns } from '@suiteworks/suitetools-shared';
import { RecordCriteria } from '../components/features/job/run/RecordCriteria';
import { Results } from '../components/shared/results/Results';
import { ResultsTypes } from '../components/shared/results/types';
import { useErrorBoundaryTrigger } from '../hooks/useErrorBoundaryTrigger';
import { handleError, toArray } from '@suiteworks/suitetools-shared';

/**
 * JobRunsPage component displays the job runs list and criteria filter.
 * @returns The rendered JobRunsPage component.
 */
export function JobRunsPage(): React.ReactElement {
  const triggerError = useErrorBoundaryTrigger();

  const defaultCriteria: CriteriaFields = {
    rows: 50,
    job: '',
    completed: '',
  };

  const [criteria, setCriteria] = useState<CriteriaFields>(defaultCriteria);
  const [results, setResults] = useState<JobRuns>([]);

  useEffect(() => {
    let ignore = false;

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
  }, [criteria, triggerError]);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Job Status</h2>
      <RecordCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      <Results type={ResultsTypes.JOBRUN} lines={results} getModalData={getJobRun} />
    </div>
  );
}
