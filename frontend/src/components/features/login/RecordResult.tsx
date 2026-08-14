import type { Login } from "@suiteworks/suitetools-shared";

type Props = { data: Login };

export function LoginResult({ data }: Props) {
  return (
    <>
      <p>
        <b>Date</b>: {data.date}
      </p>
      <p>
        <b>Status</b>: {data.status}
      </p>
      <p>
        <b>OAuth Application</b>: {data.oauthAppName}
      </p>
      <p>
        <b>OAuth Access Token</b>: {data.oauthAccessTokenName}
      </p>
      <p>
        <b>User</b>: {data.userName}
      </p>
      <p>
        <b>Role</b>: {data.roleName}
      </p>
      <p>
        <b>Email Address</b>: {data.emailAddress}
      </p>
      <p>
        <b>IP Address</b>: {data.ipAddress}
      </p>
      <p>
        <b>Request URI</b>: {data.requestUri}
      </p>
      <p>
        <b>Detail</b>: {data.detail}
      </p>
      <p>
        <b>Security Challenge</b>: {data.secChallenge}
      </p>
      <p>
        <b>User Agent</b>: {data.userAgent}
      </p>
    </>
  );
}
