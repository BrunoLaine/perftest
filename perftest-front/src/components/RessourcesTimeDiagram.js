import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';

function getData(backendUrl) {
  return fetch(`${backendUrl}/metrics/ressources`)
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
      return error;
    });
}

export default function RessourcesTimeDiagram({ backendUrl }) {
  const [ressourcesData, setData] = useState([]);
  useEffect(() => {
    getData(backendUrl).then((newData) => {
      setData(newData);
    });
  }, []);

  if (!ressourcesData) return (<span>loading...</span>);
  if (!ressourcesData.length) return (<span>No data for this metric</span>);

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
      data={ressourcesData}
      options={options}
    />
  );
}
