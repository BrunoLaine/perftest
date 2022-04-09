const express = require('express');
const GooglePageSpeedColectionService = require('./services/googlePageSpeedApi/dataCollectionService');
const Router = require('./routes/index');

class PerftestApp {
  constructor() {
    console.error('running constructor ');
    this.dataColectionService = new GooglePageSpeedColectionService('https://www.voici.fr', 60000);
    this.dataColectionService.run();
  }

  run() {
    const router = new Router(this.dataColectionService);
    const expressApp = express();
    expressApp.use('/', router.getRoutes());
    const server = expressApp.listen(3000, () => {
      console.log(`Express is running on port ${server.address().port}`);
    });
  }
}

module.exports = PerftestApp;
