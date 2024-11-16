export type SettingsData = {
  recordId: number;
  cssUrl: string;
  jsUrl: string;
  devMode: boolean;
};

export type NewSettingsData = {
  cssUrl: string;
  jsUrl: string;
  devMode: boolean;
};

type Data = {
  settings: SettingsData;
};

export function assertIsData(data: unknown): asserts data is Data {
  if (typeof data !== 'object') {
    throw new Error('Data is not an object');
  }
  if (data === null) {
    throw new Error('Data is null');
  }
  if (!('settings' in data)) {
    throw new Error('Data does not contain settings');
  }
}

export function assertIsSettings(data: unknown): asserts data is SettingsData {
  // check if the data is an object
  if (typeof data !== 'object' || data === null) {
    throw new Error('Settings data is not an object');
  }
  // check the data for the required fields
  // recordId
  if (!('recordId' in data)) {
    throw new Error('Settings data is missing the "recordId" field');
  }
  if (typeof data.recordId !== 'number') {
    throw new Error('Settings data "recordId" field is not a number');
  }
  // cssUrl
  if (!('cssUrl' in data)) {
    throw new Error('Settings data is missing the "cssUrl" field');
  }
  if (typeof data.cssUrl !== 'string') {
    throw new Error('Settings data "cssUrl" field is not a string');
  }
  // jsUrl
  if (!('jsUrl' in data)) {
    throw new Error('Settings data is missing the "jsUrl" field');
  }
  if (typeof data.jsUrl !== 'string') {
    throw new Error('Settings data "jsUrl" field is not a string');
  }
  // devMode
  if (!('devMode' in data)) {
    throw new Error('Settings data is missing the "devMode" field');
  }
  if (typeof data.devMode !== 'boolean') {
    throw new Error('Settings data "devMode" field is not a boolean');
  }
}
