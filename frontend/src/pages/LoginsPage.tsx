import type { CriteriaFields } from "../components/shared/criteria/types";
import { getLoginFromResults } from "../adapters/api/login";
import { getLogins } from "../adapters/api/logins";
import { RecordCriteria } from "../components/features/login/RecordCriteria";
import { Results } from "../components/shared/results/Results";
import { ResultsTypes } from "../components/shared/results/types";
import { useEntityList } from "../hooks/useEntityList";

/**
 * Logins page — list login audit rows with criteria filters.
 * @returns The rendered Logins page.
 */
export function LoginsPage(): React.ReactElement {
  const defaultCriteria: CriteriaFields = {
    rows: 250,
    active: "",
    integrationName: "",
    tokenName: "",
    users: [""],
    roles: [""],
  };

  const { setCriteria, results } = useEntityList({ defaultCriteria, fetchList: getLogins });

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Logins</h2>
      <RecordCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      <Results type={ResultsTypes.LOGIN} lines={results} getModalData={getLoginFromResults} />
    </div>
  );
}
