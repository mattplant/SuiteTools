// SPDX-License-Identifier: GPL-3.0-or-later

import type { Column } from "react-data-grid";
import { RoleBundle, type Role } from "@suiteworks/suitetools-shared";
import { ResultsGrid, summaryColumn } from "../../shared/results/ResultsGrid";
import type { ResultsProps, SummaryRow } from "../../shared/results/types";

const columns: Column<Role, SummaryRow>[] = [
  summaryColumn({ key: "id", name: "ID" }, "total"),
  summaryColumn(
    { key: "isInactive", name: "Active (ID)", renderCell: ({ row }) => (!row.isInactive ? "Yes" : "No") },
    "count",
  ),
  { key: "name", name: "Name" },
  { key: "centerType", name: "Center Type" },
  { key: "isSalesRole", name: "Sales Role", renderCell: ({ row }) => (row.isSalesRole ? "Yes" : "No") },
  { key: "isSupportRole", name: "Support Role", renderCell: ({ row }) => (row.isSupportRole ? "Yes" : "No") },
  {
    key: "isWebServiceOnlyRole",
    name: "Web Service Only Role",
    renderCell: ({ row }) => (row.isWebServiceOnlyRole ? "Yes" : "No"),
  },
];

export function RecordResults({ rows, setId, setOpenModal }: ResultsProps): React.JSX.Element {
  RoleBundle.assertMany(rows);
  return <ResultsGrid columns={columns} rows={rows} setId={setId} setOpenModal={setOpenModal} />;
}
