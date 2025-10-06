// SPDX-License-Identifier: GPL-3.0-or-later

import { useMemo, useRef } from 'react';
import DataGrid from 'react-data-grid';
import type { DataGridHandle, Column } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import { Export } from '../../shared/results/Export';
import type { ResultsProps, SummaryRow } from '../../shared/results/types';
import { RoleBundle } from '@suiteworks/suitetools-shared';
import type { Role } from '@suiteworks/suitetools-shared';

const columns: Column<Role, SummaryRow>[] = [
  {
    key: 'id',
    name: 'ID',
    renderSummaryCell(): JSX.Element {
      return <strong>Total</strong>;
    },
  },
  {
    key: 'isinactive',
    name: 'Active (ID)',
    renderCell: ({ row }) => (!row.isinactive ? 'Yes' : 'No'),
    renderSummaryCell: ({ row }: { row: { totalCount: number } }) => `${row.totalCount} records`,
  },
  { key: 'name', name: 'Name TEST' },
  {
    key: 'centertype',
    name: 'Center Type',
  },
  {
    key: 'issalesrole',
    name: 'Sales Role',
    renderCell: ({ row }) => (row.issalesrole ? 'Yes' : 'No'),
  },
  {
    key: 'issupportrole',
    name: 'Support Role',
    renderCell: ({ row }) => (row.issupportrole ? 'Yes' : 'No'),
  },
  {
    key: 'iswebserviceonlyrole',
    name: 'Web Service Only Role',
    renderCell: ({ row }) => (row.iswebserviceonlyrole ? 'Yes' : 'No'),
  },
];

/**
 * Displays a data grid of role records with export and modal functionality.
 * @param props - The props for the RecordResults component.
 * @param props.rows - The array of role records to display.
 * @param props.setId - Function to set the selected role ID.
 * @param props.setOpenModal - Function to control modal visibility.
 * @returns The rendered data grid component.
 */
export function RecordResults({ rows, setId, setOpenModal }: ResultsProps): JSX.Element {
  RoleBundle.assertMany(rows);
  console.log('[roles:RecordResults] rows: %o', rows);
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
