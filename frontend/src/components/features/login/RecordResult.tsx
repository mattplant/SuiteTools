import type { Login } from '@suiteworks/suitetools-shared';

type Props = {
  data: Login;
};

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
        <b>OAuth Application</b>: {data.oauthappname}
      </p>
      <p>
        <b>OAuth Access Token</b>: {data.oauthaccesstokenname}
      </p>
      <p>
        <b>User</b>: {data.username}
      </p>
      <p>
        <b>Role</b>: {data.rolename}
      </p>
      <p>
        <b>Email Address</b>: {data.emailaddress}
      </p>
      <p>
        <b>IP Address</b>: {data.ipaddress}
      </p>
      <p>
        <b>Request URI</b>: {data.requesturi}
      </p>
      <p>
        <b>Detail</b>: {data.detail}
      </p>
      <p>
        <b>Security Challenge</b>: {data.secchallenge}
      </p>
      <p>
        <b>User Agent</b>: {data.useragent}
      </p>
    </>
  );
}
