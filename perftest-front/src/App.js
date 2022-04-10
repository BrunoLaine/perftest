/* eslint-disable no-unused-vars */
import './App.css';
import React, { useState, useEffect } from 'react';
import JavascriptRunningTimeDiagram from './components/JavascriptRunningTimeDiagram';
import RessourcesTimeDiagram from './components/RessourcesTimeDiagram';
import UserTimingsDiagram from './components/UserTimingsDiagram';

function getData(backendUrl) {
  return fetch(`${backendUrl}/url`)
    .then((response) => response.text())
    .catch((error) => {
      console.error(error);
      return error;
    });
}

function App() {
  const backendUrl = 'http://www.localhost:3001';
  const [targetUrl, setData] = useState([]);

  useEffect(() => {
    getData(backendUrl).then((newData) => {
      setData(newData);
    });
  }, []);
  if (!targetUrl) return (<span>loading...</span>);
  return (
    <div className="App">
      <h1>
        Performance metrics for
        {' '}
        {targetUrl}
      </h1>
      <h2>Javascript Running time</h2>
      <JavascriptRunningTimeDiagram backendUrl={backendUrl} />
      <h2>Ressources timing</h2>
      <RessourcesTimeDiagram backendUrl={backendUrl} />
      <h2>User marks timing</h2>
      <UserTimingsDiagram backendUrl={backendUrl} />
    </div>
  );
}

export default App;
