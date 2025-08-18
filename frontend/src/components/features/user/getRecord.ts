import { getData } from '../../../api/api';
import type { NotFound } from '../../../api/types';
import { UserBundle } from '@suiteworks/suitetools-shared';
import type { User } from '@suiteworks/suitetools-shared';

export async function getUser(id: number): Promise<User | NotFound> {
  let result;
  const localTestData = {
    data: {
      id: 1,
      isinactive: 'Yes',
      email: 'i@idev.systems',
      name: 'Matt Plant',
      roleid: 3,
      rolename: 'Administrator',
      supervisor: 'John Doe',
      title: 'Architect',
    },
  };
  const response = await getData(localTestData, 'user', { id: id });
  if (response.message) {
    result = { message: response.message };
  } else {
    UserBundle.assert(response.data);
    // build additional properties
    response.data.urlNs = `/app/common/entity/employee.nl?id=${response.data.id}`;
    response.data.urlDetail = `#/user/${response.data.id}`;
    result = response.data;
  }

  return result;
}
