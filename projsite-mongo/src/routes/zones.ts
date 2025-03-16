import { Hono } from "hono";
import { ZoneService } from "../services/zone-service";
import type { HonoEnv } from "../types";

const zoneRouter = new Hono<HonoEnv>();

// Get all zones
zoneRouter.get("/", async (c) => {
  try {
    const db = c.get('db');
    const zoneService = new ZoneService(db);
    const zones = await zoneService.findAll();
    
    return c.json({ success: true, data: zones });
  } catch (error) {
    console.error("Error fetching zones:", error);
    return c.json({ success: false, error: "Failed to fetch zones" }, 500);
  }
});

// Get zones by project ID
zoneRouter.get("/project/:projectId", async (c) => {
  try {
    const projectId = c.req.param("projectId");
    const db = c.get('db');
    const zoneService = new ZoneService(db);
    
    const zones = await zoneService.findByProjectId(projectId);
    return c.json({ success: true, data: zones });
  } catch (error) {
    console.error("Error fetching zones by project:", error);
    return c.json({ success: false, error: "Failed to fetch zones by project" }, 500);
  }
});

// Get active zones by project ID
zoneRouter.get("/project/:projectId/active", async (c) => {
  try {
    const projectId = c.req.param("projectId");
    const db = c.get('db');
    const zoneService = new ZoneService(db);
    
    const zones = await zoneService.findActiveByProjectId(projectId);
    return c.json({ success: true, data: zones });
  } catch (error) {
    console.error("Error fetching active zones by project:", error);
    return c.json({ success: false, error: "Failed to fetch active zones by project" }, 500);
  }
});

// Get zone by ID
zoneRouter.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const db = c.get('db');
    const zoneService = new ZoneService(db);
    
    const zone = await zoneService.findById(id);
    if (!zone) {
      return c.json({ success: false, error: "Zone not found" }, 404);
    }
    
    return c.json({ success: true, data: zone });
  } catch (error) {
    console.error("Error fetching zone:", error);
    return c.json({ success: false, error: "Failed to fetch zone" }, 500);
  }
});

// Create a new zone
zoneRouter.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const db = c.get('db');
    const zoneService = new ZoneService(db);
    
    // Add timestamps
    const zoneData = {
      ...body,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    const result = await zoneService.create(zoneData);
    return c.json({ success: true, data: result }, 201);
  } catch (error) {
    console.error("Error creating zone:", error);
    return c.json({ success: false, error: "Failed to create zone" }, 500);
  }
});

// Update a zone
zoneRouter.put("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const db = c.get('db');
    const zoneService = new ZoneService(db);
    
    // Add updated timestamp
    const updateData = {
      ...body,
      updated_at: new Date()
    };
    
    const result = await zoneService.update(id, updateData);
    
    return c.json({ success: true, data: result });
  } catch (error) {
    console.error("Error updating zone:", error);
    return c.json({ success: false, error: "Failed to update zone" }, 500);
  }
});

// Update zone active status
zoneRouter.patch("/:id/status", async (c) => {
  try {
    const id = c.req.param("id");
    const { active } = await c.req.json();
    const db = c.get('db');
    const zoneService = new ZoneService(db);
    
    if (typeof active !== 'boolean') {
      return c.json({ success: false, error: "Active status must be a boolean" }, 400);
    }
    
    const result = await zoneService.updateActiveStatus(id, active);
    
    return c.json({ success: true, data: result });
  } catch (error) {
    console.error("Error updating zone status:", error);
    return c.json({ success: false, error: "Failed to update zone status" }, 500);
  }
});

// Update zone name
zoneRouter.patch("/:id/name", async (c) => {
  try {
    const id = c.req.param("id");
    const { name } = await c.req.json();
    const db = c.get('db');
    const zoneService = new ZoneService(db);
    
    if (!name || typeof name !== 'string') {
      return c.json({ success: false, error: "Name must be a non-empty string" }, 400);
    }
    
    const result = await zoneService.updateName(id, name);
    
    return c.json({ success: true, data: result });
  } catch (error) {
    console.error("Error updating zone name:", error);
    return c.json({ success: false, error: "Failed to update zone name" }, 500);
  }
});

// Update zone color
zoneRouter.patch("/:id/color", async (c) => {
  try {
    const id = c.req.param("id");
    const { color } = await c.req.json();
    const db = c.get('db');
    const zoneService = new ZoneService(db);
    
    if (!color || typeof color !== 'string') {
      return c.json({ success: false, error: "Color must be a non-empty string" }, 400);
    }
    
    const result = await zoneService.updateColor(id, color);
    
    return c.json({ success: true, data: result });
  } catch (error) {
    console.error("Error updating zone color:", error);
    return c.json({ success: false, error: "Failed to update zone color" }, 500);
  }
});

// Delete a zone
zoneRouter.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const db = c.get('db');
    const zoneService = new ZoneService(db);
    
    const result = await zoneService.delete(id);
    
    return c.json({ success: true, message: "Zone deleted successfully" });
  } catch (error) {
    console.error("Error deleting zone:", error);
    return c.json({ success: false, error: "Failed to delete zone" }, 500);
  }
});

export default zoneRouter; 