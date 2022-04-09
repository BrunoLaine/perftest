const fetch = require('node-fetch');
const jsonpath = require('jsonpath');
const serviceConfig = require('./config.json');
const MongoDbStorageService = require('../mongoDb/storageService');
require('dotenv').config();

class GoogleApiService {
  constructor(url, interval) {
    const api = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
    this.apiKey = process.env.APIKEY;
    this.query = `${api}?url=${url}&key=${this.apiKey}`;
    this.interval = interval;
    this.config = serviceConfig;
    this.storageService = new MongoDbStorageService();
  }

  async run() {
    if (!this.apiKey) {
      console.error('you must set APIKEY env variable to enable data collection');
      return;
    }
    console.log(`Starting performance data collection for ${this.url} every ${this.interval / 1000}s`);
    // setIntervalAsync(this.collectData, this.interval);
    this.collectData();
  }

  async collectData() {
    try {
      const metrics = await this.fetchMetrics();
      if (metrics) {
        const formatedMetrics = this.formatMetrics(metrics);
        await this.store(formatedMetrics);
      } else {
        console.error("couldn't retrieve metrics");
      }
    } catch (error) {
      console.error(error);
    } finally {
      await new Promise((resolve) => setTimeout(resolve, this.interval));
      this.collectData();
    }
  }

  async fetchMetrics() {
    console.log('🚀 ~ file: dataCollectionService.js ~ line 41 ~ GoogleApiService ~ fetchMetrics ~ fetchMetrics');
    const response = await fetch(this.query);
    if (response.status !== 200) {
      throw new Error(`Google API responded with http status ${response.status}`);
    }
    const json = await response.json();
    return json;
  }

  formatMetrics(metrics) {
    const formatedMetrics = {};
    this.config.metrics.forEach((field) => {
      formatedMetrics[field.name] = jsonpath.value(metrics, field.jsonPath);
    });
    return formatedMetrics;
  }

  async store(metrics) {
    await this.storageService.store(metrics);
  }

  getMetricsNames() {
    return this.config.metrics.map((field) => field.name);
  }

  async getMetrics(since, until) {
    const untilDate = until
      ? new Date(until)
      : new Date();
    const sinceDate = since
      ? new Date(since)
      : new Date(untilDate - 60 * 60 * 1000);
    return this.storageService.getData(sinceDate, untilDate);
  }

  async deleteMetrics() {
    return this.storageService.deleteData();
  }
}
module.exports = GoogleApiService;
