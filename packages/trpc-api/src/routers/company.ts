import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { CompanyService } from "../services/company-service";
import {
  createCompanySchema,
  updateCompanySchema,
  searchCompanySchema,
} from "@projsite/types";
import { idSchema } from "../utils/validation";

export const companyRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const companyService = new CompanyService(ctx.db);
    return await companyService.findAll();
  }),

  getById: publicProcedure.input(idSchema).query(async ({ ctx, input }) => {
    const companyService = new CompanyService(ctx.db);
    const company = await companyService.findById(input);

    if (!company) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Company not found",
      });
    }

    return company;
  }),

  create: publicProcedure
    .input(createCompanySchema)
    .mutation(async ({ ctx, input }) => {
      const companyService = new CompanyService(ctx.db);
      const company = await companyService.create(input);

      if (!company) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to create company",
        });
      }

      return company;
    }),

  update: publicProcedure
    .input(
      z.object({
        id: idSchema,
        data: updateCompanySchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const companyService = new CompanyService(ctx.db);
      const company = await companyService.update(input.id, input.data);

      if (!company) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Company not found",
        });
      }

      return company;
    }),

  delete: publicProcedure.input(idSchema).mutation(async ({ ctx, input }) => {
    const companyService = new CompanyService(ctx.db);
    const result = await companyService.softDelete(input);

    if (!result) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Company not found",
      });
    }

    return result;
  }),

  getProjects: publicProcedure.input(idSchema).query(async ({ ctx, input }) => {
    const companyService = new CompanyService(ctx.db);

    // First check if the company exists
    const company = await companyService.findById(input);
    if (!company) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Company not found",
      });
    }

    return await companyService.getProjects(input);
  }),

  search: publicProcedure
    .input(searchCompanySchema)
    .query(async ({ ctx, input }) => {
      const companyService = new CompanyService(ctx.db);
      return await companyService.searchCompanies(input.query);
    }),
});
