import { Db } from "mongodb";
import { User } from "../types";
import { BaseService } from "./base-service";

const USERS_COLLECTION = "users";

export class UsersService extends BaseService<User> {
  constructor(db: Db) {
    super(db, USERS_COLLECTION);
  }

  async markAsDeleted(clerkUserId: string) {
    return this.collection.updateOne(
      { clerk_user_id: clerkUserId },
      { $set: { is_deleted: true, updated_at: new Date() } }
    );
  }

  async findByClerkId(clerkUserId: string) {
    return this.collection.findOne({ clerk_user_id: clerkUserId });
  }
}
