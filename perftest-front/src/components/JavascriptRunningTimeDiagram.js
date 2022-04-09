import React from 'react';
import { Chart } from "react-google-charts";

export default function JavascriptRunningTimeDiagram({data}) {
    const graphData = [["timestamp", "Javascript running time"]]
        .concat(data.map((element) => {return [new Date(element["timestamp"]), element["javascript-running-time"]]}));
    const options = {
        title: "Javascript running time",
        curveType: "function",
        legend: { position: "right" },
    };
    return(
        <Chart
          chartType="LineChart"
          width="100%"
          height="400px"
          data={graphData}
          options={options}
        />
    );
}
