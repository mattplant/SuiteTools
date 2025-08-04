import resultsMap from './resultsMap.ts';
import { ResultsProps } from './types.ts';

const ErrorMessage: React.FC = () => {
  return <div>Unsupported recordType in DynamicResultsRenderer</div>;
};

export function DynamicResultsRenderer({ type, rows, setId, setOpenModal }: { type: string } & ResultsProps) {
  const ComponentToRender = resultsMap[type] || ErrorMessage;
  return <ComponentToRender rows={rows} setId={setId} setOpenModal={setOpenModal} />;
}
