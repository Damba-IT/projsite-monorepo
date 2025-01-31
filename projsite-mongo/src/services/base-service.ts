import { Collection, Db, ObjectId, Filter, WithId, FindOneAndUpdateOptions } from 'mongodb';

export abstract class BaseService<T extends { _id?: ObjectId }> {
  protected collection: Collection<T>;

  constructor(
    protected db: Db,
    protected collectionName: string
  ) {
    this.collection = this.db.collection<T>(collectionName);
  }

  async findAll(filter: Filter<T> = {}) {
    return await this.collection.find(filter).toArray();
  }

  async findById(id: string | ObjectId) {
    const _id = typeof id === 'string' ? new ObjectId(id) : id;
    return await this.collection.findOne({ _id } as Filter<T>);
  }

  async findOne(filter: Filter<T> = {}) {
    return await this.collection.findOne(filter);
  }

  async create(data: Omit<T, '_id'>) {
    const result = await this.collection.insertOne(data as any);
    if (!result.insertedId) return null;
    return await this.findById(result.insertedId);
  }

  async update(id: string | ObjectId, data: Partial<T>) {
    const _id = typeof id === 'string' ? new ObjectId(id) : id;
    const result = await this.collection.findOneAndUpdate(
      { _id } as Filter<T>,
      { $set: data },
      { returnDocument: 'after' } as FindOneAndUpdateOptions
    );
    return result;
  }

  async delete(id: string | ObjectId) {
    const _id = typeof id === 'string' ? new ObjectId(id) : id;
    const result = await this.collection.deleteOne({ _id } as Filter<T>);
    return result.deletedCount > 0;
  }

  async exists(filter: Filter<T> = {}) {
    return await this.collection.countDocuments(filter) > 0;
  }
} 