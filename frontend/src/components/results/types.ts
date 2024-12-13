// need to have a base type for ModalResult
export type ModalResult = {
  id: number;
};

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
  //     "File": 2,
  //     "Integration": 3,
  //     "Job": 4,
  //     "Role": 5,
  //     "Script": 6,
  //     "Token": 7,
  //     "User": 8,
  //   });

  FILE = 'file',
  INTEGRATION = 'integration',
  SCRIPT = 'script',
  SCRIPTLOG = 'scriptlog',
  TOKEN = 'token',
  USER = 'user',
}

export interface SummaryRow {
  id: string;
  totalCount: number;
}
