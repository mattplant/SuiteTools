// SPDX-License-Identifier: GPL-3.0-or-later

import { Button, ButtonGroup } from "flowbite-react";
import type { Job } from "@suiteworks/suitetools-shared";
import { handleError, UnexpectedError } from "@suiteworks/suitetools-shared";
import { initiateJob } from "../../../adapters/api/job";
import { openAppPage, getAppBaseUrl } from "../../../utils/navigation";
import { getIntegrations } from "../../../adapters/api/integrations";
import { getTokens } from "../../../adapters/api/tokens";
import { useErrorBoundaryTrigger } from "../../../hooks/useErrorBoundaryTrigger";
import { EntityFields, type EntityField } from "../../shared/ui/EntityFields";

type Props = { data: Job; modal?: boolean };

type LastLoginEntity = { type: string; name: string };

/**
 * Pure presentation of a Job entity, plus the action that initiates a run.
 * @param props - Component props.
 * @param props.data - The job data to display.
 * @param [props.modal] - Whether to display modal actions.
 * @returns The rendered job result component.
 */
export function JobResult({ data, modal }: Props): React.JSX.Element {
  const triggerError = useErrorBoundaryTrigger();

  const initiateJobClick = async () => {
    const entityRecords: LastLoginEntity[] = [];

    // Last Logins job needs the entity list (integrations + tokens) as Map/Reduce input.
    // If scrape fails or returns empty, the backend falls back to LoginAudit distinct names.
    if (Number(data.id) === 2) {
      try {
        const [integrations, tokens] = await Promise.all([getIntegrations({ active: "" }), getTokens({ active: "" })]);
        for (const integration of integrations) {
          entityRecords.push({ type: "integration", name: integration.name });
        }
        for (const token of tokens) {
          entityRecords.push({ type: "token", name: token.name });
        }
      } catch (err) {
        // Expected environmental soft case — backend LoginAudit fallback will be used.
        console.warn("JobResult: entity scrape failed; backend LoginAudit fallback will be used", err);
      }
    }

    try {
      const responseData = await initiateJob({ id: data.id, data: entityRecords });
      if (responseData.status === 200) {
        const redirectToPage = `${getAppBaseUrl()}#/job/${data.id}`;
        window.location.href = redirectToPage;
        return;
      }
      throw new UnexpectedError("initiateJob()", `status ${responseData.status}`, { jobId: data.id });
    } catch (err) {
      handleError(err, { reactTrigger: triggerError });
    }
  };

  function formatLastRun(lastRun: Date | undefined): string {
    if (lastRun instanceof Date) {
      return lastRun.toLocaleString();
    }
    return "Never run";
  }

  const fields: EntityField[] = [
    { label: "ID", value: data.id },
    { label: "Name", value: data.name },
    { label: "Active", value: data.isInactive ? "No" : "Yes" },
    { label: "Description", value: data.description },
    { label: "Scheduled", value: data.scheduled ? "Yes" : "No" },
    { label: "Notify", value: data.notify ? "Yes" : "No" },
    { label: "Last Run", value: formatLastRun(data.lastRun) },
  ];

  return (
    <>
      <EntityFields fields={fields} />
      {modal && (
        <ButtonGroup>
          <Button onClick={() => data.urlDetail && openAppPage(data.urlDetail)}>View Job Details</Button>
          <Button onClick={initiateJobClick}>Run Job</Button>
        </ButtonGroup>
      )}
    </>
  );
}
