import { ResultsTypes } from './types';
// file
import { assertIsFile } from '../../features/file/types';
import { FileResult } from '../../features/file/RecordResult';
// integration
import { assertIsIntegration } from '../../features/integration/types';
import { IntegrationResult } from '../../features/integration/RecordResult';
// job
import { assertIsJob } from '../../features/job/types';
import { JobResult } from '../../features/job/RecordResult';
// jobRun
import { assertIsJobRun } from '../../features/job/run/types';
import { JobRunResult } from '../../features/job/run/RecordResult';
// login
import { assertIsLogin } from '../../features/login/types';
import { LoginResult } from '../../features/login/RecordResult';
// role
import { assertIsRole } from '../../features/role/types';
import { RoleResult } from '../../features/role/RecordResult';
// script
import { assertIsScript } from '../../features/script/types';
import { ScriptResult } from '../../features/script/RecordResult';
// scriptLog
import { assertValidScriptLog } from 'shared';
import { ScriptLogResult } from '../../features/scriptLog/RecordResult';
// soapLog
import { assertValidSoapLog } from 'shared';
import { SoapLogResult } from '../../features/soapLog/RecordResult';
// token
import { assertIsToken } from '../../features/token/types';
import { TokenResult } from '../../features/token/RecordResult';
// user
import { assertIsUser } from '../../features/user/types';
import { UserResult } from '../../features/user/RecordResult';

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
        assertValidScriptLog(data);
        return <ScriptLogResult data={data} modal={true} />;
      case ResultsTypes.SOAPLOG:
        assertValidSoapLog(data);
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
