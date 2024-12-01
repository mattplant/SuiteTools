import { getData } from '../../api/api';
import { SettingsData, assertIsSettings } from './types';

export async function getSettingsData(): Promise<SettingsData> {
  const localTestData = {
    data: {
      devMode: true,
      appScriptUrl: '/',
      // system
      accountId: '1234567_SB1',
      envType: 'SANDBOX',
      version: '2024.2',
      processorCount: 2,
      queueCount: 1,
      // user
      userId: 123456789,
      userName: 'Matt "iDev" Plant',
      userEmail: 'i@idev.systems',
      userLocation: 0,
      userDepartment: 1,
      userRole: 'administrator',
      userRoleId: 3,
      userSubsidiary: 5,
      isAdmin: true,
    },
  };
  const response = await getData(localTestData, 'settings');
  assertIsSettings(response.data);

  return response.data;
}
