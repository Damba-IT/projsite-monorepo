import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { ProjectService } from "../services/project-service";
import { createProjectSchema, updateProjectSchema } from "@projsite/types";
import { idSchema } from "../utils/validation";

export const projectRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const projectService = new ProjectService(ctx.db);
    return await projectService.findAll();
  }),

  getById: publicProcedure.input(idSchema).query(async ({ ctx, input }) => {
    const projectService = new ProjectService(ctx.db);
    const project = await projectService.findById(input);

    if (!project) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Project not found",
      });
    }

    return project;
  }),

  create: publicProcedure
    .input(createProjectSchema)
    .mutation(async ({ ctx, input }) => {
      const projectService = new ProjectService(ctx.db);
      const project = await projectService.create(input);

      if (!project) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to create project",
        });
      }

      return project;
    }),

  update: publicProcedure
    .input(
      z.object({
        id: idSchema,
        data: updateProjectSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const projectService = new ProjectService(ctx.db);
      const project = await projectService.update(input.id, input.data);

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      return project;
    }),

  delete: publicProcedure.input(idSchema).mutation(async ({ ctx, input }) => {
    const projectService = new ProjectService(ctx.db);
    const result = await projectService.softDelete(input);

    if (!result) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Project not found",
      });
    }

    return result;
  }),

  getByCompany: publicProcedure
    .input(idSchema)
    .query(async ({ ctx, input }) => {
      const projectService = new ProjectService(ctx.db);
      return await projectService.findByCompany(input);
    }),

  getByDateRange: publicProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
      })
    )
    .query(async ({ ctx, input }) => {
      const projectService = new ProjectService(ctx.db);
      return await projectService.findByDateRange(
        input.startDate,
        input.endDate
      );
    }),
});
