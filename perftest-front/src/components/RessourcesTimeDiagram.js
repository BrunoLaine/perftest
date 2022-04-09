import React from 'react';
import { Chart } from "react-google-charts";

export default function RessourcesTimeDiagram({data}) {
    //get the list of ressources
    let ressourcesUrls = [];
    data.forEach(({ressources})=>{
        ressources.forEach(({url}) => {
            if(!ressourcesUrls.includes(url)){
                ressourcesUrls.push(url);
            }
        });
    });
    //for each datapoint, get the loading time of each ressource
    let dataHeader = ["timestamp"].concat(ressourcesUrls);
    let graphData = [dataHeader];
    data.forEach(({timestamp, ressources}) => {
        const row = [new Date(timestamp)].concat(ressourcesUrls.map((url, index) => {
            const foundRessource = ressources.find((ressource) => ressource.url === url);
            if(foundRessource){
                return foundRessource.endTime - foundRessource.startTime;
            }
            else {
                return 0
            };
        }));
        graphData.push(row);
    });
    const options = {
        title: "Loading time per ressource",
        curveType: "function",
        legend: { position: "right" },
        hAxis: {
          format: 'M/d/yy',
        },
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
