/* eslint-disable no-unused-vars */
import './App.css';
import React, { useState, useEffect } from 'react';
import JavascriptRunningTimeDiagram from './components/JavascriptRunningTimeDiagram';
import RessourcesTimeDiagram from './components/RessourcesTimeDiagram';
import UserTimingsDiagram from './components/UserTimingsDiagram';

function getData() {
  const url = 'http://www.localhost:3001/metrics';
  return fetch(url)
    .then((response) => response.json())
    .then((json) => json)
    .catch((error) => {
      console.error(error);
      return error;
    });
}

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getData().then((newData) => {
      setData(newData);
    });
  }, []);
  if (!data.metrics) return (<span>loading...</span>);
  return (
    <div className="App">
      <h1>
        Performance metrics for
        {' '}
        {data.url}
      </h1>
      <h2>Javascript Running time</h2>
      <JavascriptRunningTimeDiagram data={data.metrics} />
      <h2>Ressources timing</h2>
      <RessourcesTimeDiagram data={data.metrics} />
      <h2>User marks timing</h2>
      <UserTimingsDiagram data={data.metrics} />
    </div>
  );
}

export default App;
