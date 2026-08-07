import { Button, ButtonGroup } from 'flowbite-react';
import type { Job } from '@suiteworks/suitetools-shared';
import { handleError, UnexpectedError } from '@suiteworks/suitetools-shared';
import { initiateJob } from '../../../adapters/api/job';
import { openAppPage, getAppBaseUrl } from '../../../utils/navigation';
import { getIntegrations } from '../../../adapters/api/integrations';
import { getTokens } from '../../../adapters/api/tokens';
import { useErrorBoundaryTrigger } from '../../../hooks/useErrorBoundaryTrigger';

type Props = {
  data: Job;
  modal?: boolean;
};

type LastLoginEntity = { type: string; name: string };

export function JobResult({ data, modal }: Props) {
  const triggerError = useErrorBoundaryTrigger();

  const initiateJobClick = async () => {
    const entityRecords: LastLoginEntity[] = [];

    // Last Logins job needs the entity list (integrations + tokens) as Map/Reduce input.
    // If scrape fails or returns empty, the backend falls back to LoginAudit distinct names.
    if (Number(data.id) === 2) {
      try {
        const [integrations, tokens] = await Promise.all([
          getIntegrations({ active: '' }),
          getTokens({ active: '' }),
        ]);
        for (const integration of integrations) {
          entityRecords.push({ type: 'integration', name: integration.name });
        }
        for (const token of tokens) {
          entityRecords.push({ type: 'token', name: token.name });
        }
      } catch (err) {
        // Expected environmental soft case — backend LoginAudit fallback will be used.
        console.warn('JobResult: entity scrape failed; backend LoginAudit fallback will be used', err);
      }
    }

    try {
      const responseData = await initiateJob({
        id: data.id,
        data: entityRecords,
      });
      if (responseData.status === 200) {
        const redirectToPage = getAppBaseUrl() + `#/job/${data.id}`;
        window.location.href = redirectToPage;
        return;
      }
      throw new UnexpectedError('initiateJob()', `status ${responseData.status}`, { jobId: data.id });
    } catch (err) {
      handleError(err, { reactTrigger: triggerError });
    }
  };

  function formatLastRun(lastRun: Date | undefined): string {
    if (lastRun instanceof Date) {
      return lastRun.toLocaleString();
    }
    return 'Never run';
  }

  return (
    <>
      <p>
        <b>ID</b>: {data.id}
      </p>
      <p>
        <b>Name</b>: {data.name}
      </p>
      <p>
        <b>Active</b>: {data.isInactive ? 'No' : 'Yes'}
      </p>
      <p>
        <b>Description</b>: {data.description}
      </p>
      <p>
        <b>Scheduled</b>: {data.scheduled ? 'Yes' : 'No'}
      </p>
      <p>
        <b>Notify</b>: {data.notify ? 'Yes' : 'No'}
      </p>
      <p>
        <b>Last Run</b>: {formatLastRun(data.lastRun)}
      </p>
      {modal && (
        <ButtonGroup>
          <Button onClick={() => data.urlDetail && openAppPage(data.urlDetail)}>View Job Details</Button>
          <Button onClick={initiateJobClick}>Run Job</Button>
        </ButtonGroup>
      )}
    </>
  );
}
