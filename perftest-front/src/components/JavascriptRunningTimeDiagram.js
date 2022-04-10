import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';

function getData(backendUrl) {
  return fetch(`${backendUrl}/metrics/jstimings`)
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
      return error;
    });
}

export default function JavascriptRunningTimeDiagram({ backendUrl }) {
  const [timingsData, setData] = useState([]);
  useEffect(() => {
    getData(backendUrl).then((newData) => {
      setData(newData);
    });
  }, []);

  if (!timingsData) return (<span>loading...</span>);

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
      data={timingsData}
      options={options}
    />
  );
}
