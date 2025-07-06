import { useEffect, useState } from 'react';
import { NotFound } from '../../api/types.ts';
import { CriteriaFields } from '../criteria/types.ts';
import { getJobRun } from './run/getRecord.ts';
import { getJobRuns } from './run/getRecords.ts';
import { JobRun } from './run/types.ts';
import { Results } from '../results/Results.tsx';
import { ResultsTypes } from '../results/types.ts';

type Props = {
  job: string;
  completed: string;
};

export function JobRuns({ job, completed }: Props) {
  const [results, setResults] = useState<JobRun[] | NotFound>([]);

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
