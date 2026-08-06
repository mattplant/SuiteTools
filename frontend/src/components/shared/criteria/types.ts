export type CriteriaFields = {
  active?: string;
  completed?: string;
  dateCreated?: string;
  detail?: string;
  files?: string[];
  fileTypes?: string[];
  integrations?: string[];
  integrationName?: string;
  job?: string;
  lastModifiedDate?: string;
  levels?: string[];
  owners?: string[];
  roleName?: string;
  roles?: string[];
  rows?: number;
  scriptNames?: string[];
  scriptTypes?: string[];
  title?: string;
  tokenName?: string;
  userName?: string;
  users?: string[];
  versions?: string[];
  // fields for advanced time picker
  timeMode?: string; // 'now' or 'custom'
  customDateTime?: number | undefined; // timestamp in milliseconds
  customDuration?: string; // e.g., '1', '15', 'hour', 'day', 'week', 'all'
};

export interface OptionValues {
  value: string;
  text: string;
}

// the option values types that we get from the server
export enum OptionValuesTypes {
  FILE = 'file',
  FILETYPE = 'fileType',
  INTEGRATION = 'integration',
  JOB = 'job',
  OWNER = 'owner',
  ROLE = 'role',
  SCRIPT = 'script',
  SCRIPTTYPE = 'scriptType',
  USER = 'user',
}
