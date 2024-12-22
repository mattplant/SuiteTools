import { getData } from '../../api/api';
import { NotFound } from '../../api/types';
import { User, assertIsUsers } from './types';
import { CriteriaFields } from '../criteria/types';

export async function getUsers(fields: CriteriaFields): Promise<User[] | NotFound> {
  let result;
  const localTestData = {
    data: [
      {
        id: 1,
        isinactive: 'Yes',
        email: 'i@idev.systems',
        name: 'Matt Plant',
        supervisor: 'John Doe',
        title: 'Architect',
      },
    ],
  };
  const urlParams = {
    active: fields.active,
    role: fields.role,
    owner: fields.owner,
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
