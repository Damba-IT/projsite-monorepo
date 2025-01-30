import { Schema, model } from 'mongoose';
import { IOrganization } from './types';

const organizationSchema = new Schema<IOrganization>({
  name: { type: String, required: true, unique: true },
  active: { type: Boolean, default: true },
  is_deleted: { type: Boolean, default: false },
  logo: String,
  settings: {
    type: {
      warehouse_module: { type: Boolean, default: false }
    },
    default: {
      warehouse_module: false
    }
  },
  created_by_user: String,
  created_by_service: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Create indexes
organizationSchema.index({ name: 1 }, { unique: true });

export const Organization = model<IOrganization>('Organization', organizationSchema); 