import type { CriteriaFields } from '../components/shared/criteria/types';
import { getJobRun } from '../adapters/api/jobRun';
import { getJobRuns } from '../adapters/api/jobRuns';
import { RecordCriteria } from '../components/features/job/run/RecordCriteria';
import { Results } from '../components/shared/results/Results';
import { ResultsTypes } from '../components/shared/results/types';
import { useEntityList } from '../hooks/useEntityList';

/**
 * JobRunsPage component displays the job runs list and criteria filter.
 * @returns The rendered JobRunsPage component.
 */
export function JobRunsPage(): React.ReactElement {
  const defaultCriteria: CriteriaFields = {
    rows: 50,
    job: '',
    completed: '',
  };

  const { setCriteria, results } = useEntityList({
    defaultCriteria,
    fetchList: getJobRuns,
  });

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Job Status</h2>
      <RecordCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      <Results type={ResultsTypes.JOBRUN} lines={results} getModalData={getJobRun} />
    </div>
  );
}
