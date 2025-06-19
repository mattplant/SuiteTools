export interface Login {
  id: number;
  date: string;
  status: string;
  oauthappname: string;
  oauthaccesstokenname?: string;
  user?: number;
  username?: string;
  role?: number;
  rolename?: string;
  emailaddress?: string;
  ipaddress: string;
  requesturi: string;
  detail?: string;
  secchallenge?: string;
  useragent?: string;
  // additional properties
  urlNs?: string;
  urlDetail?: string;
}

export function assertIsLogin(data: unknown): asserts data is Login {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Login data is not an object');
  }
  // check the data for the required fields
  // id
  if (!('id' in data)) {
    throw new Error('Login data is missing the "id" field');
  }
  if (typeof data.id !== 'number') {
    throw new Error('Login data "id" field is not a number');
  }
  // date
  if (!('date' in data)) {
    throw new Error('Login data is missing the "date" field');
  }
  if (typeof data.date !== 'string') {
    throw new Error('Login data "date" field is not a string');
  }
  // status
  if (!('status' in data)) {
    throw new Error('Login data is missing the "status" field');
  }
  if (typeof data.status !== 'string') {
    throw new Error('Login data "status" field is not a string');
  }
  // oauthappname
  if (!('oauthappname' in data)) {
    throw new Error('Login data is missing the "oauthappname" field');
  }
  if (typeof data.oauthappname !== 'string') {
    throw new Error('Login data "oauthappname" field is not a string');
  }
  // oauthaccesstokenname (possibly null)
  if (!('oauthaccesstokenname' in data)) {
    throw new Error('Login data is missing the "oauthaccesstokenname" field');
  }
  if (data.oauthaccesstokenname !== null && typeof data.oauthaccesstokenname !== 'string') {
    throw new Error('Login data "oauthaccesstokenname" field is not a string');
  }
  // user (possibly null)
  if ('user' in data && data.user !== null && typeof data.user !== 'number') {
    throw new Error('Login data optional "user" field is not a number');
  }
  // username (possibly null)
  if ('username' in data && data.username !== null && typeof data.username !== 'string') {
    throw new Error('Login data optional "username" field is not a string');
  }
  // role (possibly null)
  if ('role' in data && data.role !== null && typeof data.role !== 'number') {
    throw new Error('Login data optional "role" field is not a number');
  }
  // rolename (possibly null)
  if ('rolename' in data && data.rolename !== null && typeof data.rolename !== 'string') {
    throw new Error('Login data optional "rolename" field is not a string');
  }
  // emailaddress (possibly null)
  if ('emailaddress' in data && data.emailaddress !== null && typeof data.emailaddress !== 'string') {
    throw new Error('Login data optional "emailaddress" field is not a string');
  }
  // ipaddress
  if (!('ipaddress' in data)) {
    throw new Error('Login data is missing the "ipaddress" field');
  }
  if (typeof data.ipaddress !== 'string') {
    throw new Error('Login data "ipaddress" field is not a string');
  }
  // requesturi
  if (!('requesturi' in data)) {
    throw new Error('Login data is missing the "requesturi" field');
  }
  if (typeof data.requesturi !== 'string') {
    throw new Error('Login data "requesturi" field is not a string');
  }
  // detail (possibly null)
  if ('detail' in data && data.detail !== null && typeof data.detail !== 'string') {
    throw new Error('Login data optional "detail" field is not a string');
  }
  // secchallenge (possibly null)
  if ('secchallenge' in data && data.secchallenge !== null && typeof data.secchallenge !== 'string') {
    throw new Error('Login data optional "secchallenge" field is not a string');
  }
  // useragent (possibly null)
  if ('useragent' in data && data.useragent !== null && typeof data.useragent !== 'string') {
    throw new Error('Login data optional "useragent" field is not a string');
  }
  // ADDITIONAL PROPERTIES
  // urlNs
  if ('urlNs' in data && typeof data.urlNs !== 'string') {
    throw new Error('Login data "urlNs" field is not a string');
  }
  // urlLogin
  if ('urlLogin' in data && typeof data.urlLogin !== 'string') {
    throw new Error('Login data "urlLogin" field is not a string');
  }
}

export function assertIsLogins(data: unknown): asserts data is Login[] {
  if (!Array.isArray(data)) {
    throw new Error('Login data is not an array');
  }
  // only checking the first element
  if (data.length > 0) {
    assertIsLogin(data[0]);
  }
}
