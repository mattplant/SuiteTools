import { useEffect, useState } from 'react';
import type { CriteriaFields } from '../components/shared/criteria/types';
import { getJobRun } from '../components/features/job/run/getRecord';
import { getJobRuns } from '../components/features/job/run/getRecords';
import type { JobRuns } from '@suiteworks/suitetools-shared';
import { RecordCriteria } from '../components/features/job/run/RecordCriteria';
import { Results } from '../components/shared/results/Results';
import { ResultsTypes } from '../components/shared/results/types';

export function JobRunsPage() {
  const defaultCriteria: CriteriaFields = {
    rows: 50,
    job: '',
    completed: '',
  };
  const [criteria, setCriteria] = useState<CriteriaFields>(defaultCriteria);
  const [results, setResults] = useState<JobRuns>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getJobRuns(criteria);
        if (!('message' in data)) {
          setResults(data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();

    return () => {};
  }, [criteria]);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Job Status</h2>
      <RecordCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      <Results type={ResultsTypes.JOBRUN} lines={results} getModalData={getJobRun} />
    </div>
  );
}
