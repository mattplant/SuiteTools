import { Button, ButtonGroup } from 'flowbite-react';
import type { Token } from '@suiteworks/suitetools-shared';
import { useAppSettingsContext } from '../../../hooks/useAppSettingsContext';
import { addTokenLastLogin } from './getRecord';
import { openAppPage, openNetSuitePage } from '../../../utils/navigation';

type Props = {
  data: Token;
  modal?: boolean;
};

export function TokenResult({ data, modal }: Props) {
  const { settings } = useAppSettingsContext();
  addTokenLastLogin(data, settings);

  return (
    <>
      <p>
        <b>ID</b>: {data.id}
      </p>
      <p>
        <b>Token Name</b>: {data.name}
      </p>
      <p>
        <b>Integration</b>: {data.integrationName}
      </p>
      <p>
        <b>User</b>: {data.userName}
      </p>
      <p>
        <b>Role</b>: {data.roleName}
      </p>
      <p>
        <b>State</b>: {data.state}
      </p>
      <p>
        <b>Date Created</b>: {data.dateCreated}
      </p>
      <p>
        <b>Created By</b>: {data.createdBy}
      </p>
      {modal && (
        <ButtonGroup>
          <Button onClick={() => data.urlNs && openNetSuitePage(data.urlNs)}>View Token Record</Button>
          <Button onClick={() => data.urlDetail && openAppPage(data.urlDetail)}>View Token Details</Button>
        </ButtonGroup>
      )}
    </>
  );
}
