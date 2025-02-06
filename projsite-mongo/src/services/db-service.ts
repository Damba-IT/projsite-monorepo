import { Collection, MongoClient } from 'mongodb';

export class DbService {
  private static instance: DbService;
  private client: MongoClient;
  private connected: boolean = false;

  private constructor() {
    this.client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');
  }

  public static getInstance(): DbService {
    if (!DbService.instance) {
      DbService.instance = new DbService();
    }
    return DbService.instance;
  }

  public async connect(): Promise<void> {
    if (!this.connected) {
      await this.client.connect();
      this.connected = true;
      console.log('Connected to MongoDB');
    }
  }

  public async getCollection(name: string): Promise<Collection> {
    if (!this.connected) {
      await this.connect();
    }
    return this.client.db().collection(name);
  }
}