// SPDX-License-Identifier: GPL-3.0-or-later

import { Button, ButtonGroup } from "flowbite-react";
import type { Role } from "@suiteworks/suitetools-shared";
import { openAppPage, openNetSuitePage } from "../../../utils/navigation";
import { EntityFields, type EntityField } from "../../shared/ui/EntityFields";

type Props = { data: Role; modal?: boolean };

/**
 * Pure presentation of a Role entity. Expects fully adapted & validated data.
 * @param props - Component props.
 * @param props.data - The role data to display.
 * @param [props.modal] - Whether to display modal actions.
 * @returns The rendered role result component.
 */
export function RoleResult({ data, modal }: Props): React.JSX.Element {
  const fields: EntityField[] = [
    { label: "ID", value: data.id },
    { label: "Name", value: data.name },
    { label: "Active", value: data.isInactive ? "No" : "Yes" },
    { label: "Center Type", value: data.centerType },
    { label: "Sales Role", value: data.isSalesRole ? "Yes" : "No" },
    { label: "Support Role", value: data.isSupportRole ? "Yes" : "No" },
    { label: "Web Service Only", value: data.isWebServiceOnlyRole ? "Yes" : "No" },
  ];

  return (
    <>
      <EntityFields fields={fields} />
      {modal && (
        <ButtonGroup>
          <Button onClick={() => data.urlNs && openNetSuitePage(data.urlNs)}>View Role Record</Button>
          <Button onClick={() => data.urlDetail && openAppPage(data.urlDetail)}>View Role Details</Button>
        </ButtonGroup>
      )}
    </>
  );
}
