import { getData } from '../../utils/api';
import { Script, assertIsScripts } from './types';
import { CriteriaFields } from '../../components/search/criteria/types';

export async function getScripts(fields: CriteriaFields): Promise<Script[]> {
  const localTestData = [
    {
      id: 1,
      apiversion: '2.1',
      isinactive: 'F',
      scripttype: 'SCHEDULED',
      name: 'TEST SCRIPT (1)',
      scriptid: 'customscript_idev_test',
      owner: 'Matt Plant (12345)',
      scriptfile: 'idev_SCH_test.js (45678)',
      notifyemails: null,
      description: null,
    },
  ];
  const urlParams = {
    scripttype: fields.scripttype,
    owner: fields.owner,
  };
  const data = await getData(localTestData, 'scripts', urlParams);
  assertIsScripts(data);

  return data;
}
