// SPDX-License-Identifier: GPL-3.0-or-later

import type { Login } from "@suiteworks/suitetools-shared";
import { EntityFields, type EntityField } from "../../shared/ui/EntityFields";

type Props = { data: Login };

/**
 * Pure presentation of a Login entity. Expects fully adapted & validated data.
 * @param props - Component props.
 * @param props.data - The login data to display.
 * @returns The rendered login result component.
 */
export function LoginResult({ data }: Props): React.JSX.Element {
  const fields: EntityField[] = [
    { label: "Date", value: data.date },
    { label: "Status", value: data.status },
    { label: "OAuth Application", value: data.oauthAppName },
    { label: "OAuth Access Token", value: data.oauthAccessTokenName },
    { label: "User", value: data.userName },
    { label: "Role", value: data.roleName },
    { label: "Email Address", value: data.emailAddress },
    { label: "IP Address", value: data.ipAddress },
    { label: "Request URI", value: data.requestUri },
    { label: "Detail", value: data.detail },
    { label: "Security Challenge", value: data.secChallenge },
    { label: "User Agent", value: data.userAgent },
  ];

  return <EntityFields fields={fields} />;
}
