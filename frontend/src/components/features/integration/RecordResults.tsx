import type { Column } from "react-data-grid";
import { IntegrationBundle, type Integration } from "@suiteworks/suitetools-shared";
import { ResultsGrid, summaryColumn } from "../../shared/results/ResultsGrid";
import type { ResultsProps, SummaryRow } from "../../shared/results/types";

const columns: Column<Integration, SummaryRow>[] = [
  summaryColumn({ key: "id", name: "ID", width: 55 }, "total"),
  summaryColumn({ key: "state", name: "State", width: 90 }, "count"),
  { key: "name", name: "Integration" },
  { key: "applicationId", name: "Integration ID" },
  { key: "dateCreated", name: "Date Created" },
  { key: "lastLogin", name: "Last Login" },
];

export function RecordResults({ rows, setId, setOpenModal }: ResultsProps): React.JSX.Element {
  IntegrationBundle.assertMany(rows);
  return <ResultsGrid columns={columns} rows={rows} setId={setId} setOpenModal={setOpenModal} />;
}
