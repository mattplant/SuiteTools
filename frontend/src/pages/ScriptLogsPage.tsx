import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CriteriaFields } from '../components/criteria/types.ts';
import { getScriptLogs } from '../components/scriptLog/getRecords.ts';
import { ScriptLog } from '../components/scriptLog/types.ts';
import { RecordsCriteria } from '../components/scriptLog/RecordsCriteria.tsx';
import { RecordsResults } from '../components/scriptLog/RecordsResults.tsx';

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
    async function fetchData() {
      try {
        const data = await getScriptLogs(criteria);
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
      <h2 className="text-xl font-bold text-slate-900 mb-2">Sever Script Logs</h2>
      <RecordsCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      <RecordsResults lines={results} />
    </div>
  );
}
