import type { Column } from "react-data-grid";
import { SoapLogBundle, type SoapLog } from "@suiteworks/suitetools-shared";
import { ResultsGrid, summaryColumn } from "../../shared/results/ResultsGrid";
import type { ResultsProps, SummaryRow } from "../../shared/results/types";

const columns: Column<SoapLog, SummaryRow>[] = [
  summaryColumn({ key: "startDate", name: "Start Time" }, "total"),
  summaryColumn({ key: "duration", name: "Duration" }, "count"),
  { key: "status", name: "Status" },
  { key: "integration", name: "Integration" },
  { key: "action", name: "Action" },
  { key: "recordType", name: "Record Type" },
  { key: "user", name: "User" },
  { key: "records", name: "Records" },
  { key: "recordsFinished", name: "Finished" },
  { key: "recordsFailed", name: "Failed" },
  { key: "recordsReturned", name: "Returned" },
];

export function RecordResults({ rows, setId, setOpenModal }: ResultsProps): React.JSX.Element {
  SoapLogBundle.assertMany(rows);
  // Eleven columns: minWidth is original and deliberate. Sortable/resizable used to be overwritten
  // by this object; ResultsGrid merges them back in.
  return (
    <ResultsGrid
      columns={columns}
      rows={rows}
      setId={setId}
      setOpenModal={setOpenModal}
      defaultColumnOptions={{ minWidth: 110 }}
    />
  );
}
