import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { CriteriaFields } from '../components/shared/criteria/types';
import { getScriptLog } from '../components/features/scriptLog/getRecord';
import { getScriptLogs } from '../components/features/scriptLog/getRecords';
import type { ScriptLogs } from '@suiteworks/suitetools-shared';
import { RecordCriteria } from '../components/features/scriptLog/RecordCriteria';
import { Results } from '../components/shared/results/Results';
import { ResultsTypes } from '../components/shared/results/types';
import { useInlineMessage } from '../components/shared/context/MessageContext';

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
  const [results, setResults] = useState<ScriptLogs>([]);
  const { setMessage, clearMessage } = useInlineMessage();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getScriptLogs(criteria);
        if ('message' in data) {
          console.error('Error fetching script logs:', data.message);
          setMessage({ text: data.message, type: 'warning' });
        } else {
          clearMessage();
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
