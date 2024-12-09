import { getTokens } from './getRecords';
import { Token, assertIsToken } from './types';

export async function getToken(id: number): Promise<Token> {
  let record: Token;
  if (window.location.href.includes('localhost')) {
    // get mock data for local development
    record = {
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
    const records = await getTokens({});
    const result = records.find((record) => record.id === id);
    if (!result) {
      throw new Error(`Token with ID ${id} not found`);
    } else {
      record = result;
    }
  }
  assertIsToken(record);

  // build additional properties
  record.urlNs = `/app/setup/accesstoken.nl?id=${record.id}`;
  record.urlDetail = `#/token/${record.id}`;

  return record;
}
