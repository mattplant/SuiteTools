import { useEffect, useState } from 'react';
import { CriteriaFields } from '../../components/search/criteria/types';
import { getScripts } from './getScripts.ts';
import { Script } from './types.ts';
import { ScriptsCriteria } from './ScriptsCriteria.tsx';
import { ScriptsResults } from './ScriptsResults.tsx';

export function ScriptsPage() {
  const defaultCriteria: CriteriaFields = {
    active: '',
    file: [''],
    owner: [''],
    scripttype: [''],
    scriptname: [''],
    version: [''],
  };
  const [criteria, setCriteria] = useState<CriteriaFields>(defaultCriteria);
  const [results, setResults] = useState<Script[]>([]);

  useEffect(() => {
    console.log('ScriptsPage useEffect');
    async function fetchData() {
      try {
        const data = await getScripts(criteria);
        setResults(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();

    return () => {
      console.log('ScriptsPage useEffect cleanup');
    };
  }, [criteria]);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Scripts</h2>
      <ScriptsCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      <ScriptsResults lines={results} />
    </div>
  );
}
