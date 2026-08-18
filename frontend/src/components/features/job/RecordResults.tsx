import type { Column } from "react-data-grid";
import { JobBundle, type Job } from "@suiteworks/suitetools-shared";
import { ResultsGrid, summaryColumn } from "../../shared/results/ResultsGrid";
import type { ResultsProps, SummaryRow } from "../../shared/results/types";

const columns: Column<Job, SummaryRow>[] = [
  summaryColumn({ key: "id", name: "ID" }, "total"),
  summaryColumn({ key: "name", name: "Name" }, "count"),
  { key: "config", name: "Config" },
  { key: "description", name: "Description" },
];

export function RecordResults({ rows, setId, setOpenModal }: ResultsProps): React.JSX.Element {
  JobBundle.assertMany(rows);
  return <ResultsGrid columns={columns} rows={rows} setId={setId} setOpenModal={setOpenModal} />;
}
