import { User } from './types';

type Props = {
  data: User;
};

export function UserResult({ data }: Props) {
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
      {/* <Button.Group>
        <Button onClick={() => window.open(data.urlNs, '_blank')}>View User Record</Button>
        <Button onClick={() => appScriptUrl && window.open(appScriptUrl + data.urlUser, '_blank')}>
          View User Details
        </Button>
      </Button.Group> */}
    </>
  );
}
