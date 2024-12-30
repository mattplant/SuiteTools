export type CriteriaFields = {
  active?: string;
  createddate?: string;
  detail?: string;
  file?: string[];
  filetype?: string[];
  integration?: string; // TODO remove or fix
  integrationName?: string;
  lastmodifieddate?: string;
  level?: string[];
  owner?: string[];
  rows?: number;
  roles?: string[];
  roleName?: string;
  scriptname?: string[];
  scripttype?: string[];
  title?: string;
  tokenName?: string;
  users?: string[];
  userName?: string;
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
