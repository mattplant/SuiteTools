import { getData } from '../../utils/api';
import { SettingsData, assertIsSettings } from './types';

export async function getSettingsData(): Promise<SettingsData> {
  const localTestData = {
    recordId: 1,
    cssUrl: 'https://example.com/style.css',
    jsUrl: 'https://example.com/script.js',
    devMode: true,
  };
  const data = await getData(localTestData, 'settings');
  assertIsSettings(data);

  return data;
}
