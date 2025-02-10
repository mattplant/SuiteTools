import { useMemo, useRef } from 'react';
import DataGrid, { type DataGridHandle } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import { Export } from '../results/Export.tsx';
import { ResultsProps, SummaryRow } from '../results/types.ts';
import { assertIsScriptLogs } from './types.ts';

const columns = [
  {
    key: 'id',
    name: 'ID',
    renderSummaryCell() {
      return <strong>Total</strong>;
    },
  },
  {
    key: 'timestamp',
    name: 'Time Stamp',
    renderSummaryCell({ row }: { row: SummaryRow }) {
      return `${row.totalCount} records`;
    },
  },
  { key: 'type', name: 'Type' },
  { key: 'scripttype', name: 'Script Type' },
  { key: 'scriptname', name: 'Script' },
  { key: 'owner', name: 'Owner' },
  { key: 'title', name: 'Title' },
  { key: 'detail', name: 'Detail' },
];

export function RecordResults({ rows, setId, setOpenModal }: ResultsProps) {
  assertIsScriptLogs(rows);
  const gridRef = useRef<DataGridHandle>(null);
  const summaryRows = useMemo((): readonly SummaryRow[] => {
    return [
      {
        id: 'total_0',
        totalCount: rows.length,
      },
    ];
  }, [rows]);

  return (
    <>
      <Export gridRef={gridRef} />
      <div style={{ height: '600px', overflowY: 'auto' }}>
        <DataGrid
          ref={gridRef}
          columns={columns}
          rows={rows}
          defaultColumnOptions={{
            sortable: true,
            resizable: true,
          }}
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
