// SPDX-License-Identifier: GPL-3.0-or-later

import { Button, ButtonGroup } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import type { JobRun } from "@suiteworks/suitetools-shared";
import { EntityFields, type EntityField } from "../../../shared/ui/EntityFields";

type Props = { data: JobRun; modal?: boolean };

/**
 * Renders job execution details and in-app navigation actions.
 * @param props - Component props.
 * @param props.data - Job run record to display.
 * @param [props.modal] - When true, show the execution-details action used from result modals.
 * @returns The rendered job run result.
 */
export function JobRunResult({ data, modal }: Props): React.JSX.Element {
  const navigate = useNavigate();

  const fields: EntityField[] = [
    { label: "Id", value: data.id },
    { label: "Created At", value: data.created },
    { label: "Job Name", value: data.jobName },
    { label: "Completed", value: data.completed ? "Yes" : "No" },
    { label: "Results", value: data.results },
  ];

  return (
    <>
      <EntityFields fields={fields} />
      {/* Job Details stays visible on the detail page; only Execution Details is modal-only. */}
      <ButtonGroup>
        {modal && (
          <Button
            onClick={() => {
              navigate(`/jobRun/${data.id}`);
            }}
          >
            Execution Details
          </Button>
        )}
        <Button
          onClick={() => {
            if (!Number.isFinite(data.jobId) || data.jobId <= 0) {
              console.error("[JobRunResult] missing jobId on record", data);
              return;
            }
            navigate(`/job/${data.jobId}`);
          }}
        >
          Job Details
        </Button>
      </ButtonGroup>
    </>
  );
}
