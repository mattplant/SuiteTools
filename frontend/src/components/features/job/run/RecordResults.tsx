// SPDX-License-Identifier: GPL-3.0-or-later

import type { Column } from "react-data-grid";
import { JobRunBundle, type JobRun } from "@suiteworks/suitetools-shared";
import { ResultsGrid, summaryColumn } from "../../../shared/results/ResultsGrid";
import type { ResultsProps, SummaryRow } from "../../../shared/results/types";

const columns: Column<JobRun, SummaryRow>[] = [
  summaryColumn({ key: "id", name: "Id" }, "total"),
  summaryColumn({ key: "jobName", name: "Job Name" }, "count"),
  { key: "created", name: "Created At" },
  { key: "completed", name: "Completed", renderCell: ({ row }) => (row.completed ? "Yes" : "No") },
  { key: "results", name: "Results" },
];

export function RecordResults({ rows, setId, setOpenModal, label }: ResultsProps): React.JSX.Element {
  JobRunBundle.assertMany(rows);
  return <ResultsGrid label={label} columns={columns} rows={rows} setId={setId} setOpenModal={setOpenModal} />;
}
