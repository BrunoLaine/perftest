// import React, { useState, useEffect } from 'react';
import React, { Component } from 'react';
import { Chart } from 'react-google-charts';

class LineDiagram extends Component {
  constructor(props) {
    super(props);
    this.state = { data: null };
    this.prevSinceDate = null;
  }

  componentDidUpdate() {
    const { since } = this.props;
    if (this.prevSinceDate !== since) {
      this.fetchData();
    }
  }

  fetchData() {
    const { backendUrl, since } = this.props;
    this.prevSinceDate = since;
    const params = since ? `?since=${since.toISOString()}` : '';
    fetch(backendUrl + params)
      .then((response) => response.json())
      .then((json) => {
        this.setState({ data: json });
      });
  }

  render() {
    const { data: ressourcesData } = this.state;
    if (!ressourcesData) return (<span>loading...</span>);
    if (!ressourcesData.length) return (<span>No data for this metric</span>);

    const graphData = ressourcesData.map((row, index) => {
      if (index === 0) {
        return row;
      }
      const ts = row[0];
      const newRow = [new Date(ts), ...row.slice(1)];
      return newRow;
    });

    const { since } = this.props;
    const options = {
      title: 'Loading time per ressource',
      curveType: 'function',
      legend: { position: 'right' },
      vAxis: { title: 'Time in ms', viewWindow: { min: 0 } },
      hAxis: { title: 'Time of sample', viewWindow: { min: since, max: new Date() } },
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
}

export default LineDiagram;
