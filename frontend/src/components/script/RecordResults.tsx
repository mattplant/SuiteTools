import { useMemo, useRef } from 'react';
import DataGrid, { type DataGridHandle } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import { Export } from '../results/Export.tsx';
import { ResultsProps, SummaryRow } from '../results/types.ts';
import { assertIsScripts } from './types.ts';

const columns = [
  {
    key: 'id',
    name: 'ID',
    renderSummaryCell() {
      return <strong>Total</strong>;
    },
  },
  {
    key: 'isinactive',
    name: 'Active',
    renderSummaryCell({ row }: { row: SummaryRow }) {
      return `${row.totalCount} records`;
    },
  },
  { key: 'apiversion', name: 'API' },
  { key: 'scripttype', name: 'Script Type' },
  { key: 'name', name: 'Script' },
  { key: 'scriptid', name: 'id' },
  { key: 'owner', name: 'Owner' },
  { key: 'scriptfile', name: 'File' },
  { key: 'notifyemails', name: 'Notify Emails' },
  { key: 'description', name: 'Description' },
];

export function RecordResults({ rows, setId, setOpenModal }: ResultsProps) {
  assertIsScripts(rows);
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
