import * as d3 from 'd3';
import { ConcurrencyDetailData } from '../types';

type Props = {
  data: ConcurrencyDetailData | undefined;
};

export function ConcurrencyDetailBarGraphContent({ data }: Props) {
  if (!data) {
    return <p>No data available</p>;
  }

  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const width = 1024 - margin.left - margin.right;
  const height = 480 - margin.top - margin.bottom;

  const scaleX = d3
    .scaleBand()
    .domain(data.concurrency.concurrency.map(([timestamp]) => timestamp.toString()))
    .range([0, width])
    .padding(0.3);

  return (
    <>
      <svg width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {data!.concurrency.concurrency.map((d, i) => (
            <g key={i} transform={`translate(${scaleX(d[0].toString())!}, 0)`}>
              {(() => {
                const yFactor = height / data!.concurrency.overview.peakConcurrency.value;
                const lineHeight = d[1] * yFactor;
                return (
                  <>
                    {' '}
                    <a href={`#/concurrencyRequest/${d[0]}/${d[0] + 60 * 1000}`} target="_blank" rel="noreferrer">
                      <rect x={0} y={height - lineHeight} width={scaleX.bandwidth()} height={lineHeight} />
                      {d[1] > 0 && (
                        <text x={scaleX.bandwidth() / 2} y={height - lineHeight - 5} textAnchor="middle" fontSize={12}>
                          {d[1]}
                        </text>
                      )}
                    </a>
                    <text x={scaleX.bandwidth() / 2} y={height + 15} textAnchor="middle" fontSize={12} fill="black">
                      {new Date(d[0]).getMinutes() % 5 === 0 || new Date(d[0]).getMinutes() == 59
                        ? new Date(d[0]).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          })
                        : ''}
                    </text>
                  </>
                );
              })()}
            </g>
          ))}
        </g>
      </svg>
    </>
  );
}
