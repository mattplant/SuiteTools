import { useParams } from "react-router-dom";
import type { CriteriaFields } from "../components/shared/criteria/types";
import { getScriptLog } from "../adapters/api/scriptLog";
import { getScriptLogs } from "../adapters/api/scriptLogs";
import { RecordCriteria } from "../components/features/scriptLog/RecordCriteria";
import { Results } from "../components/shared/results/Results";
import { ResultsTypes } from "../components/shared/results/types";
import { useEntityList } from "../hooks/useEntityList";

/**
 * ScriptLogsPage component displays the script logs list and criteria filter.
 * @returns The rendered ScriptLogsPage component.
 */
export function ScriptLogsPage(): React.ReactElement {
  const defaultCriteria: CriteriaFields = {
    rows: 50,
    levels: ["ERROR", "EMERGENCY", "SYSTEM"],
    scriptTypes: [""],
    scriptNames: [""],
    owners: [""],
    timeMode: "now",
    dateCreated: "15", // default to last 15 minutes
    customDateTime: undefined, // will be set by SearchCriteriaAdvancedTimePicker
    customDuration: "1", // default to 1 minute
    title: "",
    detail: "",
  };

  // if a script param was passed in, set the scriptname criteria
  const { script } = useParams();
  if (script) {
    defaultCriteria.scriptNames = [script]; // set the script to see logs for
    defaultCriteria.levels = [""]; // clear the level criteria
  }

  const { setCriteria, results } = useEntityList({ defaultCriteria, fetchList: getScriptLogs });

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Sever Script Logs</h2>
      <RecordCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      <Results type={ResultsTypes.SCRIPTLOG} lines={results} getModalData={getScriptLog} />
    </div>
  );
}
