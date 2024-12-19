import { getData } from '../../api/api';
import { Role, assertIsRoles } from './types';
import { CriteriaFields } from '../criteria/types';

export async function getRoles(fields: CriteriaFields): Promise<Role[]> {
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
  assertIsRoles(response.data);

  return response.data;
}
