import { ResultsTypes } from './types';
// file
import { File } from 'shared';
import { FileResult } from '../../features/file/RecordResult';
// integration
import { Integration } from 'shared';
import { IntegrationResult } from '../../features/integration/RecordResult';
// job
import { JobBundle } from 'shared';
import { JobResult } from '../../features/job/RecordResult';
// jobRun
import { JobRun } from 'shared';
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
import { ScriptLog } from 'shared';
import { ScriptLogResult } from '../../features/scriptLog/RecordResult';
// soapLog
import { SoapLogBundle } from 'shared';
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
        File.assert(data);
        return <FileResult data={data} modal={true} />;
      case ResultsTypes.INTEGRATION:
        Integration.assert(data);
        return <IntegrationResult data={data} modal={true} />;
      case ResultsTypes.JOB:
        JobBundle.assert(data);
        return <JobResult data={data} modal={true} />;
      case ResultsTypes.JOBRUN:
        JobRun.assert(data);
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
        ScriptLog.assert(data);
        return <ScriptLogResult data={data} modal={true} />;
      case ResultsTypes.SOAPLOG:
        SoapLogBundle.assert(data);
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
