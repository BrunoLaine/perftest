const { MongoClient } = require('mongodb');

class MongoDbStorageService {
  constructor() {
    this.url = 'mongodb://root:example@localhost:27017/';
  }

  async initDatabase() {
    if (!this.collection) {
      const client = await MongoClient.connect(this.url);
      const db = await client.db('perftestDB');
      this.collection = await db.collection('metrics');
    }
  }

  async store(data) {
    await this.initDatabase();
    return this.collection.insertOne(data);
  }

  async getData(sinceDate, untilDate) {
    await this.initDatabase();
    return this.collection.find({
      timestamp: {
        $gte: sinceDate.toISOString(),
        $lte: untilDate.toISOString(),
      },
    }).toArray();
  }

  async deleteData() {
    await this.initDatabase();
    return this.collection.deleteMany({});
  }
}

module.exports = MongoDbStorageService;
