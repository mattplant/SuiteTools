export enum ModalTypes {
  FILE = 'file',
  SCRIPT = 'script',
  SCRIPTLOG = 'scriptlog',
  USER = 'user',
}

// need to have a base type for ModalResult
export type ModalResult = {
  id: number;
};
