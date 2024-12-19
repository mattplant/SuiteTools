import { ResultsProps } from './types.ts';
import { RecordsResults as FileResults } from '../file/RecordsResults.tsx';
import { RecordsResults as IntegrationResults } from '../integration/RecordsResults.tsx';
import { RecordsResults as RolesResults } from '../role/RecordsResults.tsx';
import { RecordsResults as ScriptsResults } from '../script/RecordsResults.tsx';
import { RecordsResults as ScriptLogsResults } from '../scriptLog/RecordsResults.tsx';
import { RecordsResults as TokenResults } from '../token/RecordsResults.tsx';
import { RecordsResults as UserResults } from '../user/RecordsResults.tsx';

interface ResultsMap {
  [key: string]: React.FC<ResultsProps>;
}

const resultMap: ResultsMap = {
  file: FileResults,
  integration: IntegrationResults,
  role: RolesResults,
  script: ScriptsResults,
  scriptlog: ScriptLogsResults,
  token: TokenResults,
  user: UserResults,
};

export default resultMap;
