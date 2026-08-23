// SPDX-License-Identifier: GPL-3.0-or-later

import { Button, ButtonGroup } from "flowbite-react";
import type { Integration } from "@suiteworks/suitetools-shared";
import { stashIntegrationDetail } from "../../../adapters/api/integration";
import { addIntegrationLastLogin } from "../../../adapters/api/integrations";
import { useAppSettingsContext } from "../../../hooks/useAppSettingsContext";
import { openAppPage, openNetSuitePage } from "../../../utils/navigation";
import { EntityFields, type EntityField } from "../../shared/ui/EntityFields";

type Props = { data: Integration; modal?: boolean };

/**
 * Pure presentation of an Integration entity. Expects fully adapted & validated data.
 * @param props - Component props.
 * @param props.data - The integration data to display.
 * @param [props.modal] - Whether to display modal actions.
 * @returns The rendered integration result component.
 */
export function IntegrationResult({ data, modal }: Props): React.JSX.Element {
  const { settings } = useAppSettingsContext();
  // Bound here so the click handler keeps the narrowing from the guard below.
  const { urlNs } = data;
  addIntegrationLastLogin(data, settings);

  const fields: EntityField[] = [
    { label: "ID", value: data.id },
    { label: "Name", value: data.name },
    { label: "Application ID", value: data.applicationId || "Not visible in this account" },
    { label: "State", value: data.state },
    { label: "Date Created", value: data.dateCreated },
    { label: "Last Login", value: data.lastLogin },
  ];

  return (
    <>
      <EntityFields fields={fields} />
      {modal && (
        <ButtonGroup>
          {urlNs ? <Button onClick={() => openNetSuitePage(urlNs)}>View Integration Record</Button> : null}
          <Button
            onClick={() => {
              if (!data.urlDetail) {
                return;
              }
              stashIntegrationDetail(data);
              openAppPage(data.urlDetail);
            }}
          >
            View Integration Details
          </Button>
        </ButtonGroup>
      )}
    </>
  );
}
