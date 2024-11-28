import { SystemData } from './types';

type Props = {
  data: SystemData;
};

export function SystemShow({ data }: Props) {
  return (
    <div id="system">
      <h2 className="text-xl font-bold text-slate-900">System</h2>
      <p>Account: {data.accountId}</p>
      <p>Environment Type: {data.envType}</p>
      <p>Account: {data.version}</p>
      <p>Account: {data.processorCount}</p>
      <p>Account: {data.queueCount}</p>
      <h2 className="text-xl font-bold text-slate-900">User</h2>
      <p>Id: {data.userId}</p>
      <p>Name: {data.userName}</p>
      <p>Email: {data.userEmail}</p>
      <p>Location: {data.userLocation}</p>
      <p>Department: {data.userDepartment}</p>
      <p>Role: {data.userRole}</p>
      <p>Role Id: {data.userRoleId}</p>
      <p>Admin?: {data.isAdmin}</p>
      <p>Subsidiary: {data.userSubsidiary}</p>
    </div>
  );
}
