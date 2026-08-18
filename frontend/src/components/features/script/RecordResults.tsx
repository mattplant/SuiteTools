import type { Column } from "react-data-grid";
import { ScriptBundle, type Script } from "@suiteworks/suitetools-shared";
import { ResultsGrid, summaryColumn } from "../../shared/results/ResultsGrid";
import type { ResultsProps, SummaryRow } from "../../shared/results/types";

const columns: Column<Script, SummaryRow>[] = [
  summaryColumn({ key: "id", name: "ID" }, "total"),
  summaryColumn(
    {
      key: "isInactive",
      name: "Active",
      // The column reads "Active", so negate the stored flag rather than printing it raw. This one
      // was already reading wrong before the cleaner change -- an active script showed "false".
      renderCell: ({ row }) => (row.isInactive ? "No" : "Yes"),
    },
    "count",
  ),
  { key: "apiVersion", name: "API" },
  { key: "scriptType", name: "Script Type" },
  { key: "name", name: "Script" },
  { key: "scriptId", name: "id" },
  { key: "owner", name: "Owner" },
  { key: "scriptFile", name: "File" },
  { key: "notifyEmails", name: "Notify Emails" },
  { key: "description", name: "Description" },
];

export function RecordResults({ rows, setId, setOpenModal }: ResultsProps): React.JSX.Element {
  ScriptBundle.assertMany(rows);
  return <ResultsGrid columns={columns} rows={rows} setId={setId} setOpenModal={setOpenModal} />;
}
