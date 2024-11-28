import { Script } from './types';

type Props = {
  data: Script;
};

export function ScriptResult({ data }: Props) {
  // @ts-expect-error TEMPORARY
  data = data.script;

  return (
    <>
      <p>API Version: {data.apiversion}</p>
      <p>{data.isinactive ? 'Inactive' : <b>Active</b>}</p>
      <p>Script Type: {data.scripttype}</p>
      <p>Name: {data.name}</p>
      <p>
        ID: {data.scriptid} ({data.id})
      </p>
      <p>Owner: {data.owner}</p>
      <p>File: {data.scriptfile}</p>
      <p>Notify Emails: {data.notifyemails}</p>
      <p>Description: {data.description}</p>
      {/* <Button.Group>
              <Button onClick={() => window.open(data.urlNs, '_blank')}>View Script Record</Button>
              <Button onClick={() => window.open(data.urlScript, '_blank')}>View Script Details</Button>
              <Button onClick={() => window.open(data.urlScriptLogs, '_blank')}>View Script Logs</Button>
            </Button.Group> */}
    </>
  );
}
