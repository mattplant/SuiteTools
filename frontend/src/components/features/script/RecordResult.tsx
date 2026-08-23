// SPDX-License-Identifier: GPL-3.0-or-later

import { Button, ButtonGroup } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import type { Script } from "@suiteworks/suitetools-shared";
import { openNetSuitePage } from "../../../utils/navigation";
import { EntityFields, type EntityField } from "../../shared/ui/EntityFields";

type Props = { data: Script; modal?: boolean };

/**
 * Pure presentation of a Script entity. Expects fully adapted & validated data.
 * @param props - Component props.
 * @param props.data - The script data to display.
 * @param [props.modal] - Whether to display modal actions.
 * @returns The rendered script result component.
 */
export function ScriptResult({ data, modal }: Props): React.JSX.Element {
  const navigate = useNavigate();

  const fields: EntityField[] = [
    { label: "API Version", value: data.apiVersion },
    { label: "Active", value: data.isInactive ? "No" : "Yes" },
    { label: "Script Type", value: data.scriptType },
    { label: "Name", value: data.name },
    { label: "ID", value: `${data.scriptId} (${data.id})` },
    { label: "Owner", value: data.owner },
    { label: "File", value: data.scriptFile },
    { label: "Notify Emails", value: data.notifyEmails },
    { label: "Description", value: data.description },
  ];

  return (
    <>
      <EntityFields fields={fields} />
      {/* Record and Logs stay visible on the detail page; only Script Details is modal-only. */}
      <ButtonGroup>
        <Button onClick={() => data.urlNs && openNetSuitePage(data.urlNs)}>View Script Record</Button>
        {modal && <Button onClick={() => navigate(`/script/${data.id}`)}>View Script Details</Button>}
        <Button onClick={() => navigate(`/scriptLogs/${data.id}`)}>View Script Logs</Button>
      </ButtonGroup>
    </>
  );
}
