import { useEffect, useState } from 'react';
import type { CriteriaFields } from '../components/shared/criteria/types';
import { getFile } from '../components/features/file/getRecord';
import { getFiles } from '../components/features/file/getRecords';
import type { Files } from '@suiteworks/suitetools-shared';
import { RecordCriteria } from '../components/features/file/RecordCriteria';
import { Results } from '../components/shared/results/Results';
import { ResultsTypes } from '../components/shared/results/types';

export function FilesPage() {
  const defaultCriteria: CriteriaFields = {
    rows: 50,
    filetypes: [''],
    createddate: '0',
    lastmodifieddate: 'today',
  };
  const [criteria, setCriteria] = useState<CriteriaFields>(defaultCriteria);
  const [results, setResults] = useState<Files>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getFiles(criteria);
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
      <h2 className="text-xl font-bold text-slate-900 mb-2">Files</h2>
      <RecordCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      <Results type={ResultsTypes.FILE} lines={results} getModalData={getFile} />
    </div>
  );
}
