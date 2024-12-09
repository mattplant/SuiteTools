import { useEffect, useState } from 'react';
import { CriteriaFields } from '../components/criteria/types.ts';
import { getFiles } from '../components/file/getRecords.ts';
import { File } from '../components/file/types.ts';
import { RecordsCriteria } from '../components/file/RecordsCriteria.tsx';
import { RecordsResults } from '../components/file/RecordsResults.tsx';

export function FilesPage() {
  const defaultCriteria: CriteriaFields = {
    rows: 50,
    filetype: [''],
    createddate: '',
    lastmodifieddate: 'today',
  };
  const [criteria, setCriteria] = useState<CriteriaFields>(defaultCriteria);
  const [results, setResults] = useState<File[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getFiles(criteria);
        setResults(data);
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
      <RecordsCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      <RecordsResults lines={results} />
    </div>
  );
}
