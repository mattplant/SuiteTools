import { useEffect, useState } from 'react';
import { CriteriaFields } from '../components/criteria/types.ts';
import { getJob } from '../components/job/getRecord.ts';
import { getJobs } from '../components/job/getRecords.ts';
import { Job } from '../components/job/types.ts';
import { RecordsCriteria } from '../components/job/RecordsCriteria.tsx';
import { Results } from '../components/results/Results.tsx';
import { ResultsTypes } from '../components/results/types.ts';

export function JobsPage() {
  const defaultCriteria: CriteriaFields = {
    rows: 50,
  };
  const [criteria, setCriteria] = useState<CriteriaFields>(defaultCriteria);
  const [results, setResults] = useState<Job[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getJobs(criteria);
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
      <h2 className="text-xl font-bold text-slate-900 mb-2">Jobs</h2>
      <RecordsCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      <Results type={ResultsTypes.JOB} lines={results} getModalData={getJob} />
    </div>
  );
}
