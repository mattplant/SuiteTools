import { Button, ButtonGroup } from 'flowbite-react';
import type { ScriptLog } from '@suiteworks/suitetools-shared';
import { openAppPage, openNetSuitePage } from '../../../utils/navigation';

type Props = {
  data: ScriptLog;
  modal?: boolean;
};

export function ScriptLogResult({ data, modal }: Props) {
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
      {modal && (
        <ButtonGroup>
          <Button onClick={() => data.urlNs && openNetSuitePage(data.urlNs)}>View Script Log Record</Button>
          <Button onClick={() => data.urlDetail && openAppPage(data.urlDetail)}>View Script Log Details</Button>
        </ButtonGroup>
      )}
    </>
  );
}
