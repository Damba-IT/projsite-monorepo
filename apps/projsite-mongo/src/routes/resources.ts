import { Hono } from "hono";
import { ResourceService } from "../services/resource-services";
import type { HonoEnv } from "../types";

const resourceRouter = new Hono<HonoEnv>();

// Get all resources
resourceRouter.get("/", async (c) => {
  try {
    const db = c.get('db');
    const resourceService = new ResourceService(db);
    const resources = await resourceService.findAll();

    return c.json({ success: true, data: resources });
  } catch (error) {
    console.error("Error fetching resources:", error);
    return c.json({ success: false, error: "Failed to fetch resources" }, 500);
  }
});

// Get resources by project ID
resourceRouter.get("/project/:projectId", async (c) => {
  try {
    const projectId = c.req.param("projectId");
    const db = c.get('db');
    const resourceService = new ResourceService(db);

    const resources = await resourceService.findByProjectId(projectId);
    return c.json({ success: true, data: resources });
  } catch (error) {
    console.error("Error fetching resources by project:", error);
    return c.json({ success: false, error: "Failed to fetch resources by project" }, 500);
  }
});

// Get active resources by project ID
resourceRouter.get("/project/:projectId/active", async (c) => {
  try {
    const projectId = c.req.param("projectId");
    const db = c.get('db');
    const resourceService = new ResourceService(db);

    const resources = await resourceService.findActiveByProjectId(projectId);
    return c.json({ success: true, data: resources });
  } catch (error) {
    console.error("Error fetching active resources by project:", error);
    return c.json({ success: false, error: "Failed to fetch active resources by project" }, 500);
  }
});

// Get resources by assigned user
resourceRouter.get("/user/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const db = c.get('db');
    const resourceService = new ResourceService(db);

    const resources = await resourceService.findByAssignedUser(userId);
    return c.json({ success: true, data: resources });
  } catch (error) {
    console.error("Error fetching resources by user:", error);
    return c.json({ success: false, error: "Failed to fetch resources by user" }, 500);
  }
});

// Get resource by ID
resourceRouter.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const db = c.get('db');
    const resourceService = new ResourceService(db);

    const resource = await resourceService.findById(id);
    if (!resource) {
      return c.json({ success: false, error: "Resource not found" }, 404);
    }

    return c.json({ success: true, data: resource });
  } catch (error) {
    console.error("Error fetching resource:", error);
    return c.json({ success: false, error: "Failed to fetch resource" }, 500);
  }
});

// Create a new resource
resourceRouter.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const db = c.get('db');
    const resourceService = new ResourceService(db);

    // Add timestamps
    const resourceData = {
      ...body,
      created_at: new Date(),
      updated_at: new Date()
    };

    const result = await resourceService.create(resourceData);
    return c.json({ success: true, data: result }, 201);
  } catch (error) {
    console.error("Error creating resource:", error);
    return c.json({ success: false, error: "Failed to create resource" }, 500);
  }
});

// Update a resource
resourceRouter.put("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const db = c.get('db');
    const resourceService = new ResourceService(db);

    // Add updated timestamp
    const updateData = {
      ...body,
      updated_at: new Date()
    };

    const result = await resourceService.update(id, updateData);
    if (result.matchedCount === 0) {
      return c.json({ success: false, error: "Resource not found" }, 404);
    }

    return c.json({ success: true, data: result });
  } catch (error) {
    console.error("Error updating resource:", error);
    return c.json({ success: false, error: "Failed to update resource" }, 500);
  }
});

// Update resource active status
resourceRouter.patch("/:id/status", async (c) => {
  try {
    const id = c.req.param("id");
    const { active } = await c.req.json();
    const db = c.get('db');
    const resourceService = new ResourceService(db);

    if (typeof active !== 'boolean') {
      return c.json({ success: false, error: "Active status must be a boolean" }, 400);
    }

    const result = await resourceService.updateActiveStatus(id, active);
    if (result.matchedCount === 0) {
      return c.json({ success: false, error: "Resource not found" }, 404);
    }

    return c.json({ success: true, data: result });
  } catch (error) {
    console.error("Error updating resource status:", error);
    return c.json({ success: false, error: "Failed to update resource status" }, 500);
  }
});

// Assign users to a resource
resourceRouter.patch("/:id/assign", async (c) => {
  try {
    const id = c.req.param("id");
    const { userIds } = await c.req.json();
    const db = c.get('db');
    const resourceService = new ResourceService(db);

    if (!Array.isArray(userIds)) {
      return c.json({ success: false, error: "User IDs must be an array" }, 400);
    }

    const result = await resourceService.assignUsers(id, userIds);
    if (result.matchedCount === 0) {
      return c.json({ success: false, error: "Resource not found" }, 404);
    }

    return c.json({ success: true, data: result });
  } catch (error) {
    console.error("Error assigning users to resource:", error);
    return c.json({ success: false, error: "Failed to assign users to resource" }, 500);
  }
});

// Delete a resource
resourceRouter.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const db = c.get('db');
    const resourceService = new ResourceService(db);

    const result = await resourceService.delete(id);
    if (result.deletedCount === 0) {
      return c.json({ success: false, error: "Resource not found" }, 404);
    }

    return c.json({ success: true, message: "Resource deleted successfully" });
  } catch (error) {
    console.error("Error deleting resource:", error);
    return c.json({ success: false, error: "Failed to delete resource" }, 500);
  }
});

export default resourceRouter; 