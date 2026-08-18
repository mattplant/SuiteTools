import type { Column } from "react-data-grid";
import { UserBundle, type User } from "@suiteworks/suitetools-shared";
import { ResultsGrid, summaryColumn } from "../../shared/results/ResultsGrid";
import type { ResultsProps, SummaryRow } from "../../shared/results/types";

const columns: Column<User, SummaryRow>[] = [
  summaryColumn({ key: "id", name: "ID", width: 90 }, "total"),
  summaryColumn(
    {
      key: "isInactive",
      name: "Active",
      width: 90,
      // The column reads "Active", so negate the stored flag rather than printing it raw.
      renderCell: ({ row }) => (row.isInactive ? "No" : "Yes"),
    },
    "count",
  ),
  { key: "name", name: "Name" },
  { key: "email", name: "Email" },
  { key: "supervisor", name: "Supervisor" },
  { key: "title", name: "Title" },
  { key: "lastLogin", name: "Last Login" },
  { key: "roleNames", name: "Role(s)" },
];

export function RecordResults({ rows, setId, setOpenModal }: ResultsProps): React.JSX.Element {
  UserBundle.assertMany(rows);
  return <ResultsGrid columns={columns} rows={rows} setId={setId} setOpenModal={setOpenModal} />;
}
