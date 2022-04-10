const express = require('express');
const cors = require('cors');
const GooglePageSpeedCollectionService = require('./services/googlePageSpeedApi/dataCollectionService');
const Router = require('./routes/index');

class PerftestApp {
  constructor(url, interval, port) {
    this.url = url;
    this.interval = interval;
    this.port = port;
    this.dataCollectionService = new GooglePageSpeedCollectionService(this.url, this.interval);
    this.dataCollectionService.run();
  }

  run() {
    const router = new Router(this.dataCollectionService);
    const expressApp = express();
    expressApp.use(cors({ origin: '*' }));
    expressApp.use('/', router.getRoutes());
    const server = expressApp.listen(this.port, () => {
      console.log(`Express is running on port ${server.address().port}`);
    });
  }
}

module.exports = PerftestApp;
