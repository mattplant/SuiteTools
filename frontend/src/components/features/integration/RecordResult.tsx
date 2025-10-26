import { Button, ButtonGroup } from 'flowbite-react';
import type { Integration } from '@suiteworks/suitetools-shared';
import { addIntegrationLastLogin } from './getRecord';
import { useAppSettingsContext } from '../../../hooks/useAppSettingsContext';
import { openAppPage, openNetSuitePage } from '../../../utils/navigation';

type Props = {
  data: Integration;
  modal?: boolean;
};

export function IntegrationResult({ data, modal }: Props) {
  const { settings } = useAppSettingsContext();
  addIntegrationLastLogin(data, settings);

  return (
    <>
      <p>
        <b>ID</b>: {data.id}
      </p>
      <p>
        <b>Name</b>: {data.name}
      </p>
      <p>
        <b>Application ID</b>: {data.applicationId}
      </p>
      <p>
        <b>State</b>: {data.state}
      </p>
      <p>
        <b>Date Created</b>: {data.dateCreated}
      </p>
      <p>
        <b>Last Login</b>: {data.lastLogin}
      </p>
      {modal && (
        <ButtonGroup>
          <Button onClick={() => data.urlNs && openNetSuitePage(data.urlNs)}>View Integration Record</Button>
          <Button onClick={() => data.urlDetail && openAppPage(data.urlDetail)}>View Integration Details</Button>
        </ButtonGroup>
      )}
    </>
  );
}
