# Prisma Media Perftest

Prisma Media Perftest is a tool used for website profiling. It uses Google's pagespeed Insight API to collect the performance data and google graph to display it.

## Installation

1. Install docker and docker-compose cf. 
https://docs.docker.com/compose/install/
2. Set your google API key in a .env file
```bash
echo "APIKEY=<your API key>" > .env
```
3. Start the application
```bash
docker-compose up -d
```

## Usage
Wait a few minutes for the data to be collected. Visit the front-end on localhost:3000. 

## Troubleshooting
Check that the api key was set properly and that the connexion to the database doesn't fail with:
```bash
docker-compose logs perftest-back
```

## Backend APIs
- get /url 
  - returns the url currently monitored 
- get /metrics
  - returns the raw metrics for the selected timeframe
  - query params: since, until, url: can return data from url not currently monitored
- get /metrics/(metricsType) 
  - returns the metrics of the selected type formatted for graphing
  - query params: since, until, url
- delete /metrics
  - delete all metrics for selected url
  - query params: url

Note: the default url is the currently monitored and the default timeframe is one hour.

## Running in dev mode
1. Start the database with `docker-compose up -d mongo` 
2. Start the backend with `cd perftest-back && npm run watch <url to monitor> <polling interval> <port>` 
3. Start the frontend with `cd perftest-front && npm start`

Note: the frontend will display the data from the url currently monitored by the backend by default.

## To do
- add unit testing 
- add a proper logger
- add swagger

## License
[MIT](https://choosealicense.com/licenses/mit/)