import { useMemo } from 'react';
import 'react-data-grid/lib/styles.css';
import DataGrid from 'react-data-grid';
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
  { key: 'script', name: 'Script' },
  { key: 'scriptid', name: 'id' },
  { key: 'owner', name: 'Owner' },
  { key: 'scriptfile', name: 'File' },
  { key: 'notifyemails', name: 'Notify Emails' },
  { key: 'description', name: 'Description' },
];

export function RecordsResults({ rows, setId, setOpenModal }: ResultsProps) {
  assertIsScripts(rows);

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
    />
  );
}
