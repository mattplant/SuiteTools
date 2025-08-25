// TODO: remove after verifying refactored netSuiteClient.ts works as expected

export interface NotFound {
  message: string;
}

export enum PostEndpoint {
  INITIATEJOB = 'initiateJob',
}

export enum PutEndpoint {
  SETTINGS = 'settings',
}

export type RequestBody = {
  endpoint: string;
  data: object;
};

export type RequestResponse = {
  status: number;
  data: object;
  message?: string;
};

export type HttpResponse = {
  status: number;
};
