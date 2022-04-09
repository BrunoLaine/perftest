/* eslint-disable no-unused-vars */
import './App.css';
import React, { useState, useEffect } from 'react';
import JavascriptRunningTimeDiagram from "./components/JavascriptRunningTimeDiagram";
import RessourcesTimeDiagram from './components/RessourcesTimeDiagram';

function getData() {
  const url = 'http://www.localhost:3001/metrics';
  return fetch(url)
    .then(response => {
      return response.json()}
      )
    .then(json => {
      return json;
    })
    .catch(error=>{
      return error;
    });
}

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getData().then(data => {
      setData(data);
    })  
  }, []);

  if(!data.length) return (<span>loading...</span>);

  return (
    <div className="App">
      <h1>Performance metrics for https://voici.com:</h1>
      <JavascriptRunningTimeDiagram data={data} />
      <RessourcesTimeDiagram data={data} />
    </div>
  );
}

export default App;
