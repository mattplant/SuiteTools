import { useMemo, useRef } from 'react';
import DataGrid, { type DataGridHandle } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import { Export } from '../../shared/results/Export';
import type { ResultsProps, SummaryRow } from '../../shared/results/types';
import { ScriptLogBundle } from '@suiteworks/suitetools-shared';

const columns = [
  {
    key: 'type',
    name: 'Type',
    width: 75,
    renderSummaryCell() {
      return <strong>Total</strong>;
    },
  },
  {
    key: 'timestamp',
    name: 'Timestamp',
    width: 160,
    renderSummaryCell({ row }: { row: SummaryRow }) {
      return `${row.totalCount} records`;
    },
  },
  // { key: 'scripttype', name: 'Script Type', width: 120 },
  { key: 'scriptname', name: 'Script', width: 160 },
  // { key: 'owner', name: 'Owner', width: 100 },
  { key: 'title', name: 'Title' },
  { key: 'detail', name: 'Detail' },
];

export function RecordResults({ rows, setId, setOpenModal }: ResultsProps) {
  ScriptLogBundle.assertMany(rows);
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
