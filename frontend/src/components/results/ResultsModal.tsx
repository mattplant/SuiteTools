import { ResultsTypes } from './types';
// file
import { assertIsFile } from '../file/types';
import { FileResult } from '../file/RecordResult';
// integration
import { assertIsIntegration } from '../integration/types';
import { IntegrationResult } from '../integration/RecordResult';
// job
import { assertIsJob } from '../job/types';
import { JobResult } from '../job/RecordResult';
// jobRun
import { assertIsJobRun } from '../job/run/types';
import { JobRunResult } from '../job/run/RecordResult';
// login
import { assertIsLogin } from '../login/types';
import { LoginResult } from '../login/RecordResult';
// role
import { assertIsRole } from '../role/types';
import { RoleResult } from '../role/RecordResult';
// script
import { assertIsScript } from '../script/types';
import { ScriptResult } from '../script/RecordResult';
// scriptLog
import { assertIsScriptLog } from '../scriptLog/types';
import { ScriptLogResult } from '../scriptLog/RecordResult';
// soapLog
import { assertIsSoapLog } from '../soapLog/types';
import { SoapLogResult } from '../soapLog/RecordResult';
// token
import { assertIsToken } from '../token/types';
import { TokenResult } from '../token/RecordResult';
// user
import { assertIsUser } from '../user/types';
import { UserResult } from '../user/RecordResult';

type Props = {
  type: ResultsTypes;
  loading: boolean;
  data: unknown;
};

export function ResultsModal({ type, loading, data }: Props) {
  console.log('ResultsModal() initiated', type, loading, data);

  if (loading) {
    return 'Loading...';
  } else if (!data) {
    return 'No records found.';
  } else {
    // display the modal
    switch (type) {
      case ResultsTypes.FILE:
        assertIsFile(data);
        return <FileResult data={data} modal={true} />;
      case ResultsTypes.INTEGRATION:
        assertIsIntegration(data);
        return <IntegrationResult data={data} modal={true} />;
      case ResultsTypes.JOB:
        assertIsJob(data);
        return <JobResult data={data} modal={true} />;
      case ResultsTypes.JOBRUN:
        assertIsJobRun(data);
        return <JobRunResult data={data} modal={true} />;
      case ResultsTypes.LOGIN:
        assertIsLogin(data);
        return <LoginResult data={data} />;
      case ResultsTypes.ROLE:
        assertIsRole(data);
        return <RoleResult data={data} modal={true} />;
      case ResultsTypes.SCRIPT:
        assertIsScript(data);
        return <ScriptResult data={data} modal={true} />;
      case ResultsTypes.SCRIPTLOG:
        assertIsScriptLog(data);
        return <ScriptLogResult data={data} modal={true} />;
      case ResultsTypes.SOAPLOG:
        assertIsSoapLog(data);
        return <SoapLogResult data={data} modal={true} />;
      case ResultsTypes.TOKEN:
        assertIsToken(data);
        return <TokenResult data={data} modal={true} />;
      case ResultsTypes.USER:
        assertIsUser(data);
        return <UserResult data={data} modal={true} />;
      default:
        console.error('ResultsModal type not found:', type);
        break;
    }
  }
}
