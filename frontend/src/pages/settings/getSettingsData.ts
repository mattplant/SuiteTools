import { getData } from '../../utils/api/api';
import { SettingsData, assertIsSettings } from './types';

export async function getSettingsData(): Promise<SettingsData> {
  const localTestData = {
    data: {
      recordId: 1,
      cssUrl: 'https://example.com/style.css',
      jsUrl: 'https://example.com/script.js',
      devMode: true,
    },
  };
  const response = await getData(localTestData, 'settings');
  assertIsSettings(response.data);

  return response.data;
}
