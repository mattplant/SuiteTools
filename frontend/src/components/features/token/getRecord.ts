import { getTokens } from './getRecords';
import type { NotFound } from '../../../api/types';
import { TokenBundle } from '@suiteworks/suitetools-shared';
import type { Token } from '@suiteworks/suitetools-shared';
import { Settings } from '../settings/types';

export async function getToken(id: number): Promise<Token | NotFound> {
  let result;
  if (window.location.href.includes('localhost')) {
    // mock data for local development
    result = {
      id: 1,
      name: 'Sample Token',
      userName: 'Matt Plant',
      roleName: 'Administrator',
      integrationName: 'Application 1',
      state: 'No',
      dateCreated: '2024-12-07 18:28:38',
      createdBy: 'Matt Plant',
    };
  } else {
    if (!id) {
      result = { message: 'Skipping loading token since id is 0' };
    } else {
      console.log('getToken() loading tokens from NetSuite page', { id });
      const records = await getTokens({});
      result = records.find((record) => record.id === id);
      if (!result) {
        throw new Error(`Token with ID ${id} not found`);
      } else {
        TokenBundle.assert(result);
        // build additional properties
        result.urlNs = `/app/setup/accesstoken.nl?id=${result.id}`;
        result.urlDetail = `#/token/${result.id}`;
      }
    }
  }

  return result;
}

export function addTokenLastLogin(record: Token, settings: Settings | undefined): Token {
  if (
    settings &&
    settings.lastLogins &&
    settings.lastLogins.data &&
    Array.isArray(settings.lastLogins.data) &&
    settings.lastLogins.data.length > 0
  ) {
    const lastLoginsObj = settings.lastLogins.data;
    const lastLogins = lastLoginsObj.filter((lastLogin) => lastLogin.name.type === 'token');
    const lastlogin = lastLogins.find((lastlogin) => lastlogin.name.name === record.name);
    if (lastlogin) {
      record.lastLogin = lastlogin.lastLogin;
    }
  }

  return record;
}
