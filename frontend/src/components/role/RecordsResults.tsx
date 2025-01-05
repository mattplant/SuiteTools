import { useMemo } from 'react';
import 'react-data-grid/lib/styles.css';
import DataGrid from 'react-data-grid';
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

  const summaryRows = useMemo((): readonly SummaryRow[] => {
    return [
      {
        id: 'total_0',
        totalCount: rows.length,
      },
    ];
  }, [rows]);

  return (
    <DataGrid
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
  );
}
