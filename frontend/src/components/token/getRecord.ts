import { getTokens } from './getRecords';
import { NotFound } from '../../api/types';
import { Token } from './types';

export async function getToken(id: number): Promise<Token | NotFound> {
  console.log('getToken() initiated', { id });
  let result;
  if (window.location.href.includes('localhost')) {
    // mock data for local development
    result = {
      id: 1,
      name: 'Sample Token',
      user: 'Matt Plant',
      role: 'Administrator',
      application: 'Sample Application',
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
        // build additional properties
        result.urlNs = `/app/setup/accesstoken.nl?id=${result.id}`;
        result.urlDetail = `#/token/${result.id}`;
      }
    }
  }

  return result;
}
