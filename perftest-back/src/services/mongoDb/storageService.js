const { MongoClient } = require('mongodb');

class MongoDbStorageService {
  constructor(dbHost, username, password) {
    this.url = `mongodb://${username}:${password}@${dbHost}:27017/`;
    this.collections = [];
  }

  async getCollection(url) {
    if (!this.collections[url]) {
      const client = await MongoClient.connect(this.url);
      const db = await client.db('perftestDB');
      this.collections[url] = await db.collection(url);
    }
    return this.collections[url];
  }

  async store(url, data) {
    const collection = await this.getCollection(url);
    return collection.insertOne(data);
  }

  async getData(url, sinceDate, untilDate, dataType) {
    const collection = await this.getCollection(url);
    const fields = dataType ? { timestamp: 1, [dataType]: 1, _id: 0 } : { _id: 0 };
    const query = { timestamp: { $gte: sinceDate.toISOString(), $lte: untilDate.toISOString() } };
    return collection.find(query).project(fields).toArray();
  }

  async getFieldValues(url, sinceDate, untilDate, fieldName) {
    const collection = await this.getCollection(url);
    const query = { timestamp: { $gte: sinceDate.toISOString(), $lte: untilDate.toISOString() } };
    return collection.distinct(fieldName, query);
  }

  async deleteData(url) {
    const collection = await this.getCollection(url);
    return collection.deleteMany({});
  }
}

module.exports = MongoDbStorageService;
