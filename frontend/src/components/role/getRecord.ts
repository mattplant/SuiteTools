import { getData } from '../../api/api';
import { Role, assertIsRole } from './types';

export async function getRole(id: number): Promise<Role> {
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
  assertIsRole(response.data);

  // build additional properties
  response.data.urlNs = `/app/setup/role.nl?id=${response.data.id}`;
  response.data.urlDetail = `#/role/${response.data.id}`;

  return response.data;
}
