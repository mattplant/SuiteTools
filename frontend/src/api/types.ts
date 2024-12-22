export type RequestBody = {
  endpoint: string;
  data: object;
};

export type Response = {
  // status?: number;
  data: object;
  message?: string;
};

export interface NotFound {
  message: string;
}

export enum SavedEndpoint {
  SETTINGS = 'settings',
}

export enum SaveMethod {
  PUT = 'PUT',
  POST = 'POST',
}

export type SavedData = {
  status: number;
};
