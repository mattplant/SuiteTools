import { Button } from 'flowbite-react';
import { exportToCsv } from '../ui/exportUtils';
import 'react-data-grid/lib/styles.css';
import { type DataGridHandle } from 'react-data-grid';

type Props = {
  // `useRef<DataGridHandle>(null)` yields `RefObject<DataGridHandle | null>` under @types/react 19,
  // where `RefObject<T>` became non-nullable. The null has to be admitted here.
  gridRef: React.RefObject<DataGridHandle | null>;
  modal?: boolean;
};

export function Export({ gridRef }: Props) {
  const handleExportToCsv = () => {
    exportToCsv(gridRef.current!.element!, 'export.csv');
  };

  return <Button onClick={() => handleExportToCsv()}>Export to CSV</Button>;
}
