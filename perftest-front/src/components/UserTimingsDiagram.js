import React from 'react';
import { Chart } from 'react-google-charts';

export default function UserTimingsDiagram({ data: metrics }) {
  // get the list of ressources
  const userMarksNames = [];
  metrics.forEach(({ marks }) => {
    marks.forEach(({ name }) => {
      if (!userMarksNames.includes(name)) {
        userMarksNames.push(name);
      }
    });
  });
  if (!userMarksNames.length) {
    return (
      <span>No User timing marks found, try specifying a longer timeframe or another website</span>
    );
  }
  // for each datapoint, get the loading time of each ressource
  const dataHeader = ['timestamp'].concat(userMarksNames);
  const graphData = [dataHeader];
  metrics.forEach(({ timestamp, marks }) => {
    const row = [new Date(timestamp)].concat(userMarksNames.map((name) => {
      const foundRessource = marks.find((mark) => mark.name === name);
      if (foundRessource) {
        return foundRessource.startTime;
      }

      return 0;
    }));
    graphData.push(row);
  });
  const options = {
    title: 'User marks timings',
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
