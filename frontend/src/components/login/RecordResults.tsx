import { useMemo, useRef } from 'react';
import DataGrid, { type DataGridHandle } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import { Export } from '../results/Export.tsx';
import { ResultsProps, SummaryRow } from '../results/types.ts';
import { assertIsLogins } from './types.ts';

const columns = [
  {
    key: 'date',
    name: 'Date',
    renderSummaryCell() {
      return <strong>Total</strong>;
    },
  },
  {
    key: 'status',
    name: 'Status',
    renderSummaryCell({ row }: { row: SummaryRow }) {
      return `${row.totalCount} records`;
    },
  },
  { key: 'oauthappname', name: 'OAuth Application' },
  { key: 'oauthaccesstokenname', name: 'OAuth Access Token' },
  { key: 'username', name: 'User' },
  { key: 'rolename', name: 'Role' },
];

export function RecordResults({ rows, setId, setOpenModal }: ResultsProps) {
  assertIsLogins(rows);
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
