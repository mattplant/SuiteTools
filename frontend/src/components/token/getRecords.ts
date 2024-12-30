import { getDataFromPageTable } from '../../utils/collectData';
import { assertIsTokens, Token } from './types';
import { CriteriaFields } from '../criteria/types';

export async function getTokens(fields: CriteriaFields): Promise<Token[]> {
  const urlParams = {
    active: fields.active,
    integrationName: fields.integrationName,
    userName: fields.userName,
    roleName: fields.roleName,
  };
  const data: Token[] = [];
  let dataArray: string[][] = [];
  if (window.location.href.includes('localhost')) {
    // mock data for local development
    dataArray = [
      ['', '1', 'Token 1', 'Matt Plant', 'Administrator', 'Application 1', 'No', '2024-12-07 18:28:38', 'Matt Plant'],
      ['', '2', 'Token 2', 'Matt Plant', 'Administrator', 'Application 2', 'No', '2024-12-11 12:13:14', 'Matt Plant'],
    ];
  } else {
    // get data from NetSuite page
    dataArray = await getDataFromPageTable('/app/setup/accesstokens.nl', 'div__body', true);
  }
  if (urlParams.active == 'T') {
    dataArray = dataArray.filter((record) => record[6] === 'No');
  } else if (urlParams.active == 'F') {
    dataArray = dataArray.filter((record) => record[6] === 'Yes');
  }
  if (urlParams.integrationName) {
    dataArray = dataArray.filter((record) => record[5] === urlParams.integrationName);
  }
  if (urlParams.userName) {
    dataArray = dataArray.filter((record) => record[3] === urlParams.userName);
  }
  if (urlParams.roleName) {
    dataArray = dataArray.filter((record) => record[4] === urlParams.roleName);
  }
  // convert array to record objects
  dataArray.map((record) => {
    data.push({
      id: Number(record[1]),
      name: record[2],
      userName: record[3],
      roleName: record[4],
      integrationName: record[5],
      state: record[6],
      dateCreated: record[7],
      createdBy: record[8],
    });
  });
  assertIsTokens(data);

  return data;
}
