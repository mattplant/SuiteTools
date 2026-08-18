import type { Column } from "react-data-grid";
import { LoginBundle, type Login } from "@suiteworks/suitetools-shared";
import { ResultsGrid, summaryColumn } from "../../shared/results/ResultsGrid";
import type { ResultsProps, SummaryRow } from "../../shared/results/types";

const columns: Column<Login, SummaryRow>[] = [
  summaryColumn({ key: "date", name: "Date" }, "total"),
  summaryColumn({ key: "status", name: "Status" }, "count"),
  { key: "oauthAppName", name: "OAuth Application" },
  { key: "oauthAccessTokenName", name: "OAuth Access Token" },
  { key: "userName", name: "User" },
  { key: "roleName", name: "Role" },
];

export function RecordResults({ rows, setId, setOpenModal }: ResultsProps): React.JSX.Element {
  LoginBundle.assertMany(rows);
  return <ResultsGrid columns={columns} rows={rows} setId={setId} setOpenModal={setOpenModal} />;
}
