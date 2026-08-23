// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Renders the results grid registered for a given entity type.
 *
 * @fileoverview
 * A one-line lookup into `resultsRegistry`, kept as its own module because it is the seam
 * `Results.test.tsx` mocks to exercise modal lifecycle without mounting a real grid. Also the one
 * place the registry `title` becomes the grid's accessible name (#109).
 *
 * @remarks
 * Private to this directory. Typed on `ResultsTypes` rather than `string`, which is what removed
 * the `|| ErrorMessage` fallback this file used to need.
 *
 * @see registry.tsx – the per-entity table this reads grids from
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import { resultsRegistry } from "./registry";
import type { ResultsProps, ResultsTypes } from "./types";

/**
 * Renders the results grid registered for the given entity type.
 * @param root0 - The props object.
 * @param root0.type - Which entity's grid to render.
 * @param root0.rows - The rows to display; the grid asserts them against its own bundle.
 * @param root0.setId - Selects a record id when a row is opened.
 * @param root0.setOpenModal - Opens the detail modal.
 * @returns The rendered grid.
 */
export function DynamicResultsRenderer({
  type,
  rows,
  setId,
  setOpenModal,
}: { type: ResultsTypes } & Omit<ResultsProps, "label">): React.JSX.Element {
  const { Grid, title } = resultsRegistry[type];
  // The grid's accessible name comes from the registry rather than the call site, so the eleven
  // names are written once next to the modal headings they match.
  return <Grid rows={rows} setId={setId} setOpenModal={setOpenModal} label={title} />;
}
