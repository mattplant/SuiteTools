import { useRef } from 'react';
import DataGrid, { type DataGridHandle } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import { Export } from '../../results/Export.tsx';
import { ConcurrencyRequestData, ConcurrencyRequestRows } from './types';
import { formatDate } from '../../../utils/dates';

type Props = {
  data: ConcurrencyRequestData | undefined;
};

const columns = [
  { key: 'id', name: '#' }, // Unique ID for the request
  { key: 'startDate', name: 'Start Date' }, // Start Date and Time
  { key: 'endDate', name: 'End Date' }, // End Date and Time
  { key: 'duration', name: 'Duration' }, // Duration in seconds
  { key: 'type', name: 'Type' }, // Script Type
  // { key: 'integrationId', name: 'IntegrationId' },
  { key: 'integration', name: 'Integration' },
  { key: 'operation', name: 'Operation' }, // Operation Type
  // { key: 'scriptId', name: 'Script ID' },
  { key: 'scriptName', name: 'Script Name' },
  { key: 'status', name: 'Status' },
  // { key: 'wouldBeRejected', name: 'Would Be Rejected' },
];

export function ConcurrencyRequestResults({ data }: Props) {
  const gridRef = useRef<DataGridHandle>(null);
  const formattedResults: ConcurrencyRequestRows = [];
  if (data) {
    const results = data;
    if (results && results.length > 0) {
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const formattedResult = {
          id: i + 1, // Unique ID for the request
          startDate: formatDate(result.startDate), // Start Date and Time
          duration: (result.endDate - result.startDate) / 1000, // Duration in seconds
          endDate: formatDate(result.endDate), // End Date and Time
          type: result.type, // Script Type
          integration: result.integration, // Integration Name
          operation: result.operation, // Operation Type
          scriptName: result.scriptName, // Script Name
          status: result.status, // Request Status
          // wouldBeRejected: result.wouldBeRejected, // Would Be Rejected
        };
        formattedResults.push(formattedResult);
      }
    }
  }

  return (
    <>
      <h3 className="text-lg font-bold text-slate-900">Concurrency Requests Table</h3>
      <Export gridRef={gridRef} />
      <div style={{ height: '600px', overflowY: 'auto' }}>
        <DataGrid
          ref={gridRef}
          columns={columns}
          rows={formattedResults}
          defaultColumnOptions={{
            sortable: true,
            resizable: true,
          }}
          className="fill-grid"
        />
      </div>
    </>
  );
}
