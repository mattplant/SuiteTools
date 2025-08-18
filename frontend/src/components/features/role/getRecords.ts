import { getData } from '../../../api/api';
import type { NotFound } from '../../../api/types';
import type { CriteriaFields } from '../../shared/criteria/types';
import { RoleBundle } from '@suiteworks/suitetools-shared';
import type { Roles } from '@suiteworks/suitetools-shared';

export async function getRoles(fields: CriteriaFields): Promise<Roles | NotFound> {
  let result;
  const localTestData = {
    data: [
      {
        id: 3,
        isinactive: 'Yes',
        name: 'Administrator',
        centertype: 'BASIC',
        issalesrole: 'No',
        issupportrole: 'No',
        iswebserviceonlyrole: 'No',
      },
    ],
  };
  const urlParams = {
    active: fields.active,
  };
  const response = await getData(localTestData, 'roles', urlParams);
  if (response.message) {
    result = { message: response.message };
  } else {
    RoleBundle.assertMany(response.data);
    result = response.data;
  }

  return result;
}
