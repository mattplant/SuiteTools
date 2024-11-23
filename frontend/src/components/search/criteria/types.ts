export type CriteriaFields = {
  active?: string;
  createddate?: string;
  detail?: string;
  file?: string[];
  filetype?: string[];
  lastmodifieddate?: string;
  level?: string[];
  owner?: string[];
  rows?: number;
  scriptname?: string[];
  scripttype?: string[];
  title?: string;
  user?: string;
  version?: string[];
};

export interface OptionValues {
  value: string;
  text: string;
}

// the option values types that we get from the server
export enum OptionValuesTypes {
  FILE = 'file',
  FILETYPE = 'filetype',
  OWNER = 'owner',
  SCRIPT = 'script',
  SCRIPTTYPE = 'scripttype',
  USER = 'user',
}
