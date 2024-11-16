import { useEffect, useState } from 'react';
import { CriteriaFields } from '../../components/search/criteria/types.ts';
import { getScriptLogs } from './getScriptLogs.ts';
import { ScriptLogsLine } from './types.ts';
import { ScriptLogsCriteria } from './ScriptLogsCriteria.tsx';
import { ScriptLogsResults } from './ScriptLogsResults.tsx';

export function ScriptLogsPage() {
  const [criteria, setCriteria] = useState<CriteriaFields>({
    rows: 50,
    level: ['ERROR', 'EMERGENCY', 'SYSTEM'],
    user: '0',
    scripttype: [''],
    owner: [''],
    date: '15',
  });
  const [results, setResults] = useState<ScriptLogsLine[]>([]);

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
      <ScriptLogsCriteria setCriteria={setCriteria} />
      <ScriptLogsResults lines={results} />
    </div>
  );
}
