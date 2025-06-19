import { ResultsProps } from './types.ts';
import { RecordResults as FileResults } from '../file/RecordResults.tsx';
import { RecordResults as IntegrationResults } from '../integration/RecordResults.tsx';
import { RecordResults as JobResults } from '../job/RecordResults.tsx';
import { RecordResults as JobRunResults } from '../job/run/RecordResults.tsx';
import { RecordResults as LoginResults } from '../login/RecordResults.tsx';
import { RecordResults as RolesResults } from '../role/RecordResults.tsx';
import { RecordResults as ScriptsResults } from '../script/RecordResults.tsx';
import { RecordResults as ScriptLogsResults } from '../scriptLog/RecordResults.tsx';
import { RecordResults as SoapLogResults } from '../soapLog/RecordResults.tsx';
import { RecordResults as TokenResults } from '../token/RecordResults.tsx';
import { RecordResults as UserResults } from '../user/RecordResults.tsx';

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
