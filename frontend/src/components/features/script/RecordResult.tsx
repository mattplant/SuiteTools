import { Button, ButtonGroup } from 'flowbite-react';
import type { Script } from '@suiteworks/suitetools-shared';
import { openAppPage, openNetSuitePage } from '../../../utils/navigation';

type Props = {
  data: Script;
  modal?: boolean;
};

export function ScriptResult({ data, modal }: Props) {
  return (
    <>
      <p>
        <b>API Version:</b> {data.apiversion}
      </p>
      <p>
        <b>{data.isinactive}</b>
      </p>
      <p>
        <b>Script Type:</b> {data.scripttype}
      </p>
      <p>
        <b>Name:</b> {data.name}
      </p>
      <p>
        <b>ID:</b> {data.scriptid} ({data.id})
      </p>
      <p>
        <b>Owner:</b> {data.owner}
      </p>
      <p>
        <b>File:</b> {data.scriptfile}
      </p>
      <p>
        <b>Notify Emails:</b> {data.notifyemails}
      </p>
      <p>
        <b>Description:</b> {data.description}
      </p>
      {modal && (
        <ButtonGroup>
          <Button onClick={() => data.urlNs && openNetSuitePage(data.urlNs)}>View Script Record</Button>
          <Button onClick={() => data.urlDetail && openAppPage(data.urlDetail)}>View Script Details</Button>
          <Button onClick={() => data.urlScriptLogs && openAppPage(data.urlScriptLogs)}>View Script Logs</Button>
        </ButtonGroup>
      )}
    </>
  );
}
