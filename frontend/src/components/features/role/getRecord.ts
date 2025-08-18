import { getData } from '../../../api/api';
import type { NotFound } from '../../../api/types';
import { RoleBundle } from '@suiteworks/suitetools-shared';
import type { Role } from '@suiteworks/suitetools-shared';

export async function getRole(id: number): Promise<Role | NotFound> {
  let result;
  const localTestData = {
    data: {
      id: 3,
      isinactive: 'Yes',
      name: 'Administrator',
      centertype: 'BASIC',
      issalesrole: 'No',
      issupportrole: 'No',
      iswebserviceonlyrole: 'No',
    },
  };
  const response = await getData(localTestData, 'role', { id: id });
  if (response.message) {
    result = { message: response.message };
  } else {
    RoleBundle.assert(response.data);
    // build additional properties
    response.data.urlNs = `/app/setup/role.nl?id=${response.data.id}`;
    response.data.urlDetail = `#/role/${response.data.id}`;
    result = response.data;
  }

  return result;
}
