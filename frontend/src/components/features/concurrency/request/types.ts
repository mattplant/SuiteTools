export type CriteriaFields = {
  startDate: string;
  endDate: string;
};

interface ConcurrencyRequestRow {
  startDate: string;
  type: string;
  // integrationId: number;
  operation: string;
  endDate: string;
  // scriptId: number;
  integration: string;
  scriptName: string;
  status: string;
  // wouldBeRejected: boolean;
}

/* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
export interface ConcurrencyRequestRows extends Array<ConcurrencyRequestRow> {}

interface ConcurrencyRequestDataRow {
  startDate: number;
  type: string;
  integrationId: number;
  operation: string;
  endDate: number;
  scriptId: number;
  integration: string;
  scriptName: string;
  status: string;
  wouldBeRejected: boolean;
}

/* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
export interface ConcurrencyRequestData extends Array<ConcurrencyRequestDataRow> {}
