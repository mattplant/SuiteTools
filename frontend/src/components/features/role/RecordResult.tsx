import { Button, ButtonGroup } from 'flowbite-react';
import { Role } from './types';
import { useAppSettingsContext } from '../../shared/context/AppSettingsContext';

type Props = {
  data: Role;
  modal?: boolean;
};

export function RoleResult({ data, modal }: Props) {
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
        <b>Center Type</b>: {data.centertype}
      </p>
      <p>
        <b>Sales Role</b>: {data.issalesrole}
      </p>
      <p>
        <b>Support Role</b>: {data.issupportrole}
      </p>
      <p>
        <b>Web Service Only</b>: {data.iswebserviceonlyrole}
      </p>
      {modal && (
        <ButtonGroup>
          <Button onClick={() => window.open(data.urlNs, '_blank')}>View Role Record</Button>
          <Button onClick={() => appScriptUrl && window.open(appScriptUrl + data.urlDetail, '_blank')}>
            View Role Details
          </Button>
        </ButtonGroup>
      )}
    </>
  );
}
