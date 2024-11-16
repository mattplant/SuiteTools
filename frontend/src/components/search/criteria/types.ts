export type CriteriaFields = {
  rows?: number;
  level?: string[];
  user?: string;
  scripttype?: string[];
  owner?: string[];
  date?: string;
};

export interface OptionValues {
  value: string;
  text: string;
}

// the option values types that we get from the server
export enum OptionValuesTypes {
  SCRIPTTYPE = 'scripttype',
  USER = 'user',
  OWNER = 'owner',
}
