import { getData } from '../../../api/api';
import type { NotFound } from '../../../api/types';
import type { CriteriaFields } from '../../shared/criteria/types';
import { UserBundle } from '@suiteworks/suitetools-shared';
import type { Users } from '@suiteworks/suitetools-shared';

export async function getUsers(fields: CriteriaFields): Promise<Users | NotFound> {
  let result;
  const localTestData = {
    data: [
      {
        id: 1,
        isinactive: 'Yes',
        email: 'i@idev.systems',
        name: 'Matt Plant',
        roleid: 3,
        rolename: 'Administrator',
        supervisor: 'John Doe',
        title: 'Architect',
      },
    ],
  };
  const urlParams = {
    active: fields.active,
    roles: fields.roles,
    owners: fields.owners,
  };
  const response = await getData(localTestData, 'users', urlParams);
  if (response.message) {
    result = { message: response.message };
  } else {
    UserBundle.assertMany(response.data);
    result = response.data;
  }

  return result;
}
