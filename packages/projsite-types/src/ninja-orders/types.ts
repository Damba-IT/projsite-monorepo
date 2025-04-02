import { BaseEntity } from "../common/types";
import type { NinjaOrderCreatedByService, NinjaOrderStatus } from "./schema";

export interface NinjaOrder extends BaseEntity {
  service_type: string;
  service_form_values: Record<string, any>;
  company_id: string;
  status: NinjaOrderStatus;
  total_cost: number;
  notes?: string;
  created_by_service: NinjaOrderCreatedByService;
}
