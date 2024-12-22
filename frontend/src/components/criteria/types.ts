export type CriteriaFields = {
  active?: string;
  createddate?: string;
  detail?: string;
  file?: string[];
  filetype?: string[];
  integration?: string;
  lastmodifieddate?: string;
  level?: string[];
  owner?: string[];
  rows?: number;
  role?: string[];
  scriptname?: string[]; // unable to use script as it is already in the URL parameters
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
  INTEGRATION = 'integration',
  OWNER = 'owner',
  ROLE = 'role',
  SCRIPT = 'script',
  SCRIPTTYPE = 'scripttype',
  USER = 'user',
}
