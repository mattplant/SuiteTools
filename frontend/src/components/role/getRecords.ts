import { getData } from '../../api/api';
import { NotFound } from '../../api/types';
import { Role, assertIsRoles } from './types';
import { CriteriaFields } from '../criteria/types';

export async function getRoles(fields: CriteriaFields): Promise<Role[] | NotFound> {
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
    assertIsRoles(response.data);
    result = response.data;
  }

  return result;
}
