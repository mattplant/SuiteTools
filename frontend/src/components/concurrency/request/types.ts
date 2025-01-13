export type CriteriaFields = {
  startDate: string;
  endDate: string;
  // TODO add integrationId: string;
};

interface ConcurrencyRequestRow {
  date: string;
  email: string;
  executionTime: number;
  status: string;
  totalRecords: number;
  operationId: string;
  frhtId?: string;
}

export interface ConcurrencyRequestRows extends Array<ConcurrencyRequestRow> {}

interface ConcurrencyRequestDataRow {
  date: number;
  email: string;
  executionTime: number;
  status: string;
  totalRecords: number;
  operationId: string;
  frhtId?: string;
}

export interface ConcurrencyRequestData extends Array<ConcurrencyRequestDataRow> {}
