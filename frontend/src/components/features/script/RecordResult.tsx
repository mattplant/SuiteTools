import { Button, ButtonGroup } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import type { Script } from "@suiteworks/suitetools-shared";
import { openNetSuitePage } from "../../../utils/navigation";

type Props = { data: Script; modal?: boolean };

export function ScriptResult({ data, modal }: Props) {
  const navigate = useNavigate();

  return (
    <>
      <p>
        <b>API Version:</b> {data.apiVersion}
      </p>
      <p>
        <b>Active:</b> {data.isInactive ? "No" : "Yes"}
      </p>
      <p>
        <b>Script Type:</b> {data.scriptType}
      </p>
      <p>
        <b>Name:</b> {data.name}
      </p>
      <p>
        <b>ID:</b> {data.scriptId} ({data.id})
      </p>
      <p>
        <b>Owner:</b> {data.owner}
      </p>
      <p>
        <b>File:</b> {data.scriptFile}
      </p>
      <p>
        <b>Notify Emails:</b> {data.notifyEmails}
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
