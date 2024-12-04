import { getData } from '../../api/api';
import { User, assertIsUser } from './types';

export async function getUser(id: number): Promise<User> {
  const localTestData = {
    data: {
      id: 1,
      isinactive: 'Yes',
      email: 'i@idev.systems',
      name: 'Matt Plant (1)',
      supervisor: 'John Doe',
      title: 'Architect',
    },
  };
  const response = await getData(localTestData, 'user', { id: id });
  assertIsUser(response.data);

  // build additional properties
  response.data.urlNs = `/app/common/entity/employee.nl?id=${response.data.id}`;
  response.data.urlUser = `#/user/${response.data.id}`;

  return response.data;
}
