export type Settings = {
  devMode: boolean;
  appUrl: string;
  lastLogins: LastLogins;
  // system
  accountId: string;
  envType: string;
  version: string;
  processorCount: number;
  queueCount: number;
  appBundle: string;
  // user
  userId: number;
  userName: string;
  userEmail: string;
  userLocation: number;
  userDepartment: number;
  userRole: string;
  userRoleId: number;
  userSubsidiary: number;
  isAdmin: true;
};

export type NewSettings = {
  cssUrl: string;
  jsUrl: string;
  devMode: boolean;
};

type LastLogins = {
  finished: string;
  data: {
    name: {
      type: string;
      name: string;
    };
    lastLogin: string;
  }[];
};
