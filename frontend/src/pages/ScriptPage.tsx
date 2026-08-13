import { useLoaderData } from 'react-router-dom';
import { ScriptResult } from '../components/features/script/RecordResult';
import type { ScriptLoaderData } from '../routes/scriptLoader';

/**
 * Renders the script page with script details.
 * @returns The rendered script page component.
 */
export function ScriptPage(): React.JSX.Element {
  const { script } = useLoaderData() as ScriptLoaderData;

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">Script</h2>
      <br />
      <ScriptResult data={script} />
    </div>
  );
}
