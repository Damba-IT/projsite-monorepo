import { createTRPCContext } from "./context";
import { appRouter } from "./routers";

export { createTRPCContext, appRouter };
export type { AppRouter } from "./routers";

// Service exports for direct use in the apps
export { ProjectService } from "./services/project-service";
export { CompanyService } from "./services/company-service";
export { BaseService } from "./services/base-service";

// Utilities exports
export { Collections } from "./utils/collections";
export { toObjectId } from "./utils/validation";
