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
  /** SuiteQL-friendly `YYYY-MM-DD HH24:MI:SS` (local wall clock), set by advanced time picker */
  customDateTime?: string | undefined;
  /** Lookback window in minutes (`1`, `15`, `60`, `1440`, …) */
  customDuration?: string;
};

export interface OptionValues {
  value: string;
  text: string;
}

// the option values types that we get from the server
export enum OptionValuesTypes {
  FILE = "file",
  FILETYPE = "fileType",
  INTEGRATION = "integration",
  JOB = "job",
  OWNER = "owner",
  ROLE = "role",
  SCRIPT = "script",
  SCRIPTTYPE = "scriptType",
  USER = "user",
}
