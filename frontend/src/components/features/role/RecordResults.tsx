// SPDX-License-Identifier: GPL-3.0-or-later

import { useMemo, useRef } from 'react';
import { DataGrid } from 'react-data-grid';
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
    renderSummaryCell(): React.JSX.Element {
      return <strong>Total</strong>;
    },
  },
  {
    key: 'isInactive',
    name: 'Active (ID)',
    renderCell: ({ row }) => (!row.isInactive ? 'Yes' : 'No'),
    renderSummaryCell: ({ row }: { row: { totalCount: number } }) => `${row.totalCount} records`,
  },
  { key: 'name', name: 'Name' },
  {
    key: 'centerType',
    name: 'Center Type',
  },
  {
    key: 'isSalesRole',
    name: 'Sales Role',
    renderCell: ({ row }) => (row.isSalesRole ? 'Yes' : 'No'),
  },
  {
    key: 'isSupportRole',
    name: 'Support Role',
    renderCell: ({ row }) => (row.isSupportRole ? 'Yes' : 'No'),
  },
  {
    key: 'isWebServiceOnlyRole',
    name: 'Web Service Only Role',
    renderCell: ({ row }) => (row.isWebServiceOnlyRole ? 'Yes' : 'No'),
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
export function RecordResults({ rows, setId, setOpenModal }: ResultsProps): React.JSX.Element {
  RoleBundle.assertMany(rows);
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
