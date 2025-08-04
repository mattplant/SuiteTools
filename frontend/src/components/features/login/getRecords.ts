import { getData } from '../../../api/api';
import { NotFound } from '../../../api/types';
import { Login, assertIsLogins } from './types';
import { CriteriaFields } from '../../shared/criteria/types';

export async function getLogins(fields: CriteriaFields): Promise<Login[] | NotFound> {
  let result;
  const localTestData = {
    data: [
      {
        id: 1,
        date: '2024-12-28 15:38:21',
        status: 'Success',
        oauthappname: 'SuiteCloud Development Integration',
        oauthaccesstokenname: null,
        user: 1,
        username: 'Matt Plant',
        role: 3,
        rolename: 'Administrator',
        emailaddress: 'i@idev.systems',
        ipaddress: '73.53.23.183',
        requesturi: '/app/suiteapp/devframework/ideinstallhandler.nl',
        detail: null,
        secchallenge: null,
        useragent: 'VSCode/1.96.0-insider MacOSX SuiteCloudSDK/2024.2.0 Java/17.0.11;aarch64',
      },
    ],
  };
  const urlParams = {
    rows: fields.rows ? fields.rows : '',
    active: fields.active ? fields.active : '',
    integrationName: fields.integrationName ? fields.integrationName : '',
    tokenName: fields.tokenName ? fields.tokenName : '',
    users: fields.users ? fields.users : '',
    roles: fields.roles ? fields.roles : '',
    // TODO: dates
  };
  const response = await getData(localTestData, 'logins', urlParams);
  if (response.message) {
    result = { message: response.message };
  } else {
    assertIsLogins(response.data);
    result = response.data;
  }

  return result;
}
