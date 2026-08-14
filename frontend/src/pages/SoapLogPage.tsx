import { useLoaderData } from "react-router-dom";
import { SoapLogResult } from "../components/features/soapLog/RecordResult";
import type { SoapLogLoaderData } from "../routes/soapLogLoader";

/**
 * Renders the SOAP log detail page.
 * @returns The rendered SOAP log page component.
 */
export function SoapLogPage(): React.JSX.Element {
  const { soapLog } = useLoaderData() as SoapLogLoaderData;

  if (!soapLog || !("id" in soapLog)) {
    return (
      <div className="mx-auto mt-6">
        <h2 className="text-xl font-bold text-slate-900">SOAP Log</h2>
        <p className="mt-4 text-slate-700">SOAP log not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">SOAP Log</h2>
      <br />
      <SoapLogResult data={soapLog} />
    </div>
  );
}
