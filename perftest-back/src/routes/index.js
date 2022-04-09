const express = require('express');

class Router {
  constructor(metricsHandler) {
    this.router = express.Router();
    this.router.get('/', (req, res) => {
      res.send('Welcome to perftest backend');
    });

    this.metricsHandler = metricsHandler;
    this.router.get('/metricsNames', (req, res) => {
      res.send(metricsHandler.getMetricsNames());
    });
    this.router.get('/metrics', async (req, res) => {
      const { since } = req.query;
      const { until } = req.query;
      try {
        res.send(await metricsHandler.getMetrics(since, until));
      } catch (error) {
        res.send(error.message);
      }
    });
    this.router.delete('/metrics', async (req, res) => {
      res.send(await metricsHandler.deleteMetrics());
    });
  }

  getRoutes() {
    return this.router;
  }
}

module.exports = Router;
