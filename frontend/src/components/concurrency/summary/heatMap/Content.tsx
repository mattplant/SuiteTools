import * as d3 from 'd3';
import { useMemo } from 'react';
import { ConcurrencySummaryData } from '../types';

type Props = {
  data: ConcurrencySummaryData | undefined;
};

export function ConcurrencySummaryHeatMapContent({ data }: Props) {
  const margin = { top: 10, right: 60, bottom: 30, left: 70 };
  const days = data!.concurrency.yCategories;
  const daysCount = days.length;
  const width = 1024;
  const heightPerDay = 40;
  const height = daysCount * heightPerDay + margin.top + margin.bottom;
  const boundsHeight = height - margin.top - margin.bottom;
  const boundsWidth = width - margin.right - margin.left;
  const peaks = data!.concurrency.series.peak;
  const allXGroups = useMemo(() => [...new Set(peaks.map((d) => d[0].toString()))], [peaks]);
  const allYGroups = useMemo(() => [...new Set(peaks.map((d) => d[1].toString()))], [peaks]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const xScale = useMemo(() => d3.scaleBand().range([0, boundsWidth]).domain(allXGroups).padding(0.05), [peaks, width]);
  // console.log('xScale', xScale);
  const yScale = useMemo(
    () => d3.scaleBand().range([boundsHeight, 0]).domain(allYGroups).padding(0.05),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [peaks, height],
  );
  // console.log('yScale', yScale);
  const colorScale = (value: number) => {
    if (value > 100) {
      return '#B87241'; // orange for over the limit
    } else if (value > 75) {
      return '#A3C8E8'; // dark blue
    } else if (value > 50) {
      return '#BAD6EE'; // medium blue
    } else if (value > 25) {
      return '#D1E4F4'; // light blue
    } else if (value > 0) {
      return '#E8F1F9'; // very light blue
    } else if (value < 0) {
      return '#B85B5B'; // red for violations
    } else {
      return '#FFFFFF'; // white for null
    }
  };
  // create the heatmap cell for each data point
  const allShapes = peaks.map((d, i) => {
    const x = xScale(d[0].toString());
    const y = yScale(d[1].toString());
    // skip if any of x, y or count is null
    if (d[2] === null || !x || !y) {
      return;
    }
    return (
      <g key={i}>
        <rect
          cursor="pointer"
          fill={colorScale(d[2])}
          height={yScale.bandwidth()}
          opacity={1}
          r={4}
          rx={5}
          stroke="white"
          width={xScale.bandwidth()}
          x={xScale(d[0].toString())}
          y={yScale(d[1].toString())}
        />
        {d[2] > 0 && (
          <text
            dominantBaseline="middle"
            fontSize={10}
            textAnchor="middle"
            x={xScale(d[0].toString())! + xScale.bandwidth() / 2}
            y={yScale(d[1].toString())! + yScale.bandwidth() / 2}
            fill="black"
          >
            {d[2]}
          </text>
        )}
      </g>
    );
  });
  // add x axis labels
  const xLabels = peaks.map((d, i) => {
    const x = xScale(d[0].toString());
    if (!x) {
      return null;
    }
    const hour = new Date(d[3]);
    const label = hour.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
    return (
      <text
        key={i}
        dominantBaseline="middle"
        fontSize={10}
        textAnchor="middle"
        x={x + xScale.bandwidth() / 2}
        y={boundsHeight + 10}
      >
        {label}
      </text>
    );
  });
  console.log('xLabels', xLabels);
  // add y axis labels
  const yLabels = allYGroups.map((name, i) => {
    const y = yScale(name);
    if (!y) {
      return null;
    }
    const label = new Date(days[i]).toLocaleDateString();
    return (
      <text key={i} dominantBaseline="middle" fontSize={12} textAnchor="end" x={-5} y={y + yScale.bandwidth() / 2}>
        {label}
      </text>
    );
  });

  return (
    <svg height={height} width={width}>
      <g height={boundsHeight} transform={`translate(${[margin.left, margin.top].join(',')})`} width={boundsWidth}>
        {allShapes}
        {xLabels}
        {yLabels}
      </g>
    </svg>
  );
}
