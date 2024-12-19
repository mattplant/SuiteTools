export enum ModalTypes {
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

// need to have a base type for ModalResult
export type ModalResult = {
  id: number;
};
