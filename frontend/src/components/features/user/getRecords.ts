import { getData } from '../../../api/api';
import { NotFound } from '../../../api/types';
import { User, assertIsUsers } from './types';
import { CriteriaFields } from '../../shared/criteria/types';

export async function getUsers(fields: CriteriaFields): Promise<User[] | NotFound> {
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
    assertIsUsers(response.data);
    result = response.data;
  }

  return result;
}
