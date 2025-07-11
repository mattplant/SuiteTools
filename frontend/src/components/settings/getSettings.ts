import { getData } from '../../api/api';
import { Settings } from './types';

export async function getSettings(): Promise<Settings> {
  const localTestData = {
    data: {
      devMode: true,
      appUrl: '/',
      lastLogins: null,
      // system
      accountId: '1234567_SB1',
      envType: 'SANDBOX',
      version: '2024.2',
      processorCount: 2,
      queueCount: 1,
      appBundle: 'local vite',
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

export function assertIsSettings(data: unknown): asserts data is Settings {
  // check if the data is an object
  if (typeof data !== 'object' || data === null) {
    throw new Error('Settings data is not an object');
  }
  // check the data for the required fields
  // devMode
  if (!('devMode' in data)) {
    throw new Error('Settings data is missing the "devMode" field');
  }
  if (typeof data.devMode !== 'boolean') {
    throw new Error('Settings data "devMode" field is not a boolean');
  }
  // appUrl
  if (!('appUrl' in data)) {
    throw new Error('Settings data is missing the "appUrl" field');
  }
  if (typeof data.appUrl !== 'string') {
    throw new Error('Settings data "appUrl" field is not a string');
  }
  // lastLogins
  if ('lastLogins' in data && typeof data.lastLogins !== 'object') {
    throw new Error('User data "lastLogin" field is not a object');
  }
  // SYSTEM INFO
  // accountId
  if (!('accountId' in data)) {
    throw new Error('Settings data is missing the "accountId" field');
  }
  if (typeof data.accountId !== 'string') {
    throw new Error('Settings data "accountId" field is not a string');
  }
  // envType
  if (!('envType' in data)) {
    throw new Error('Settings data is missing the "envType" field');
  }
  if (typeof data.envType !== 'string') {
    throw new Error('Settings data "envType" field is not a string');
  }
  // version
  if (!('version' in data)) {
    throw new Error('Settings data is missing the "version" field');
  }
  if (typeof data.version !== 'string') {
    throw new Error('Settings data "version" field is not a string');
  }
  // processorCount
  if (!('processorCount' in data)) {
    throw new Error('Settings data is missing the "processorCount" field');
  }
  if (typeof data.processorCount !== 'number') {
    throw new Error('Settings data "processorCount" field is not a number');
  }
  // queueCount
  if (!('queueCount' in data)) {
    throw new Error('Settings data is missing the "queueCount" field');
  }
  if (typeof data.queueCount !== 'number') {
    throw new Error('Settings data "queueCount" field is not a number');
  }
  // appBundle
  if (!('appBundle' in data)) {
    throw new Error('Settings data is missing the "appBundle" field');
  }
  if (typeof data.appBundle !== 'string') {
    throw new Error('Settings data "appBundle" field is not a string');
  }
  // USER INFO
  // userId
  if (!('userId' in data)) {
    throw new Error('Settings data is missing the "userId" field');
  }
  if (typeof data.userId !== 'number') {
    throw new Error('Settings data "userId" field is not a number');
  }
  // userName
  if (!('userName' in data)) {
    throw new Error('Settings data is missing the "userName" field');
  }
  if (typeof data.userName !== 'string') {
    throw new Error('Settings data "userName" field is not a string');
  }
  // userEmail
  if (!('userEmail' in data)) {
    throw new Error('Settings data is missing the "userEmail" field');
  }
  if (typeof data.userEmail !== 'string') {
    throw new Error('Settings data "userEmail" field is not a string');
  }
  // userLocation
  if (!('userLocation' in data)) {
    throw new Error('Settings data is missing the "userLocation" field');
  }
  if (typeof data.userLocation !== 'number') {
    throw new Error('Settings data "userLocation" field is not a number');
  }
  // userDepartment
  if (!('userDepartment' in data)) {
    throw new Error('Settings data is missing the "userDepartment" field');
  }
  if (typeof data.userDepartment !== 'number') {
    throw new Error('Settings data "userDepartment" field is not a number');
  }
  // userRole
  if (!('userRole' in data)) {
    throw new Error('Settings data is missing the "userRole" field');
  }
  if (typeof data.userRole !== 'string') {
    throw new Error('Settings data "userRole" field is not a string');
  }
  // userRoleId
  if (!('userRoleId' in data)) {
    throw new Error('Settings data is missing the "userRoleId" field');
  }
  if (typeof data.userRoleId !== 'number') {
    throw new Error('Settings data "userRoleId" field is not a number');
  }
  // userSubsidiary
  if (!('userSubsidiary' in data)) {
    throw new Error('Settings data is missing the "userSubsidiary" field');
  }
  if (typeof data.userSubsidiary !== 'number') {
    throw new Error('Settings data "userSubsidiary" field is not a number');
  }
  // isAdmin
  if (!('isAdmin' in data)) {
    throw new Error('Settings data is missing the "isAdmin" field');
  }
  if (typeof data.isAdmin !== 'boolean') {
    throw new Error('Settings data "isAdmin" field is not a boolean');
  }
}
