import { useEffect, useState } from 'react';
import type { CriteriaFields } from '../components/shared/criteria/types';
import { getFile } from '../adapters/api/file';
import { getFiles } from '../adapters/api/files';
import type { Files } from '@suiteworks/suitetools-shared';
import { RecordCriteria } from '../components/features/file/RecordCriteria';
import { Results } from '../components/shared/results/Results';
import { ResultsTypes } from '../components/shared/results/types';
import { useErrorBoundaryTrigger } from '../hooks/useErrorBoundaryTrigger';
import { handleError, toArray } from '@suiteworks/suitetools-shared';

/**
 * FilesPage component displays the files list and criteria filter.
 * @returns The rendered FilesPage component.
 */
export function FilesPage(): React.ReactElement {
  const triggerError = useErrorBoundaryTrigger();

  const defaultCriteria: CriteriaFields = {
    rows: 50,
    filetypes: [''],
    createddate: '0',
    lastmodifieddate: 'today',
  };

  const [criteria, setCriteria] = useState<CriteriaFields>(defaultCriteria);
  const [results, setResults] = useState<Files>([]);

  useEffect(() => {
    let ignore = false;

    async function fetchData(): Promise<void> {
      try {
        const data = await getFiles(criteria);
        const normalized = toArray<Files[number]>(data);
        if (!ignore) {
          setResults(normalized);
        }
      } catch (err) {
        if (!ignore) {
          setResults([]);
        }
        handleError(err, { reactTrigger: triggerError });
      }
    }

    fetchData();
    return (): void => {
      ignore = true;
    };
  }, [criteria, triggerError]);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Files</h2>
      <RecordCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      <Results type={ResultsTypes.FILE} lines={results} getModalData={getFile} />
    </div>
  );
}
