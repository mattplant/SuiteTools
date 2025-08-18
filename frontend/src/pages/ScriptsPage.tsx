import { useEffect, useState } from 'react';
import type { CriteriaFields } from '../components/shared/criteria/types';
import { getScript } from '../components/features/script/getRecord';
import { getScripts } from '../components/features/script/getRecords';
import type { Scripts } from '@suiteworks/suitetools-shared';
import { RecordCriteria } from '../components/features/script/RecordCriteria';
import { Results } from '../components/shared/results/Results';
import { ResultsTypes } from '../components/shared/results/types';

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
  const [results, setResults] = useState<Scripts>([]);

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
