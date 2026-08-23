// SPDX-License-Identifier: GPL-3.0-or-later

import { Button, ButtonGroup } from "flowbite-react";
import type { Token } from "@suiteworks/suitetools-shared";
import { useAppSettingsContext } from "../../../hooks/useAppSettingsContext";
import { addTokenLastLogin } from "../../../adapters/api/token";
import { openAppPage, openNetSuitePage } from "../../../utils/navigation";
import { EntityFields, type EntityField } from "../../shared/ui/EntityFields";

type Props = { data: Token; modal?: boolean };

/**
 * Pure presentation of a Token entity. Expects fully adapted & validated data.
 * @param props - Component props.
 * @param props.data - The token data to display.
 * @param [props.modal] - Whether to display modal actions.
 * @returns The rendered token result component.
 */
export function TokenResult({ data, modal }: Props): React.JSX.Element {
  const { settings } = useAppSettingsContext();
  addTokenLastLogin(data, settings);

  const fields: EntityField[] = [
    { label: "ID", value: data.id },
    { label: "Token Name", value: data.name },
    { label: "Integration", value: data.integrationName },
    { label: "User", value: data.userName },
    { label: "Role", value: data.roleName },
    { label: "State", value: data.state },
    { label: "Date Created", value: data.dateCreated },
    { label: "Created By", value: data.createdBy },
  ];

  return (
    <>
      <EntityFields fields={fields} />
      {modal && (
        <ButtonGroup>
          <Button onClick={() => data.urlNs && openNetSuitePage(data.urlNs)}>View Token Record</Button>
          <Button onClick={() => data.urlDetail && openAppPage(data.urlDetail)}>View Token Details</Button>
        </ButtonGroup>
      )}
    </>
  );
}
