import { ResultsProps } from './types.ts';
import { RecordsResults as FileResults } from '../file/RecordsResults.tsx';
import { RecordsResults as IntegrationResults } from '../integration/RecordsResults.tsx';
import { RecordsResults as JobResults } from '../job/RecordResults.tsx';
import { RecordsResults as JobRunResults } from '../job/run/RecordResults.tsx';
import { RecordsResults as LoginResults } from '../login/RecordsResults.tsx';
import { RecordsResults as RolesResults } from '../role/RecordsResults.tsx';
import { RecordsResults as ScriptsResults } from '../script/RecordsResults.tsx';
import { RecordsResults as ScriptLogsResults } from '../scriptLog/RecordsResults.tsx';
import { RecordsResults as SoapLogResults } from '../soapLog/RecordsResults.tsx';
import { RecordsResults as TokenResults } from '../token/RecordsResults.tsx';
import { RecordsResults as UserResults } from '../user/RecordsResults.tsx';

interface ResultsMap {
  [key: string]: React.FC<ResultsProps>;
}

const resultMap: ResultsMap = {
  file: FileResults,
  integration: IntegrationResults,
  job: JobResults,
  jobRun: JobRunResults,
  login: LoginResults,
  role: RolesResults,
  script: ScriptsResults,
  scriptlog: ScriptLogsResults,
  soaplog: SoapLogResults,
  token: TokenResults,
  user: UserResults,
};

export default resultMap;
