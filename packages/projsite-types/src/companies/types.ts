import { BaseEntity } from "../common/types";
import {
  createCompanySchema,
  searchCompanySchema,
  updateCompanySchema,
} from "./schema";
import { z } from "zod";
export interface Company extends BaseEntity {
  company_name: string;
  active: boolean;
  is_deleted: boolean;
  image_url?: string;
  settings: CompanySettings;
}

export interface CompanySettings {
  warehouse_module: boolean;
}

export type CreateCompany = z.infer<typeof createCompanySchema>;
export type UpdateCompany = z.infer<typeof updateCompanySchema>;
export type SearchCompanyQuery = z.infer<typeof searchCompanySchema>;
