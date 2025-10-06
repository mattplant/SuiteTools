import { ResultsProps } from './types.ts';
import { RecordResults as FileResults } from '../../features/file/RecordResults.tsx';
import { RecordResults as IntegrationResults } from '../../features/integration/RecordResults.tsx';
import { RecordResults as JobResults } from '../../features/job/RecordResults.tsx';
import { RecordResults as JobRunResults } from '../../features/job/run/RecordResults.tsx';
import { RecordResults as LoginResults } from '../../features/login/RecordResults.tsx';
import { RecordResults as RolesResults } from '../../features/role/RecordResults.tsx';
import { RecordResults as ScriptsResults } from '../../features/script/RecordResults.tsx';
import { RecordResults as ScriptLogsResults } from '../../features/scriptLog/RecordResults.tsx';
import { RecordResults as SoapLogResults } from '../../features/soapLog/RecordResults.tsx';
import { RecordResults as TokenResults } from '../../features/token/RecordResults.tsx';
import { RecordResults as UserResults } from '../../features/user/RecordResults.tsx';

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
