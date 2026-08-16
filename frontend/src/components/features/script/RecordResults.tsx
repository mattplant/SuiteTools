import { useMemo, useRef } from "react";
import { DataGrid, type DataGridHandle } from "react-data-grid";
import type { Column } from "react-data-grid";
import "react-data-grid/lib/styles.css";
import { Export } from "../../shared/results/Export";
import type { ResultsProps, SummaryRow } from "../../shared/results/types";
import { ScriptBundle } from "@suiteworks/suitetools-shared";
import type { Script } from "@suiteworks/suitetools-shared";

const columns: Column<Script, SummaryRow>[] = [
  {
    key: "id",
    name: "ID",
    renderSummaryCell() {
      return <strong>Total</strong>;
    },
  },
  {
    key: "isInactive",
    name: "Active",
    // The column reads "Active", so negate the stored flag rather than printing it raw. This one
    // was already reading wrong before the cleaner change -- an active script showed "false".
    renderCell: ({ row }) => (row.isInactive ? "No" : "Yes"),
    renderSummaryCell({ row }: { row: SummaryRow }) {
      return `${row.totalCount} records`;
    },
  },
  { key: "apiVersion", name: "API" },
  { key: "scriptType", name: "Script Type" },
  { key: "name", name: "Script" },
  { key: "scriptId", name: "id" },
  { key: "owner", name: "Owner" },
  { key: "scriptFile", name: "File" },
  { key: "notifyEmails", name: "Notify Emails" },
  { key: "description", name: "Description" },
];

export function RecordResults({ rows, setId, setOpenModal }: ResultsProps) {
  ScriptBundle.assertMany(rows);
  const gridRef = useRef<DataGridHandle>(null);
  const summaryRows = useMemo((): readonly SummaryRow[] => {
    return [{ id: "total_0", totalCount: rows.length }];
  }, [rows]);

  return (
    <>
      <Export gridRef={gridRef} />
      <div style={{ height: "600px", overflowY: "auto" }}>
        <DataGrid
          ref={gridRef}
          columns={columns}
          rows={rows}
          defaultColumnOptions={{ sortable: true, resizable: true }}
          bottomSummaryRows={summaryRows}
          onCellClick={(cell) => {
            setId(cell.row.id);
            setOpenModal(true);
          }}
          className="fill-grid"
        />
      </div>
    </>
  );
}
