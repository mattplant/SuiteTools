// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Export-to-CSV button for a results grid.
 *
 * @fileoverview
 * Reads the rendered grid element off a `DataGridHandle` ref and hands it to `exportToCsv`.
 * Exports what the grid currently shows, including sort order, not the underlying data set.
 *
 * @remarks
 * Rendered by `ResultsGrid`, and separately by the two concurrency grids that do not use it (#96).
 *
 * @see ../ui/exportUtils.tsx – the CSV serialisation
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import { Button } from "flowbite-react";
import { exportToCsv } from "../ui/exportUtils";
import "react-data-grid/lib/styles.css";
import type { DataGridHandle } from "react-data-grid";

type Props = {
  // `useRef<DataGridHandle>(null)` yields `RefObject<DataGridHandle | null>` under @types/react 19,
  // where `RefObject<T>` became non-nullable. The null has to be admitted here.
  gridRef: React.RefObject<DataGridHandle | null>;
  modal?: boolean;
};

export function Export({ gridRef }: Props) {
  const handleExportToCsv = () => {
    // The grid element is absent until the DataGrid has mounted; exporting before
    // then is a no-op rather than a TypeError.
    const gridElement = gridRef.current?.element;
    if (!gridElement) return;

    exportToCsv(gridElement, "export.csv");
  };

  return <Button onClick={() => handleExportToCsv()}>Export to CSV</Button>;
}
