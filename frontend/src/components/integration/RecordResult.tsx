import { Integration } from './types';

type Props = {
  data: Integration;
};

export function IntegrationResult({ data }: Props) {
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
      {/* <Button.Group>
        <Button onClick={() => window.open(data.urlNs, '_blank')}>View Integration Record</Button>
        <Button onClick={() => appScriptUrl && window.open(appScriptUrl + data.urlDetail, '_blank')}>
          View Integration Details
        </Button>
      </Button.Group> */}
    </>
  );
}
