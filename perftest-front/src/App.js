import './App.css';
import React, { Component } from 'react';
// import JavascriptRunningTimeDiagram from './components/JavascriptRunningTimeDiagram';
import LineDiagram from './components/LineDiagram';
// import UserTimingsDiagram from './components/UserTimingsDiagram';

class App extends Component {
  constructor() {
    super();
    this.state = { targetUrl: 'https://www.voici.fr', since: new Date(new Date() - 60 * 60 * 1000) };
    this.backendUrl = 'http://www.localhost:3001';
  }

  componentDidMount() {
    fetch(`${this.backendUrl}/url`)
      .then((response) => response.text())
      .then((targetUrl) => {
        this.setState({ targetUrl });
      })
      .catch((error) => {
        console.error(error);
        return error;
      });
  }

  setSinceDate(event) {
    const { target: { value } } = event;
    const since = new Date(Date.now() - value * 60 * 60 * 1000);
    this.setState({ since });
  }

  render() {
    const { targetUrl, since } = this.state;
    return (
      <div className="App">
        <h1>
          Performance metrics for
          {' '}
          {targetUrl}
          <br />
          Since:
          {' '}
          {since ? since.toLocaleString() : ' begining'}
          {' '}
          <select defaultValue={1} onChange={(event) => this.setSinceDate(event)}>
            <option value="1">1 hour</option>
            <option value="3">3 hours</option>
            <option value="12">12 hours</option>
            <option value="48">48 hours</option>
          </select>
        </h1>
        <h2>Javascript Running time</h2>
        <LineDiagram backendUrl={`${this.backendUrl}/metrics/jstimings`} since={since} />
        <h2>Ressources timing</h2>
        <LineDiagram backendUrl={`${this.backendUrl}/metrics/ressources`} since={since} />
        <h2>User marks timing</h2>
        <LineDiagram backendUrl={`${this.backendUrl}/metrics/marks`} since={since} />
      </div>
    );
  }
}

export default App;
