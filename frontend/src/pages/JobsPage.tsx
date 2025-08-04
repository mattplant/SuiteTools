import { useEffect, useState } from 'react';
import { CriteriaFields } from '../components/shared/criteria/types.ts';
import { getJob } from '../components/features/job/getRecord.ts';
import { getJobs } from '../components/features/job/getRecords.ts';
import { Job } from '../components/features/job/types.ts';
import { RecordCriteria } from '../components/features/job/RecordCriteria.tsx';
import { Results } from '../components/shared/results/Results.tsx';
import { ResultsTypes } from '../components/shared/results/types.ts';

export function JobsPage() {
  const defaultCriteria: CriteriaFields = {
    active: 'T',
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
      <RecordCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      <Results type={ResultsTypes.JOB} lines={results} getModalData={getJob} />
    </div>
  );
}
