import {
  Collection,
  Db,
  Filter,
  ObjectId,
  WithId,
  Document,
  OptionalUnlessRequiredId,
} from "mongodb";
import { toObjectId } from "../utils/validation";

export class BaseService<T extends Document> {
  protected db: Db;
  protected collection: Collection<T>;

  constructor(db: Db, collectionName: string) {
    this.db = db;
    this.collection = db.collection<T>(collectionName);
  }

  async findAll(filter: Filter<T> = {}): Promise<WithId<T>[]> {
    return await this.collection.find(filter).toArray();
  }

  async findOne(filter: Filter<T>): Promise<WithId<T> | null> {
    return await this.collection.findOne(filter);
  }

  async findById(id: string | ObjectId): Promise<WithId<T> | null> {
    return await this.collection.findOne({ _id: toObjectId(id) } as Filter<T>);
  }

  async create(data: Omit<T, "_id">): Promise<WithId<T> | null> {
    const result = await this.collection.insertOne(
      data as unknown as OptionalUnlessRequiredId<T>
    );
    if (!result.acknowledged) return null;
    return await this.findById(result.insertedId);
  }

  async update(
    id: string | ObjectId,
    data: Partial<T>
  ): Promise<WithId<T> | null> {
    const result = await this.collection.updateOne(
      { _id: toObjectId(id) } as Filter<T>,
      { $set: data }
    );
    if (!result.acknowledged) return null;
    return await this.findById(id);
  }

  async delete(id: string | ObjectId): Promise<boolean> {
    const result = await this.collection.deleteOne({
      _id: toObjectId(id),
    } as Filter<T>);
    return result.acknowledged && result.deletedCount === 1;
  }
}
