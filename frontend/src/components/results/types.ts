// need to have a base type for ModalResult
export type ModalResult = {
  id: number;
};

export function assertIsModalResult(data: unknown): asserts data is ModalResult {
  if (!Array.isArray(data)) {
    throw new Error('ModalResult data is not an array');
  }
  // check the data for the required fields
  // id
  if (!('id' in data)) {
    throw new Error('ModalResult data is missing the "id" field');
  }
  if (typeof data.id !== 'number') {
    throw new Error('ModalResult data "id" field is not a number');
  }
}

export type ResultsProps = {
  rows: unknown[];
  setId: (id: number) => void;
  setOpenModal: (openModal: boolean) => void;
};

// using ALL CAPS since we need enum to be of type string for ResultsMap
export enum ResultsTypes {
  FILE = 'file',
  INTEGRATION = 'integration',
  LOGIN = 'login',
  ROLE = 'role',
  SCRIPT = 'script',
  SCRIPTLOG = 'scriptlog',
  SOAPLOG = 'soaplog',
  TOKEN = 'token',
  USER = 'user',
}

export interface SummaryRow {
  id: string;
  totalCount: number;
}
