export enum ModalTypes {
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
  USER = 'user',
}

// need to have a base type for ModalResult
export type ModalResult = {
  id: number;
};
