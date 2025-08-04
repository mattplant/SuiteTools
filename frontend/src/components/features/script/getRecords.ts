import { getData } from '../../../api/api';
import { NotFound } from '../../../api/types';
import { assertIsScripts, Script } from './types';
import { CriteriaFields } from '../../shared/criteria/types';

export async function getScripts(fields: CriteriaFields): Promise<Script[] | NotFound> {
  let result;
  const localTestData = {
    data: [
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
    ],
  };
  const urlParams = {
    active: fields.active,
    versions: fields.versions,
    scripttypes: fields.scripttypes,
    scriptnames: fields.scriptnames,
    owners: fields.owners,
    files: fields.files,
  };
  const response = await getData(localTestData, 'scripts', urlParams);
  if (response.message) {
    result = { message: response.message };
  } else {
    assertIsScripts(response.data);
    result = response.data;
  }

  return result;
}
