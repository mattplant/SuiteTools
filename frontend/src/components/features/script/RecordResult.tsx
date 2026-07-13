import { Button, ButtonGroup } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import type { Script } from '@suiteworks/suitetools-shared';
import { openNetSuitePage } from '../../../utils/navigation';

type Props = {
  data: Script;
  modal?: boolean;
};

export function ScriptResult({ data, modal }: Props) {
  const navigate = useNavigate();

  return (
    <>
      <p>
        <b>API Version:</b> {data.apiversion}
      </p>
      <p>
        <b>Active:</b> {data.isinactive ? 'No' : 'Yes'}
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
      <ButtonGroup>
        <Button onClick={() => data.urlNs && openNetSuitePage(data.urlNs)}>View Script Record</Button>
        {modal && <Button onClick={() => navigate(`/script/${data.id}`)}>View Script Details</Button>}
        <Button onClick={() => navigate(`/scriptLogs/${data.id}`)}>View Script Logs</Button>
      </ButtonGroup>
    </>
  );
}
