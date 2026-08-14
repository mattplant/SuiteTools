import type { CriteriaFields } from "../components/shared/criteria/types";
import { getUser } from "../adapters/api/user";
import { getUsers } from "../adapters/api/users";
import { RecordCriteria } from "../components/features/user/RecordCriteria";
import { Results } from "../components/shared/results/Results";
import { ResultsTypes } from "../components/shared/results/types";
import { useEntityList } from "../hooks/useEntityList";

/**
 * UsersPage component displays the users list and criteria filter.
 * @returns The rendered UsersPage component.
 */
export function UsersPage(): React.ReactElement {
  const defaultCriteria: CriteriaFields = { active: "", roles: [""], owners: [""] };

  const { setCriteria, results } = useEntityList({ defaultCriteria, fetchList: getUsers });

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Users</h2>
      <RecordCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      <Results type={ResultsTypes.USER} lines={results} getModalData={getUser} />
    </div>
  );
}
