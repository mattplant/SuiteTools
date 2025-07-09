import { Button, ButtonGroup } from 'flowbite-react';
import { User } from './types';
import { useAppSettingsContext } from '../AppSettingsContext';

type Props = {
  data: User;
  modal?: boolean;
};

export function UserResult({ data, modal }: Props) {
  const { settings } = useAppSettingsContext();
  const appScriptUrl = settings?.appUrl;

  return (
    <>
      <p>
        <b>ID</b>: {data.id}
      </p>
      <p>
        <b>Name</b>: {data.name}
      </p>
      <p>
        <b>Active</b>: {data.isinactive}
      </p>
      <p>
        <b>Email</b>: {data.email}
      </p>
      <p>
        <b>Supervisor</b>: {data.supervisor}
      </p>
      <p>
        <b>Title</b>: {data.title}
      </p>
      <p>
        <b>Last Login</b>: {data.lastLogin}
      </p>
      <p>
        <b>Role(s)</b>: {data.role_names}
      </p>
      {modal && (
        <ButtonGroup>
          <Button onClick={() => window.open(data.urlNs, '_blank')}>View Employee Record</Button>
          <Button onClick={() => appScriptUrl && window.open(appScriptUrl + data.urlDetail, '_blank')}>
            View User Details
          </Button>
        </ButtonGroup>
      )}
    </>
  );
}
