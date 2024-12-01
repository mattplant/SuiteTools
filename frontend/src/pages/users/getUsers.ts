import { getData } from '../../api/api';
import { User, assertIsUsers } from './types';
import { CriteriaFields } from '../../components/search/criteria/types';

export async function getUsers(fields: CriteriaFields): Promise<User[]> {
  const localTestData = {
    data: [
      {
        id: 1,
        isinactive: 'Yes',
        email: 'i@idev.systems',
        name: 'Matt Plant (1)',
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
  assertIsUsers(response.data);

  return response.data;
}
