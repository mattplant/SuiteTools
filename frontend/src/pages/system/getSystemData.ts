import { getData } from '../../utils/api';
import { SystemData, assertIsSystemData } from './types';

export async function getSystemData(): Promise<SystemData> {
  const localTestData = {
    // system
    accountId: '123456789_SB2',
    envType: 'SANDBOX',
    isProduction: false,
    version: '2024.1',
    processorCount: 2,
    queueCount: 1,
    // user
    userId: 1,
    userName: 'Matt Plant',
    userEmail: 'i@idev.system',
    userLocation: 2,
    userDepartment: 3,
    userRole: 4,
    userRoleId: 'administrator',
    isAdmin: true,
    userSubsidiary: 1,
  };
  const data = await getData(localTestData, 'system');
  assertIsSystemData(data);

  return data;
}
