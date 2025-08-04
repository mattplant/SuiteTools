import { useEffect, useState } from 'react';
import { CriteriaFields } from '../components/shared/criteria/types.ts';
import { getFile } from '../components/features/file/getRecord.ts';
import { getFiles } from '../components/features/file/getRecords.ts';
import { File } from '../components/features/file/types.ts';
import { RecordCriteria } from '../components/features/file/RecordCriteria.tsx';
import { Results } from '../components/shared/results/Results.tsx';
import { ResultsTypes } from '../components/shared/results/types.ts';

export function FilesPage() {
  const defaultCriteria: CriteriaFields = {
    rows: 50,
    filetypes: [''],
    createddate: '0',
    lastmodifieddate: 'today',
  };
  const [criteria, setCriteria] = useState<CriteriaFields>(defaultCriteria);
  const [results, setResults] = useState<File[]>([]);

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
