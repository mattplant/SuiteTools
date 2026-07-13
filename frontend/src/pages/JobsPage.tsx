import { useEffect, useState } from 'react';
import type { CriteriaFields } from '../components/shared/criteria/types';
import { getJob } from '../adapters/api/job';
import { getJobs } from '../adapters/api/jobs';
import type { Jobs } from '@suiteworks/suitetools-shared';
import { RecordCriteria } from '../components/features/job/RecordCriteria';
import { Results } from '../components/shared/results/Results';
import { ResultsTypes } from '../components/shared/results/types';
import { useErrorBoundaryTrigger } from '../hooks/useErrorBoundaryTrigger';
import { handleError, toArray } from '@suiteworks/suitetools-shared';

/**
 * JobsPage component displays the jobs list and criteria filter.
 * @returns The rendered JobsPage component.
 */
export function JobsPage(): React.ReactElement {
  const triggerError = useErrorBoundaryTrigger();

  const defaultCriteria: CriteriaFields = {
    active: 'T',
  };

  const [criteria, setCriteria] = useState<CriteriaFields>(defaultCriteria);
  const [results, setResults] = useState<Jobs>([]);

  useEffect(() => {
    let ignore = false;

    async function fetchData(): Promise<void> {
      try {
        const data = await getJobs(criteria);
        const normalized = toArray<Jobs[number]>(data);
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
      <h2 className="text-xl font-bold text-slate-900 mb-2">Jobs</h2>
      <RecordCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      <Results type={ResultsTypes.JOB} lines={results} getModalData={getJob} />
    </div>
  );
}
