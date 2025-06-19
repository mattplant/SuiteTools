export type CriteriaFields = {
  active?: string;
  completed?: string;
  createddate?: string;
  detail?: string;
  files?: string[];
  filetypes?: string[];
  integrations?: string[];
  integrationName?: string;
  job?: string;
  lastmodifieddate?: string;
  levels?: string[];
  owners?: string[];
  roleName?: string;
  roles?: string[];
  rows?: number;
  scriptnames?: string[];
  scripttypes?: string[];
  title?: string;
  tokenName?: string;
  userName?: string;
  users?: string[];
  versions?: string[];
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
  JOB = 'job',
  OWNER = 'owner',
  ROLE = 'role',
  SCRIPT = 'script',
  SCRIPTTYPE = 'scripttype',
  USER = 'user',
}
