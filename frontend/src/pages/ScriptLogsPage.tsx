import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CriteriaFields } from '../components/criteria/types.ts';
import { getScriptLog } from '../components/scriptLog/getRecord.ts';
import { getScriptLogs } from '../components/scriptLog/getRecords.ts';
import { ScriptLog } from '../components/scriptLog/types.ts';
import { RecordCriteria } from '../components/scriptLog/RecordCriteria.tsx';
import { Results } from '../components/results/Results.tsx';
import { ResultsTypes } from '../components/results/types.ts';

export function ScriptLogsPage() {
  const defaultCriteria: CriteriaFields = {
    rows: 50,
    levels: ['ERROR', 'EMERGENCY', 'SYSTEM'],
    // user: [''],
    scripttypes: [''],
    scriptnames: [''],
    owners: [''],
    timemode: 'now',
    createddate: '15', // default to last 15 minutes
    customdatetime: undefined, // will be set by SearchCriteriaAdvancedTimePicker
    customduration: '1', // default to 1 minute
    title: '',
    detail: '',
  };
  // if a script param was passed in, set the scriptname criteria
  const { script } = useParams();
  if (script) {
    defaultCriteria.scriptnames = [script]; // set the script to see logs for
    defaultCriteria.levels = ['']; // clear the level criteria
  }
  const [criteria, setCriteria] = useState<CriteriaFields>(defaultCriteria);
  const [results, setResults] = useState<ScriptLog[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getScriptLogs(criteria);
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
      <h2 className="text-xl font-bold text-slate-900 mb-2">Sever Script Logs</h2>
      <RecordCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      <Results type={ResultsTypes.SCRIPTLOG} lines={results} getModalData={getScriptLog} />
    </div>
  );
}
