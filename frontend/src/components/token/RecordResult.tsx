import { Token } from './types';

type Props = {
  data: Token;
};

export function RecordResult({ data }: Props) {
  return (
    <>
      <p>
        <b>ID</b>: {data.id}
      </p>
      <p>
        <b>Token Name</b>: {data.name}
      </p>
      <p>
        <b>Integration</b>: {data.application}
      </p>
      <p>
        <b>User</b>: {data.user}
      </p>
      <p>
        <b>Role</b>: {data.role}
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
      {/* <Button.Group>
        <Button onClick={() => window.open(data.urlNs, '_blank')}>View Integration Record</Button>
        <Button onClick={() => appScriptUrl && window.open(appScriptUrl + data.urlDetail, '_blank')}>
          View Integration Details
        </Button>
      </Button.Group> */}
    </>
  );
}
