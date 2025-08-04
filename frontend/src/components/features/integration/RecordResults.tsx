import { useMemo, useRef } from 'react';
import DataGrid, { type DataGridHandle } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import { Export } from '../../shared/results/Export.tsx';
import { ResultsProps, SummaryRow } from '../../shared/results/types.ts';
import { assertIsIntegrations } from './types.ts';

const columns = [
  {
    key: 'id',
    name: 'ID',
    width: 55,
    renderSummaryCell() {
      return <strong>Total</strong>;
    },
  },
  {
    key: 'state',
    name: 'State',
    width: 90,
    renderSummaryCell({ row }: { row: SummaryRow }) {
      return `${row.totalCount} records`;
    },
  },
  { key: 'name', name: 'Integration' },
  { key: 'applicationId', name: 'Integration ID' },
  { key: 'dateCreated', name: 'Date Created' },
  { key: 'lastLogin', name: 'Last Login' },
];

export function RecordResults({ rows, setId, setOpenModal }: ResultsProps) {
  assertIsIntegrations(rows);
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
