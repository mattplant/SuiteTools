import type { CriteriaFields } from '../components/shared/criteria/types';
import { getFile } from '../adapters/api/file';
import { getFiles } from '../adapters/api/files';
import { RecordCriteria } from '../components/features/file/RecordCriteria';
import { Results } from '../components/shared/results/Results';
import { ResultsTypes } from '../components/shared/results/types';
import { useEntityList } from '../hooks/useEntityList';

/**
 * FilesPage component displays the files list and criteria filter.
 * @returns The rendered FilesPage component.
 */
export function FilesPage(): React.ReactElement {
  const defaultCriteria: CriteriaFields = {
    rows: 50,
    fileTypes: [''],
    dateCreated: '0',
    lastModifiedDate: 'today',
  };

  const { setCriteria, results } = useEntityList({
    defaultCriteria,
    fetchList: getFiles,
  });

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Files</h2>
      <RecordCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      <Results type={ResultsTypes.FILE} lines={results} getModalData={getFile} />
    </div>
  );
}
