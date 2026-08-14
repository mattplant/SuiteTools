import { Button, ButtonGroup } from "flowbite-react";
import type { Integration } from "@suiteworks/suitetools-shared";
import { stashIntegrationDetail } from "../../../adapters/api/integration";
import { addIntegrationLastLogin } from "../../../adapters/api/integrations";
import { useAppSettingsContext } from "../../../hooks/useAppSettingsContext";
import { openAppPage, openNetSuitePage } from "../../../utils/navigation";

type Props = { data: Integration; modal?: boolean };

export function IntegrationResult({ data, modal }: Props) {
  const { settings } = useAppSettingsContext();
  addIntegrationLastLogin(data, settings);

  return (
    <>
      <p>
        <b>ID</b>: {data.id}
      </p>
      <p>
        <b>Name</b>: {data.name}
      </p>
      <p>
        <b>Application ID</b>: {data.applicationId || "Not visible in this account"}
      </p>
      <p>
        <b>State</b>: {data.state}
      </p>
      <p>
        <b>Date Created</b>: {data.dateCreated}
      </p>
      <p>
        <b>Last Login</b>: {data.lastLogin}
      </p>
      {modal && (
        <ButtonGroup>
          {data.urlNs ? <Button onClick={() => openNetSuitePage(data.urlNs!)}>View Integration Record</Button> : null}
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
