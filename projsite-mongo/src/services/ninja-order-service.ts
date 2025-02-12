import { Db, ObjectId, WithId } from 'mongodb';
import { BaseService } from './base-service';
import { Collections } from '../utils/collections';
import { toObjectId } from '../utils/validation';
import type { NinjaOrder } from 'projsite-types/types';
import type { CreateNinjaOrder, UpdateNinjaOrder, NinjaOrderStatus } from 'projsite-types/schemas';

export class NinjaOrderService extends BaseService<NinjaOrder> {
  constructor(db: Db) {
    super(db, Collections.NINJA_ORDERS);
  }

  async findAll() {
    return await super.findAll({ status: { $ne: 'deleted' as NinjaOrderStatus } });
  }

  async findById(id: string | ObjectId) {
    return await super.findOne({ 
      _id: toObjectId(id),
      status: { $ne: 'deleted' as NinjaOrderStatus }
    });
  }

  async create(data: CreateNinjaOrder) {
    const newNinjaOrder: Omit<NinjaOrder, '_id'> = {
        service_type: data.service_type,
        service_form_values: data.service_form_values,
        company_id: data.company_id,
        total_cost: data.total_cost,
        status: 'pending' as NinjaOrderStatus,
        notes: data.notes || '',
        created_by_user: data.created_by_user,
        created_by_service: data.created_by_service,
        last_modified_by: data.created_by_user,
        created_at: new Date(),
        updated_at: new Date(),
    };

    return await super.create(newNinjaOrder);
  }

  async update(id: string | ObjectId, data: UpdateNinjaOrder) {
    const updateData: Partial<NinjaOrder> = {
      ...(data.total_cost && { total_cost: data.total_cost }),
      ...(data.status && { status: data.status }),
      ...(data.notes && { notes: data.notes }),
      ...(data.service_form_values && { service_form_values: data.service_form_values }),
      updated_at: new Date()
    };

    return await super.update(id, updateData);
  }

  async softDelete(id: string | ObjectId) {
    return await super.update(id, { 
      status: 'deleted' as NinjaOrderStatus,
      updated_at: new Date()
    });
  }

  async findByDateRange(startDate: Date, endDate: Date) {
    return await super.findAll({
      created_at: { 
        $gte: startDate, 
        $lte: endDate 
      },
      status: { $ne: 'deleted' as NinjaOrderStatus }
    });
  }

  async findByStatus(status: NinjaOrderStatus) {
    return await super.findAll({ status });
  }

  async findByCustomer(email: string) {
    return await super.findAll({ 
      customer_email: email,
      status: { $ne: 'deleted' as NinjaOrderStatus }
    });
  }
}
