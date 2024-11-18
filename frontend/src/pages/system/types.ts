export type SystemData = {
  // NETSUITE INFO
  // system
  accountId: string;
  envType: string;
  isProduction: boolean;
  version: string;
  processorCount: number;
  queueCount: number;
  // user
  userId: number;
  userName: string;
  userEmail: string;
  userLocation: number;
  userDepartment: string;
  userRole: string;
  userRoleId: number;
  isAdmin: boolean;
  userSubsidiary: number;
};

type Data = {
  system: SystemData;
};

export function assertIsData(data: unknown): asserts data is Data {
  console.log('assertIsData', data);

  if (typeof data !== 'object') {
    throw new Error('Data is not an object');
  }
  if (data === null) {
    throw new Error('Data is null');
  }
  if (!('system' in data)) {
    throw new Error('Data does not contain system data');
  }
}

export function assertIsSystemData(data: unknown): asserts data is SystemData {
  console.log('assertIsSystemData', data);

  // check if the data is an object
  if (typeof data !== 'object' || data === null) {
    throw new Error('System data is not an object');
  }
  // check the data for the required fields
  // accountId
  if (!('accountId' in data)) {
    throw new Error('System data is missing the "accountId" field');
  }
  if (typeof data.accountId !== 'string') {
    throw new Error('System data "accountId" field is not a string');
  }
  // envType
  if (!('envType' in data)) {
    throw new Error('System data is missing the "envType" field');
  }
  if (typeof data.envType !== 'string') {
    throw new Error('System data "envType" field is not a string');
  }
  // isProduction
  if (!('isProduction' in data)) {
    throw new Error('System data is missing the "isProduction" field');
  }
  if (typeof data.isProduction !== 'boolean') {
    throw new Error('System data "isProduction" field is not a boolean');
  }
  // version
  if (!('version' in data)) {
    throw new Error('System data is missing the "version" field');
  }
  if (typeof data.version !== 'string') {
    throw new Error('System data "version" field is not a string');
  }
  // processorCount
  if (!('processorCount' in data)) {
    throw new Error('System data is missing the "processorCount" field');
  }
  if (typeof data.processorCount !== 'number') {
    throw new Error('System data "processorCount" field is not a number');
  }
  // queueCount
  if (!('queueCount' in data)) {
    throw new Error('System data is missing the "queueCount" field');
  }
  if (typeof data.queueCount !== 'number') {
    throw new Error('System data "queueCount" field is not a number');
  }
  // userId
  if (!('userId' in data)) {
    throw new Error('System data is missing the "userId" field');
  }
  if (typeof data.userId !== 'number') {
    throw new Error('System data "userId" field is not a number');
  }
  // userName
  if (!('userName' in data)) {
    throw new Error('System data is missing the "userName" field');
  }
  if (typeof data.userName !== 'string') {
    throw new Error('System data "userName" field is not a string');
  }
  // userEmail
  if (!('userEmail' in data)) {
    throw new Error('System data is missing the "userEmail" field');
  }
  if (typeof data.userEmail !== 'string') {
    throw new Error('System data "userEmail" field is not a string');
  }
  // userLocation
  if (!('userLocation' in data)) {
    throw new Error('System data is missing the "userLocation" field');
  }
  if (typeof data.userLocation !== 'number') {
    throw new Error('System data "userLocation" field is not a number');
  }
  // userDepartment
  if (!('userDepartment' in data)) {
    throw new Error('System data is missing the "userDepartment" field');
  }
  if (typeof data.userDepartment !== 'number') {
    throw new Error('System data "userDepartment" field is not a number');
  }
  // userRole
  if (!('userRole' in data)) {
    throw new Error('System data is missing the "userRole" field');
  }
  if (typeof data.userRole !== 'number') {
    throw new Error('System data "userRole" field is not a number');
  }
  // userRoleId
  if (!('userRoleId' in data)) {
    throw new Error('System data is missing the "userRoleId" field');
  }
  if (typeof data.userRoleId !== 'string') {
    throw new Error('System data "userRoleId" field is not a string');
  }
  // isAdmin
  if (!('isAdmin' in data)) {
    throw new Error('System data is missing the "isAdmin" field');
  }
  if (typeof data.isAdmin !== 'boolean') {
    throw new Error('System data "isAdmin" field is not a boolean');
  }
  // userSubsidiary
  if (!('userSubsidiary' in data)) {
    throw new Error('System data is missing the "userSubsidiary" field');
  }
  if (typeof data.userSubsidiary !== 'number') {
    throw new Error('System data "userSubsidiary" field is not a number');
  }
}
