import { ResultsTypes } from './types';
// file
import { FileBundle } from '@suiteworks/suitetools-shared';
import { FileResult } from '../../features/file/RecordResult';
// integration
import { IntegrationBundle } from '@suiteworks/suitetools-shared';
import { IntegrationResult } from '../../features/integration/RecordResult';
// job
import { JobBundle } from '@suiteworks/suitetools-shared';
import { JobResult } from '../../features/job/RecordResult';
// jobRun
import { JobRunBundle } from '@suiteworks/suitetools-shared';
import { JobRunResult } from '../../features/job/run/RecordResult';
// login
import { LoginBundle } from '@suiteworks/suitetools-shared';
import { LoginResult } from '../../features/login/RecordResult';
// role
import { RoleBundle } from '@suiteworks/suitetools-shared';
import { RoleResult } from '../../features/role/RecordResult';
// script
import { ScriptBundle } from '@suiteworks/suitetools-shared';
import { ScriptResult } from '../../features/script/RecordResult';
// scriptLog
import { ScriptLogBundle } from '@suiteworks/suitetools-shared';
import { ScriptLogResult } from '../../features/scriptLog/RecordResult';
// soapLog
import { SoapLogBundle } from '@suiteworks/suitetools-shared';
import { SoapLogResult } from '../../features/soapLog/RecordResult';
// token
import { TokenBundle } from '@suiteworks/suitetools-shared';
import { TokenResult } from '../../features/token/RecordResult';
// user
import { UserBundle } from '@suiteworks/suitetools-shared';
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
        FileBundle.assert(data);
        return <FileResult data={data} modal={true} />;
      case ResultsTypes.INTEGRATION:
        IntegrationBundle.assert(data);
        return <IntegrationResult data={data} modal={true} />;
      case ResultsTypes.JOB:
        JobBundle.assert(data);
        return <JobResult data={data} modal={true} />;
      case ResultsTypes.JOBRUN:
        JobRunBundle.assert(data);
        return <JobRunResult data={data} modal={true} />;
      case ResultsTypes.LOGIN:
        LoginBundle.assert(data);
        return <LoginResult data={data} />;
      case ResultsTypes.ROLE:
        RoleBundle.assert(data);
        return <RoleResult data={data} modal={true} />;
      case ResultsTypes.SCRIPT:
        ScriptBundle.assert(data);
        return <ScriptResult data={data} modal={true} />;
      case ResultsTypes.SCRIPTLOG:
        ScriptLogBundle.assert(data);
        return <ScriptLogResult data={data} modal={true} />;
      case ResultsTypes.SOAPLOG:
        SoapLogBundle.assert(data);
        return <SoapLogResult data={data} modal={true} />;
      case ResultsTypes.TOKEN:
        TokenBundle.assert(data);
        return <TokenResult data={data} modal={true} />;
      case ResultsTypes.USER:
        UserBundle.assert(data);
        return <UserResult data={data} modal={true} />;
      default:
        console.error('ResultsModal type not found:', type);
        break;
    }
  }
}
