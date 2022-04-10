import React from 'react';
import { Chart } from 'react-google-charts';

export default function RessourcesTimeDiagram({ data: metrics = [] }) {
  // get the list of ressources
  const ressourcesUrls = [];
  try {
    metrics.forEach(({ ressources = [] }) => {
      ressources.forEach(({ url }) => {
        if (!ressourcesUrls.includes(url)) {
          ressourcesUrls.push(url);
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
  // for each datapoint, get the loading time of each ressource
  const dataHeader = ['timestamp'].concat(ressourcesUrls);
  const graphData = [dataHeader];
  metrics.forEach(({ timestamp, ressources }) => {
    const row = [new Date(timestamp)].concat(ressourcesUrls.map((url) => {
      const foundRessource = ressources.find((ressource) => ressource.url === url);
      if (foundRessource) {
        return foundRessource.endTime - foundRessource.startTime;
      }

      return 0;
    }));
    graphData.push(row);
  });
  const options = {
    title: 'Loading time per ressource',
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
