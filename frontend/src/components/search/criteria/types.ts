export type CriteriaFields = {
  active?: string;
  rows?: number;
  level?: string[];
  user?: string;
  script?: string[];
  scripttype?: string[];
  owner?: string[];
  date?: string;
  version?: string[];
};

export interface OptionValues {
  value: string;
  text: string;
}

// the option values types that we get from the server
export enum OptionValuesTypes {
  SCRIPT = 'script',
  SCRIPTTYPE = 'scripttype',
  USER = 'user',
  OWNER = 'owner',
}
