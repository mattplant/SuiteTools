import { useEffect, useState } from 'react';
import type { NotFound } from '../../../api/types';
import type { CriteriaFields } from '../../shared/criteria/types';
import { getJobRun } from './run/getRecord';
import { getJobRuns } from './run/getRecords';
import type { JobRuns } from '@suiteworks/suitetools-shared';
import { Results } from '../../shared/results/Results';
import { ResultsTypes } from '../../shared/results/types';

type Props = {
  job: string;
  completed: string;
};

export function JobRuns({ job, completed }: Props) {
  const [results, setResults] = useState<JobRuns | NotFound>([]);

  useEffect(() => {
    const criteria: CriteriaFields = {
      job: job,
      completed: completed,
    };
    async function fetchData() {
      try {
        const data = await getJobRuns(criteria);
        setResults(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();

    return () => {};
  }, [job, completed]);

  return (
    <>
      <br />
      <br />
      <h3 className="text-lg font-bold text-slate-900">Job Executions</h3>
      <Results type={ResultsTypes.JOBRUN} lines={Array.isArray(results) ? results : []} getModalData={getJobRun} />
    </>
  );
}
