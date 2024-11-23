import { useEffect, useState } from 'react';
import { CriteriaFields } from '../../components/search/criteria/types.ts';
import { getFiles } from './getFiles.ts';
import { File } from './types.ts';
import { FilesCriteria } from './FilesCriteria.tsx';
import { FilesResults } from './FilesResults.tsx';

export function FilesPage() {
  const [criteria, setCriteria] = useState<CriteriaFields>({
    rows: 50,
    filetype: [''],
    createddate: 'today',
    lastmodifieddate: 'today',
  });
  const [results, setResults] = useState<File[]>([]);

  useEffect(() => {
    console.log('FilesPage useEffect');

    async function fetchData() {
      try {
        const data = await getFiles(criteria);
        setResults(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();

    return () => {
      console.log('FilesPage useEffect cleanup');
    };
  }, [criteria]);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Files</h2>
      <FilesCriteria setCriteria={setCriteria} />
      <FilesResults lines={results} />
    </div>
  );
}
