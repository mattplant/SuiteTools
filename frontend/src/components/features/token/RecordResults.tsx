import type { Column } from "react-data-grid";
import { TokenBundle, type Token } from "@suiteworks/suitetools-shared";
import { ResultsGrid, summaryColumn } from "../../shared/results/ResultsGrid";
import type { ResultsProps, SummaryRow } from "../../shared/results/types";

const columns: Column<Token, SummaryRow>[] = [
  summaryColumn({ key: "id", name: "ID", width: 55 }, "total"),
  summaryColumn({ key: "state", name: "State", width: 90 }, "count"),
  { key: "name", name: "Token Name" },
  { key: "integrationName", name: "Integration" },
  { key: "userName", name: "User" },
  { key: "roleName", name: "Role" },
  { key: "dateCreated", name: "Date Created" },
  { key: "lastLogin", name: "Last Login" },
];

export function RecordResults({ rows, setId, setOpenModal }: ResultsProps): React.JSX.Element {
  TokenBundle.assertMany(rows);
  return <ResultsGrid columns={columns} rows={rows} setId={setId} setOpenModal={setOpenModal} />;
}
