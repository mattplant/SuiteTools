import { Role } from './types';

type Props = {
  data: Role;
};

export function RoleResult({ data }: Props) {
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
      {/* <Button.Group>
        <Button onClick={() => window.open(data.urlNs, '_blank')}>View Role Record</Button>
        <Button onClick={() => appScriptUrl && window.open(appScriptUrl + data.urlRole, '_blank')}>
          View Role Details
        </Button>
      </Button.Group> */}
    </>
  );
}
