import type { CriteriaFields } from '../components/shared/criteria/types';
import { getJob } from '../adapters/api/job';
import { getJobs } from '../adapters/api/jobs';
import { RecordCriteria } from '../components/features/job/RecordCriteria';
import { Results } from '../components/shared/results/Results';
import { ResultsTypes } from '../components/shared/results/types';
import { useEntityList } from '../hooks/useEntityList';

/**
 * JobsPage component displays the jobs list and criteria filter.
 * @returns The rendered JobsPage component.
 */
export function JobsPage(): React.ReactElement {
  const defaultCriteria: CriteriaFields = {
    active: 'T',
  };

  const { setCriteria, results } = useEntityList({
    defaultCriteria,
    fetchList: getJobs,
  });

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Jobs</h2>
      <RecordCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      <Results type={ResultsTypes.JOB} lines={results} getModalData={getJob} />
    </div>
  );
}
