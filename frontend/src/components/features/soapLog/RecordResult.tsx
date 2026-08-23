// SPDX-License-Identifier: GPL-3.0-or-later

import { Button, ButtonGroup } from "flowbite-react";
import type { SoapLog } from "@suiteworks/suitetools-shared";
import { openAppPage } from "../../../utils/navigation";
import { EntityFields, type EntityField } from "../../shared/ui/EntityFields";

type Props = { data: SoapLog; modal?: boolean };

/**
 * Pure presentation of a SoapLog entity. Expects fully adapted & validated data.
 * @param props - Component props.
 * @param props.data - The SOAP log data to display.
 * @param [props.modal] - Whether to display modal actions.
 * @returns The rendered SOAP log result component.
 */
export function SoapLogResult({ data, modal }: Props): React.JSX.Element {
  const fields: EntityField[] = [
    { label: "ID", value: data.id },
    { label: "Start Date", value: data.startDate },
    { label: "Duration", value: data.duration },
    { label: "Integration", value: data.integration },
    { label: "Integration Id", value: data.integrationId },
    { label: "Action", value: data.action },
    { label: "Record Type", value: data.recordType },
    { label: "User", value: data.user },
    { label: "Status", value: data.status },
    { label: "Records", value: data.records },
    { label: "Records Finished", value: data.recordsFinished },
    { label: "Records Failed", value: data.recordsFailed },
    { label: "Records Returned", value: data.recordsReturned },
    { label: "Request", value: data.request },
    { label: "Response", value: data.response },
  ];

  return (
    <>
      <EntityFields fields={fields} />
      {modal && (
        <ButtonGroup>
          <Button onClick={() => data.urlDetail && openAppPage(data.urlDetail)}>View SOAP Log Details</Button>
        </ButtonGroup>
      )}
    </>
  );
}
