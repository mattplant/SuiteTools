import { useEffect, useState } from 'react';
import type { CriteriaFields } from '../components/shared/criteria/types';
import { getJob } from '../components/features/job/getRecord';
import { getJobs } from '../components/features/job/getRecords';
import type { Jobs } from '@suiteworks/suitetools-shared';
import { RecordCriteria } from '../components/features/job/RecordCriteria';
import { Results } from '../components/shared/results/Results';
import { ResultsTypes } from '../components/shared/results/types';

export function JobsPage() {
  const defaultCriteria: CriteriaFields = {
    active: 'T',
  };
  const [criteria, setCriteria] = useState<CriteriaFields>(defaultCriteria);
  const [results, setResults] = useState<Jobs>([]);

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
