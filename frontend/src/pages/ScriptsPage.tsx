import type { CriteriaFields } from '../components/shared/criteria/types';
import { getScriptModalData } from '../adapters/api/script';
import { getScripts } from '../adapters/api/scripts';
import { RecordCriteria } from '../components/features/script/RecordCriteria';
import { Results } from '../components/shared/results/Results';
import { ResultsTypes } from '../components/shared/results/types';
import { useEntityList } from '../hooks/useEntityList';

/**
 * ScriptsPage component displays the scripts list and criteria filter.
 * @returns The rendered ScriptsPage component.
 */
export function ScriptsPage(): React.ReactElement {
  const defaultCriteria: CriteriaFields = {
    active: '',
    files: [''],
    owners: [''],
    scriptTypes: [''],
    scriptNames: [''],
    versions: [''],
  };

  const { setCriteria, results } = useEntityList({
    defaultCriteria,
    fetchList: getScripts,
  });

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Scripts</h2>
      <RecordCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      <Results type={ResultsTypes.SCRIPT} lines={results} getModalData={getScriptModalData} />
    </div>
  );
}
