import { useMemo, useRef } from 'react';
import DataGrid, { type DataGridHandle } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import { Export } from '../results/Export.tsx';
import { ResultsProps, SummaryRow } from '../results/types.ts';
import { assertIsRoles } from './types.ts';

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
  { key: 'name', name: 'Name' },
  { key: 'centertype', name: 'Center Type' },
  { key: 'issalesrole', name: 'Sales Role' },
  { key: 'issupportrole', name: 'Support Role' },
  { key: 'iswebserviceonlyrole', name: 'Web Service Only Role' },
];

export function RecordsResults({ rows, setId, setOpenModal }: ResultsProps) {
  assertIsRoles(rows);
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
    </>
  );
}
