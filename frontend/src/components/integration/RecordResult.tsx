import { Button } from 'flowbite-react';
import { Integration } from './types';
import { addIntegrationLastLogin } from './getRecord';
import { useAppSettingsContext } from '../AppSettingsContext';

type Props = {
  data: Integration;
  modal?: boolean;
};

export function IntegrationResult({ data, modal }: Props) {
  const { settings } = useAppSettingsContext();
  const appScriptUrl = settings?.appUrl;
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
        <Button.Group>
          <Button onClick={() => window.open(data.urlNs, '_blank')}>View Integration Record</Button>
          <Button onClick={() => appScriptUrl && window.open(appScriptUrl + data.urlDetail, '_blank')}>
            View Integration Details
          </Button>
        </Button.Group>
      )}
    </>
  );
}
