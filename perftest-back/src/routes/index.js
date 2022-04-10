const express = require('express');

class Router {
  constructor(metricsHandler) {
    this.defaultHistory = 60 * 60 * 1000; // 1 hour
    this.router = express.Router();

    this.router.get('/', (req, res) => {
      res.send('Welcome to perftest backend');
    });

    this.router.get('/url', (req, res) => {
      res.send(metricsHandler.getUrl());
    });

    this.router.get('/metrics', async (req, res) => {
      const { query: { url, since, until } } = req;
      try {
        const { sinceDate, untilDate } = this.handleDateParams(since, until);
        res.send(await metricsHandler.getMetrics(url, sinceDate, untilDate));
      } catch (error) {
        console.error(error);
        res.send(error.message);
      }
    });

    this.router.get('/metrics/:metricType', async (req, res) => {
      const { query: { url, since, until }, params: { metricType } } = req;
      const methodName = `get${metricType.replace(/^\w/, (c) => c.toUpperCase())}`;
      try {
        if (!metricsHandler[methodName]) {
          throw new Error(`unsuported metric type: ${metricType}`);
        }
        const { sinceDate, untilDate } = this.handleDateParams(since, until);
        res.send(await metricsHandler[methodName](url, sinceDate, untilDate));
      } catch (error) {
        console.error(error);
        res.send(error.message);
      }
    });

    this.router.delete('/metrics', async (req, res) => {
      const { query: { url } } = req;
      res.send(await metricsHandler.deleteMetrics(url));
    });
  }

  // convert since and until dates
  handleDateParams(since, until) {
    const untilDate = until
      ? new Date(until)
      : new Date();
    const sinceDate = since
      ? new Date(since)
      : new Date(untilDate - this.defaultHistory);
    if (sinceDate > untilDate) throw new Error('The specified time window is invalid');
    return { sinceDate, untilDate };
  }

  getRoutes() {
    return this.router;
  }
}

module.exports = Router;
