import { ConcurrencySummaryHeatMapContent } from './Content.tsx';
import { ConcurrencySummaryData } from '../types.ts';

type Props = {
  data: ConcurrencySummaryData | undefined;
};

export function ConcurrencySummaryHeatMapWrapper({ data }: Props) {
  return (
    <>
      {data && (
        <>
          <h3 className="text-lg font-bold text-slate-900">Estimated Concurrency Peaks</h3>
          <p className="text-sm text-gray-500">
            Below are the estimated concurrency peaks for the selected date range.
          </p>
          <p className="text-sm text-gray-500">
            <b>Click on a cell in the heatmap to view its details.</b> From there you can further drill in to see the
            incoming requests.
          </p>
          <p className="text-sm text-gray-500">
            The darker shade of blue, the higher number of concurrency requests for that hour. Yellow indicates that the
            concurrency limit was exceeded. Red indicates that there were concurrency violations.
          </p>
          <div style={{ position: 'relative' }}>
            <ConcurrencySummaryHeatMapContent data={data} />
          </div>
          <style>
            {`
              .legend {
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                gap: 1rem;
                margin-top: 1rem;
                color: #1e293b;
                font-size: 12px;
              }
              .legend-content {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
              }
              .legend-row {
                display: flex;
                gap: 0.5rem;
              }
              .legend-box {
                width: 24px;
                height: 24px;
              }
              .legend-label {
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 9px;
              }
            `}
          </style>
          <div className="legend">
            <div style={{ fontWeight: 'bold' }}>Estimated Rounded Rate Percentages</div>
            <div className="legend-content">
              <div className="legend-row">
                <div className="legend-box" style={{ backgroundColor: '#FFFFFF' }}></div>
                <div className="legend-box" style={{ backgroundColor: '#E8F1F9' }}></div>
                <div className="legend-box" style={{ backgroundColor: '#D1E4F4' }}></div>
                <div className="legend-box" style={{ backgroundColor: '#BAD6EE' }}></div>
                <div className="legend-box" style={{ backgroundColor: '#A3C8E8' }}></div>
                <div className="legend-box" style={{ backgroundColor: '#FBD38D' }}></div>
                <div className="legend-box" style={{ backgroundColor: '#F56565' }}></div>
              </div>
              <div className="legend-row">
                <div className="legend-box legend-label">0</div>
                <div className="legend-box legend-label">25</div>
                <div className="legend-box legend-label">50</div>
                <div className="legend-box legend-label">75</div>
                <div className="legend-box legend-label">100</div>
                <div className="legend-box legend-label">100+</div>
                <div className="legend-box legend-label">Error</div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
