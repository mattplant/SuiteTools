import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CriteriaFields } from '../../components/search/criteria/types.ts';
import { getScriptLogs } from './getScriptLogs.ts';
import { ScriptLog } from './types.ts';
import { ScriptLogsCriteria } from './ScriptLogsCriteria.tsx';
import { ScriptLogsResults } from './ScriptLogsResults.tsx';

export function ScriptLogsPage() {
  const defaultCriteria: CriteriaFields = {
    rows: 50,
    level: ['ERROR', 'EMERGENCY', 'SYSTEM'],
    // user: [''],
    scripttype: [''],
    scriptname: [''],
    owner: [''],
    createddate: '15',
    title: '',
    detail: '',
  };
  // if a script param was passed in, set the scriptname criteria
  const { script } = useParams();
  if (script) {
    defaultCriteria.scriptname = [script]; // set the script to see logs for
    defaultCriteria.level = ['']; // clear the level criteria
  }
  const [criteria, setCriteria] = useState<CriteriaFields>(defaultCriteria);
  const [results, setResults] = useState<ScriptLog[]>([]);

  useEffect(() => {
    console.log('ScriptLogsPage useEffect');
    async function fetchData() {
      try {
        const data = await getScriptLogs(criteria);
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
      <h2 className="text-xl font-bold text-slate-900 mb-2">Sever Script Logs</h2>
      <ScriptLogsCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      <ScriptLogsResults lines={results} />
    </div>
  );
}
