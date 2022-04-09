const fetch = require('node-fetch');
const jsonpath = require('jsonpath');
const serviceConfig = require('./config.json');
const MongoDbStorageService = require('../mongoDb/storageService');
require('dotenv').config();

class GoogleApiService {
  constructor(url, interval) {
    const api = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
    this.url = url;
    this.apiKey = process.env.APIKEY;
    this.query = `${api}?url=${url}&key=${this.apiKey}`;
    this.interval = interval;
    this.config = serviceConfig;
    const dbHost = process.env.DB_HOST || 'localhost';
    const dbUser = process.env.DB_USER || 'root';
    const dbPassword = process.env.DB_PW || 'example';
    this.storageService = new MongoDbStorageService(dbHost, dbUser, dbPassword);
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
      formatedMetrics[field.name] = jsonpath.query(metrics, field.jsonPath);
    });
    return formatedMetrics;
  }

  async store(metrics) {
    await this.storageService.store(this.url, metrics);
  }

  getMetricsNames() {
    return this.config.metrics.map((field) => field.name);
  }

  async getMetrics(url, since, until) {
    const dataUrl = url || this.url;
    const untilDate = until
      ? new Date(until)
      : new Date();
    const sinceDate = since
      ? new Date(since)
      : new Date(untilDate - 60 * 60 * 1000);
    const metrics = await this.storageService.getData(dataUrl, sinceDate, untilDate);
    return { metrics, url: dataUrl };
  }

  async deleteMetrics() {
    return this.storageService.deleteData(this.url);
  }
}
module.exports = GoogleApiService;
