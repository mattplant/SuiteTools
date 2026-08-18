import type { Column } from "react-data-grid";
import { ScriptLogBundle, type ScriptLog } from "@suiteworks/suitetools-shared";
import { ResultsGrid, summaryColumn } from "../../shared/results/ResultsGrid";
import type { ResultsProps, SummaryRow } from "../../shared/results/types";

const columns: Column<ScriptLog, SummaryRow>[] = [
  summaryColumn({ key: "type", name: "Type", width: 75 }, "total"),
  summaryColumn({ key: "timestamp", name: "Timestamp", width: 160 }, "count"),
  // { key: 'scriptType', name: 'Script Type', width: 120 },
  { key: "scriptName", name: "Script", width: 160 },
  // { key: 'owner', name: 'Owner', width: 100 },
  { key: "title", name: "Title" },
  { key: "detail", name: "Detail" },
];

export function RecordResults({ rows, setId, setOpenModal }: ResultsProps): React.JSX.Element {
  ScriptLogBundle.assertMany(rows);
  return <ResultsGrid columns={columns} rows={rows} setId={setId} setOpenModal={setOpenModal} />;
}
