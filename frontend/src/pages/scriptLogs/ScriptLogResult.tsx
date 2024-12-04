import { ScriptLog } from './types';

type Props = {
  data: ScriptLog;
};

export function ScriptLogResult({ data }: Props) {
  return (
    <>
      <p>
        <b>ID</b>: {data.id}
      </p>
      <p>
        <b>Timestamp</b>: {data.timestamp}
      </p>
      <p>
        <b>Type</b>: {data.type}
      </p>
      <p>
        <b>Script Type</b>: {data.scripttype}
      </p>
      <p>
        <b>Owner</b>: {data.owner}
      </p>
      <p>
        <b>Name</b>: {data.scriptname}
      </p>
      <p>
        <b>Title</b>: {data.title}
      </p>
      <p>
        <b>Detail</b>: {data.detail}
      </p>
      {/* <Button.Group>
        <Button onClick={() => window.open(data.urlNs, '_blank')}>View ScriptLog Record</Button>
        <Button onClick={() => appScriptUrl && window.open(appScriptUrl + data.urlScriptLog, '_blank')}>
          View Script Log Details
        </Button>
      </Button.Group> */}
    </>
  );
}
