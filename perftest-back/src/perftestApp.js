const express = require('express');
const GooglePageSpeedColectionService = require('./services/googlePageSpeedApi/dataCollectionService');
const Router = require('./routes/index');

class PerftestApp {
  constructor(url, interval, port) {
    this.url = url;
    this.interval = interval;
    this.port = port;
    this.dataColectionService = new GooglePageSpeedColectionService(this.url, this.interval);
    this.dataColectionService.run();
  }

  run() {
    const router = new Router(this.dataColectionService);
    const expressApp = express();
    expressApp.use('/', router.getRoutes());
    const server = expressApp.listen(this.port, () => {
      console.log(`Express is running on port ${server.address().port}`);
    });
  }
}

module.exports = PerftestApp;
