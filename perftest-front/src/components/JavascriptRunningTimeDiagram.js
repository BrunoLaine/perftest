import React from 'react';
import { Chart } from 'react-google-charts';

export default function JavascriptRunningTimeDiagram({ data: metrics }) {
  const graphData = [['timestamp', 'Javascript running time']]
    .concat(metrics.map(({ timestamp, jsTimings }) => [new Date(timestamp), jsTimings]));
  const options = {
    title: 'Javascript running time',
    curveType: 'function',
    legend: { position: 'right' },
    vAxis: { title: 'Time in ms' },
    hAxis: { title: 'Time of sample' },
  };
  return (
    <Chart
      chartType="LineChart"
      width="100%"
      height="400px"
      data={graphData}
      options={options}
    />
  );
}
