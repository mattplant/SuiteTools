import { useEffect, useState } from 'react';
import { CriteriaFields } from '../components/shared/criteria/types.ts';
import { getJobRun } from '../components/features/job/run/getRecord.ts';
import { getJobRuns } from '../components/features/job/run/getRecords.ts';
import { JobRun } from 'shared';
import { RecordCriteria } from '../components/features/job/run/RecordCriteria.tsx';
import { Results } from '../components/shared/results/Results.tsx';
import { ResultsTypes } from '../components/shared/results/types.ts';

export function JobRunsPage() {
  const defaultCriteria: CriteriaFields = {
    rows: 50,
    job: '',
    completed: '',
  };
  const [criteria, setCriteria] = useState<CriteriaFields>(defaultCriteria);
  const [results, setResults] = useState<JobRun[]>([]);

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
