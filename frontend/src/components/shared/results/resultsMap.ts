import type { ResultsProps } from "./types";
import { RecordResults as FileResults } from "../../features/file/RecordResults";
import { RecordResults as IntegrationResults } from "../../features/integration/RecordResults";
import { RecordResults as JobResults } from "../../features/job/RecordResults";
import { RecordResults as JobRunResults } from "../../features/job/run/RecordResults";
import { RecordResults as LoginResults } from "../../features/login/RecordResults";
import { RecordResults as RolesResults } from "../../features/role/RecordResults";
import { RecordResults as ScriptsResults } from "../../features/script/RecordResults";
import { RecordResults as ScriptLogsResults } from "../../features/scriptLog/RecordResults";
import { RecordResults as SoapLogResults } from "../../features/soapLog/RecordResults";
import { RecordResults as TokenResults } from "../../features/token/RecordResults";
import { RecordResults as UserResults } from "../../features/user/RecordResults";

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
