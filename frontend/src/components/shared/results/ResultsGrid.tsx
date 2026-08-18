// SPDX-License-Identifier: GPL-3.0-or-later

import { useMemo, useRef } from "react";
import { DataGrid, type Column, type DataGridHandle, type DefaultColumnOptions } from "react-data-grid";
import "react-data-grid/lib/styles.css";
import { Export } from "./Export";
import type { SummaryRow } from "./types";

const RESULTS_GRID_HEIGHT = "600px";
const DEFAULT_COLUMN_OPTIONS = { sortable: true, resizable: true } as const;

type ResultsGridProps<T extends { id: number }> = {
  columns: readonly Column<T, SummaryRow>[];
  rows: readonly T[];
  setId: (id: number) => void;
  setOpenModal: (open: boolean) => void;
  /** Merged on top of sortable/resizable. Pass `minWidth` (and similar) without restating those two. */
  defaultColumnOptions?: DefaultColumnOptions<T, SummaryRow>;
};

/**
 * Shared results DataGrid shell: export, scroll wrapper, summary row, row-click → modal.
 * Feature `RecordResults` files supply only the typed columns and the bundle assertion.
 */
export function ResultsGrid<T extends { id: number }>({
  columns,
  rows,
  setId,
  setOpenModal,
  defaultColumnOptions,
}: ResultsGridProps<T>): React.JSX.Element {
  const gridRef = useRef<DataGridHandle>(null);
  const summaryRows = useMemo((): readonly SummaryRow[] => {
    return [{ id: "total_0", totalCount: rows.length }];
  }, [rows]);

  return (
    <>
      <Export gridRef={gridRef} />
      <div style={{ height: RESULTS_GRID_HEIGHT, overflowY: "auto" }}>
        <DataGrid
          ref={gridRef}
          columns={columns}
          rows={rows}
          defaultColumnOptions={{ ...DEFAULT_COLUMN_OPTIONS, ...defaultColumnOptions }}
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

/**
 * Attaches the shared summary-cell pair ("Total" / "N records") to a column definition.
 */
export function summaryColumn<T>(
  column: Omit<Column<T, SummaryRow>, "renderSummaryCell">,
  kind: "total" | "count",
): Column<T, SummaryRow> {
  return {
    ...column,
    renderSummaryCell: kind === "total" ? () => <strong>Total</strong> : ({ row }) => `${row.totalCount} records`,
  };
}
