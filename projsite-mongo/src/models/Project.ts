import { Schema, model } from 'mongoose';
import { IProject, ProjectStatus } from './types';

const projectSchema = new Schema<IProject>({
  project_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  status: { 
    type: String,
    enum: ['active', 'inactive', 'deleted'] as ProjectStatus[],
    default: 'active'
  },
  location_address: String,
  location_formatted_address: String,
  location_place_id: String,
  location_lat: String,
  location_lng: String,
  created_by: { type: String, required: true },
  last_modified_by: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  settings: {
    type: {
      waste_booking_color: { type: String, default: "#456ed5" },
      resource_booking_color: { type: String, default: "#aed5ab" },
      information: { type: String, default: "" },
      shipment_module: { type: Boolean, default: true },
      checkpoint_module: { type: Boolean, default: false },
      warehouse_module: { type: Boolean, default: false },
      waste_module: { type: Boolean, default: false },
      inbox_module: { type: Boolean, default: false },
      auto_approval: { type: Boolean, default: false },
      waste_auto_approval: { type: Boolean, default: true },
      sub_projects_enabled: { type: Boolean, default: false }
    },
    default: {
      waste_booking_color: "#456ed5",
      resource_booking_color: "#aed5ab",
      information: "",
      shipment_module: true,
      checkpoint_module: false,
      warehouse_module: false,
      waste_module: false,
      inbox_module: false,
      auto_approval: false,
      waste_auto_approval: true,
      sub_projects_enabled: false
    }
  },
  form_validation_rules: {
    type: {
      shipment_booking: {
        contractor: { type: Boolean, default: false },
        responsible_person: { type: Boolean, default: false },
        supplier: { type: Boolean, default: false },
        unloading_zone: { type: Boolean, default: false },
        prevent_zone_collide: { type: Boolean, default: false },
        sub_project: { type: Boolean, default: false },
        resources: { type: Boolean, default: false },
        env_data: { type: Boolean, default: false }
      },
      resource_booking: {
        contractor: { type: Boolean, default: false },
        responsible_person: { type: Boolean, default: false },
        sub_project: { type: Boolean, default: false },
        resources: { type: Boolean, default: false }
      },
      waste_booking: {
        sub_project: { type: Boolean, default: false },
        waste: { type: Boolean, default: false }
      }
    },
    default: {
      shipment_booking: {
        contractor: false,
        responsible_person: false,
        supplier: false,
        unloading_zone: false,
        prevent_zone_collide: false,
        sub_project: false,
        resources: false,
        env_data: false
      },
      resource_booking: {
        contractor: false,
        responsible_person: false,
        sub_project: false,
        resources: false
      },
      waste_booking: {
        sub_project: false,
        waste: false
      }
    }
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Create indexes
projectSchema.index({ project_id: 1 }, { unique: true });
projectSchema.index({ organization: 1 });
projectSchema.index({ start_date: 1, end_date: 1 });
projectSchema.index({ location_lat: 1, location_lng: 1 });
projectSchema.index({ status: 1 });

// Add validation for end_date > start_date
projectSchema.pre('save', function(next) {
  if (this.end_date <= this.start_date) {
    next(new Error('End date must be greater than start date'));
  }
  next();
});

export const Project = model<IProject>('Project', projectSchema); 