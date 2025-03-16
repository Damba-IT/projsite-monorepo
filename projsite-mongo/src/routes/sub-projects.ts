import { Hono } from "hono";
import { SubProjectService } from "../services/sub-project-service";
import type { HonoEnv } from "../types";

const subProjectRouter = new Hono<HonoEnv>();

// Get all sub-projects
subProjectRouter.get("/", async (c) => {
  try {
    const db = c.get("db");
    const subProjectService = new SubProjectService(db);
    const subProjects = await subProjectService.findAll();

    return c.json({ success: true, data: subProjects });
  } catch (error) {
    console.error("Error fetching sub-projects:", error);
    return c.json(
      { success: false, error: "Failed to fetch sub-projects" },
      500
    );
  }
});

// Get sub-projects by project ID
subProjectRouter.get("/project/:projectId", async (c) => {
  try {
    const projectId = c.req.param("projectId");
    const db = c.get("db");
    const subProjectService = new SubProjectService(db);

    const subProjects = await subProjectService.findByProjectId(projectId);
    return c.json({ success: true, data: subProjects });
  } catch (error) {
    console.error("Error fetching sub-projects by project:", error);
    return c.json(
      { success: false, error: "Failed to fetch sub-projects by project" },
      500
    );
  }
});

// Get active sub-projects by project ID
subProjectRouter.get("/project/:projectId/active", async (c) => {
  try {
    const projectId = c.req.param("projectId");
    const db = c.get("db");
    const subProjectService = new SubProjectService(db);

    const subProjects = await subProjectService.findActiveByProjectId(
      projectId
    );
    return c.json({ success: true, data: subProjects });
  } catch (error) {
    console.error("Error fetching active sub-projects by project:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch active sub-projects by project",
      },
      500
    );
  }
});

// Get sub-project by ID
subProjectRouter.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const db = c.get("db");
    const subProjectService = new SubProjectService(db);

    const subProject = await subProjectService.findById(id);
    if (!subProject) {
      return c.json({ success: false, error: "Sub-project not found" }, 404);
    }

    return c.json({ success: true, data: subProject });
  } catch (error) {
    console.error("Error fetching sub-project:", error);
    return c.json(
      { success: false, error: "Failed to fetch sub-project" },
      500
    );
  }
});

// Create a new sub-project
subProjectRouter.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const db = c.get("db");
    const subProjectService = new SubProjectService(db);

    // Add timestamps
    const subProjectData = {
      ...body,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const result = await subProjectService.create(subProjectData);
    return c.json({ success: true, data: result }, 201);
  } catch (error) {
    console.error("Error creating sub-project:", error);
    return c.json(
      { success: false, error: "Failed to create sub-project" },
      500
    );
  }
});

// Update a sub-project
subProjectRouter.put("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const db = c.get("db");
    const subProjectService = new SubProjectService(db);

    // Add updated timestamp
    const updateData = {
      ...body,
      updated_at: new Date(),
    };

    const result = await subProjectService.update(id, updateData);

    return c.json({ success: true, data: result });
  } catch (error) {
    console.error("Error updating sub-project:", error);
    return c.json(
      { success: false, error: "Failed to update sub-project" },
      500
    );
  }
});

// Update sub-project active status
subProjectRouter.patch("/:id/status", async (c) => {
  try {
    const id = c.req.param("id");
    const { active } = await c.req.json();
    const db = c.get("db");
    const subProjectService = new SubProjectService(db);

    if (typeof active !== "boolean") {
      return c.json(
        { success: false, error: "Active status must be a boolean" },
        400
      );
    }

    const result = await subProjectService.updateActiveStatus(id, active);

    return c.json({ success: true, data: result });
  } catch (error) {
    console.error("Error updating sub-project status:", error);
    return c.json(
      { success: false, error: "Failed to update sub-project status" },
      500
    );
  }
});

// Update sub-project name
subProjectRouter.patch("/:id/name", async (c) => {
  try {
    const id = c.req.param("id");
    const { name } = await c.req.json();
    const db = c.get("db");
    const subProjectService = new SubProjectService(db);

    if (!name || typeof name !== "string") {
      return c.json(
        { success: false, error: "Name must be a non-empty string" },
        400
      );
    }

    const result = await subProjectService.updateName(id, name);

    return c.json({ success: true, data: result });
  } catch (error) {
    console.error("Error updating sub-project name:", error);
    return c.json(
      { success: false, error: "Failed to update sub-project name" },
      500
    );
  }
});

// Delete a sub-project
subProjectRouter.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const db = c.get("db");
    const subProjectService = new SubProjectService(db);

    const result = await subProjectService.delete(id);

    return c.json({
      success: true,
      message: "Sub-project deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting sub-project:", error);
    return c.json(
      { success: false, error: "Failed to delete sub-project" },
      500
    );
  }
});

export default subProjectRouter;
