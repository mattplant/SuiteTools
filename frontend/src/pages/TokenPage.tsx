import { useLoaderData } from 'react-router-dom';
import { TokenResult } from '../components/features/token/RecordResult';
import type { TokenLoaderData } from '../routes/tokenLoader';

/**
 * Renders the token detail page.
 * @returns The rendered token page component.
 */
export function TokenPage(): React.JSX.Element {
  const { token } = useLoaderData() as TokenLoaderData;

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">Token</h2>
      <br />
      <TokenResult data={token} />
    </div>
  );
}
