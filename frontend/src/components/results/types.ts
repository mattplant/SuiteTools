// need to have a base type for ModalResult
export type ModalResult = {
  id: number;
};

export function assertIsModalResult(data: unknown): asserts data is ModalResult {
  // check if data is an array
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

export enum ResultsTypes {
  // TODO change these names proper capitalization.  I believe they should be Camel case instead of all CAPS

  // my original code had these.
  //   const ModalType = Object.freeze({
  //     "Employee": 1,
  //     "Job": 4,
  //   });

  FILE = 'file',
  INTEGRATION = 'integration',
  ROLE = 'role',
  SCRIPT = 'script',
  SCRIPTLOG = 'scriptlog',
  TOKEN = 'token',
  USER = 'user',
}

export interface SummaryRow {
  id: string;
  totalCount: number;
}
