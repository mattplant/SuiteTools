import type { Column } from "react-data-grid";
import { FileBundle, type File } from "@suiteworks/suitetools-shared";
import { ResultsGrid, summaryColumn } from "../../shared/results/ResultsGrid";
import type { ResultsProps, SummaryRow } from "../../shared/results/types";

function formatFileDate(value: Date | string | undefined): string {
  if (value instanceof Date) {
    return value.toLocaleString();
  }
  return value ? String(value) : "";
}

const columns: Column<File, SummaryRow>[] = [
  summaryColumn({ key: "id", name: "ID" }, "total"),
  summaryColumn({ key: "folder", name: "Folder" }, "count"),
  {
    key: "dateCreated",
    name: "Created Date",
    renderCell({ row }) {
      return formatFileDate(row.dateCreated);
    },
  },
  {
    key: "lastModifiedDate",
    name: "Last Modified Date",
    renderCell({ row }) {
      return formatFileDate(row.lastModifiedDate);
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
