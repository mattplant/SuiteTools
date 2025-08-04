import { useEffect, useState } from 'react';
import { CriteriaFields } from '../components/shared/criteria/types.ts';
import { getScript } from '../components/features/script/getRecord.ts';
import { getScripts } from '../components/features/script/getRecords.ts';
import { Script } from '../components/features/script/types.ts';
import { RecordCriteria } from '../components/features/script/RecordCriteria.tsx';
import { Results } from '../components/shared/results/Results.tsx';
import { ResultsTypes } from '../components/shared/results/types.ts';

export function ScriptsPage() {
  const defaultCriteria: CriteriaFields = {
    active: '',
    files: [''],
    owners: [''],
    scripttypes: [''],
    scriptnames: [''],
    versions: [''],
  };
  const [criteria, setCriteria] = useState<CriteriaFields>(defaultCriteria);
  const [results, setResults] = useState<Script[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getScripts(criteria);
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
      <h2 className="text-xl font-bold text-slate-900 mb-2">Scripts</h2>
      <RecordCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      <Results type={ResultsTypes.SCRIPT} lines={results} getModalData={getScript} />
    </div>
  );
}
