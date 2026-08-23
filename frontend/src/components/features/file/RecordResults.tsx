// SPDX-License-Identifier: GPL-3.0-or-later

import type { Column } from "react-data-grid";
import { FileBundle, type File } from "@suiteworks/suitetools-shared";
import { ResultsGrid, summaryColumn } from "../../shared/results/ResultsGrid";
import type { ResultsProps, SummaryRow } from "../../shared/results/types";

const columns: Column<File, SummaryRow>[] = [
  summaryColumn({ key: "id", name: "ID" }, "total"),
  summaryColumn({ key: "folder", name: "Folder" }, "count"),
  {
    key: "dateCreated",
    name: "Created Date",
    renderCell({ row }) {
      return row.dateCreated.toLocaleString();
    },
  },
  {
    key: "lastModifiedDate",
    name: "Last Modified Date",
    renderCell({ row }) {
      return row.lastModifiedDate.toLocaleString();
    },
  },
  { key: "fileTypeName", name: "Type" },
  { key: "name", name: "Name" },
  { key: "fileSize", name: "File Size" },
  { key: "description", name: "Description" },
  { key: "url", name: "URL" },
];

export function RecordResults({ rows, setId, setOpenModal }: ResultsProps): React.JSX.Element {
  FileBundle.assertMany(rows);
  return <ResultsGrid columns={columns} rows={rows} setId={setId} setOpenModal={setOpenModal} />;
}
