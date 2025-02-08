import { useEffect, useState } from 'react';
import { CriteriaFields } from '../components/criteria/types.ts';
import { getJobRun } from '../components/job/run/getRecord.ts';
import { getJobRuns } from '../components/job/run/getRecords.ts';
import { JobRun } from '../components/job/run/types.ts';
import { RecordsCriteria } from '../components/job/run/RecordsCriteria.tsx';
import { Results } from '../components/results/Results.tsx';
import { ResultsTypes } from '../components/results/types.ts';

export function JobRunsPage() {
  const defaultCriteria: CriteriaFields = {
    rows: 50,
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
      <RecordsCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      <Results type={ResultsTypes.JOBRUN} lines={results} getModalData={getJobRun} />
    </div>
  );
}
