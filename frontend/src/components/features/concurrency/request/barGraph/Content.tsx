// biome-ignore-all lint/suspicious/noArrayIndexKey: every map here renders a positional d3 chart mark. The arrays are regenerated wholesale on data change and never reordered or spliced, so the index is the identity. Data-derived keys were tried and reverted in #75 because this environment cannot render the concurrency screens (no NetSuite APM), so the change could not be visually verified. See #81.
import * as d3 from "d3";
import { bandPosition } from "../../bandPosition";
import type { ConcurrencyRequestData } from "../types";

type Props = { data: ConcurrencyRequestData };

export function ConcurrencyRequestBarGraphContent({ data }: Props) {
  if (!data) {
    return <p>No data available</p>;
  }

  const margin = { top: 20, right: 30, bottom: 30, left: 50 };
  const width = 1024 - margin.left - margin.right;
  const height = 480 - margin.top - margin.bottom;

  // `d3.min`/`max` return undefined for an empty array. The wrapper only renders this
  // chart when `data` is set, but an empty array is still truthy — so narrow here rather
  // than assert, and an empty result shows the same message instead of a NaN domain.
  const firstStart = d3.min(data, (d) => d.startDate);
  const lastEnd = d3.max(data, (d) => d.endDate);
  if (firstStart === undefined || lastEnd === undefined) {
    return <p>No data available</p>;
  }

  // X scale (time)
  const x = d3.scaleTime().domain([firstStart, lastEnd]).range([0, width]);

  // Y scale (index)
  const y = d3
    .scaleBand()
    .domain(data.map((_, i) => i.toString()))
    .range([0, height])
    .padding(0.2);

  return (
    <svg width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
      <title>Concurrency requests over time</title>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {data.map((d, i) => (
          <g key={i}>
            {/* X Axis */}
            {i === data.length - 1 && (
              <g transform={`translate(0, ${height})`}>
                <line x1={0} x2={width} y1={0} y2={0} stroke="#333" />
                {x.ticks(5).map((tick, idx) => (
                  <g key={idx} transform={`translate(${x(tick)}, 0)`}>
                    <line y2={6} stroke="#333" />
                    <text y={20} textAnchor="middle" fontSize={12} fill="#333">
                      {d3.timeFormat("%H:%M:%S")(tick as Date)}
                    </text>
                  </g>
                ))}
              </g>
            )}
            {/* Y Axis */}
            <text
              x={-10}
              y={bandPosition(y, i.toString()) + y.bandwidth() / 2}
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
              y={bandPosition(y, i.toString())}
              width={x(d.endDate) - x(d.startDate)}
              height={y.bandwidth()}
            />
          </g>
        ))}
      </g>
    </svg>
  );
}
