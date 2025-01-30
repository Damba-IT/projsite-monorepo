import { Schema, model } from 'mongoose';
import { IUser } from './types';

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  first_name: String,
  last_name: String,
  phone_number: String,
  old_phone_number: String,
  password: String,
  organization: { type: Schema.Types.ObjectId, ref: 'Organization' },
  super_admin: { type: Boolean, default: false },
  image: String
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Create indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ organization: 1 });

export const User = model<IUser>('User', userSchema); 