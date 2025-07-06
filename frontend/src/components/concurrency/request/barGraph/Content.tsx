import * as d3 from 'd3';
import { ConcurrencyRequestData } from '../types';

type Props = {
  data: ConcurrencyRequestData | undefined;
};

export function ConcurrencyRequestBarGraphContent({ data }: Props) {
  if (!data) {
    return <p>No data available</p>;
  }

  const margin = { top: 20, right: 30, bottom: 30, left: 50 };
  const width = 1024 - margin.left - margin.right;
  const height = 480 - margin.top - margin.bottom;

  // X scale (time)
  const x = d3
    .scaleTime()
    .domain([d3.min(data, (d) => d.startDate)!, d3.max(data, (d) => d.endDate)!])
    .range([0, width]);

  // Y scale (index)
  const y = d3
    .scaleBand()
    .domain(data.map((_, i) => i.toString()))
    .range([0, height])
    .padding(0.2);

  return (
    <>
      <svg width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {data!.map((d, i) => (
            <g key={i}>
              {/* X Axis */}
              {i === data.length - 1 && (
                <g transform={`translate(0, ${height})`}>
                  <line x1={0} x2={width} y1={0} y2={0} stroke="#333" />
                  {x.ticks(5).map((tick, idx) => (
                    <g key={idx} transform={`translate(${x(tick)}, 0)`}>
                      <line y2={6} stroke="#333" />
                      <text y={20} textAnchor="middle" fontSize={12} fill="#333">
                        {d3.timeFormat('%H:%M:%S')(tick as Date)}
                      </text>
                    </g>
                  ))}
                </g>
              )}
              {/* Y Axis */}
              <text
                x={-10}
                y={y(i.toString())! + y.bandwidth() / 2}
                textAnchor="end"
                alignmentBaseline="middle"
                fontSize={12}
                fill="#333"
              >
                {i + 1}
              </text>
              {/* Bars */}
              <rect
                x={x(d.startDate)}
                y={y(i.toString())!}
                width={x(d.endDate) - x(d.startDate)}
                height={y.bandwidth()}
              />
            </g>
          ))}
        </g>
      </svg>
    </>
  );
}
