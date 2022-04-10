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
      // eslint-disable-next-line no-promise-executor-return
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

  getMetricsTypes() {
    return this.config.metrics.map((field) => field.name);
  }

  getUrl() {
    return this.url;
  }

  async getMetrics(url, since, until) {
    return this.storageService.getData(url || this.url, since, until);
  }

  async getMarks(url, since, until) {
    const dataUrl = url || this.url;
    const marksNames = await this.storageService.getFieldValues(dataUrl, since, until, 'marks.name');

    const data = [['timestamp'].concat(marksNames)];
    const marksData = await this.storageService.getData(dataUrl, since, until, 'marks');

    marksData.forEach(({ timestamp, marks }) => {
      const row = [timestamp[0]].concat(marksNames.map((name) => {
        const foundRessource = marks.find((mark) => mark.name === name);
        return foundRessource ? foundRessource.startTime : 0;
      }));
      data.push(row);
    });
    return data;
  }

  async getJstimings(url, since, until) {
    const timingsData = await this.storageService.getData(url || this.url, since, until, 'jsTimings');
    return [['timestamp', 'JS run time']]
      .concat(timingsData.map(({ timestamp, jsTimings }) => [timestamp[0], jsTimings[0]]));
  }

  async getRessources(url, since, until) {
    const dataUrl = url || this.url;
    const ressourcesUrls = await this.storageService.getFieldValues(dataUrl, since, until, 'ressources.url');

    const data = [['timestamp'].concat(ressourcesUrls)];
    const ressourcesData = await this.storageService.getData(dataUrl, since, until, 'ressources');

    ressourcesData.forEach(({ timestamp, ressources }) => {
      const row = [timestamp[0]].concat(ressourcesUrls.map((ressourceUrl) => {
        const foundRessource = ressources.find((ressource) => ressource.url === ressourceUrl);
        return foundRessource ? foundRessource.endTime - foundRessource.startTime : 0;
      }));
      data.push(row);
    });
    return data;
  }

  async deleteMetrics() {
    return this.storageService.deleteData(this.url);
  }
}
module.exports = GoogleApiService;
