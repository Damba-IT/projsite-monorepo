import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { Project } from '../models';

const router = new Hono();

// Schema for project creation/update
const projectSchema = z.object({
  project_id: z.string(),
  name: z.string(),
  organization: z.string(), // MongoDB ObjectId as string
  start_date: z.string().transform(str => new Date(str)),
  end_date: z.string().transform(str => new Date(str)),
  status: z.enum(['active', 'inactive', 'deleted']).optional(),
  location_address: z.string().optional(),
  location_formatted_address: z.string().optional(),
  location_place_id: z.string().optional(),
  location_lat: z.string().optional(),
  location_lng: z.string().optional(),
  settings: z.object({
    waste_booking_color: z.string().optional(),
    resource_booking_color: z.string().optional(),
    information: z.string().optional(),
    shipment_module: z.boolean().optional(),
    checkpoint_module: z.boolean().optional(),
    warehouse_module: z.boolean().optional(),
    waste_module: z.boolean().optional(),
    inbox_module: z.boolean().optional(),
    auto_approval: z.boolean().optional(),
    waste_auto_approval: z.boolean().optional(),
    sub_projects_enabled: z.boolean().optional()
  }).optional(),
  form_validation_rules: z.object({
    shipment_booking: z.object({
      contractor: z.boolean().optional(),
      responsible_person: z.boolean().optional(),
      supplier: z.boolean().optional(),
      unloading_zone: z.boolean().optional(),
      prevent_zone_collide: z.boolean().optional(),
      sub_project: z.boolean().optional(),
      resources: z.boolean().optional(),
      env_data: z.boolean().optional()
    }).optional(),
    resource_booking: z.object({
      contractor: z.boolean().optional(),
      responsible_person: z.boolean().optional(),
      sub_project: z.boolean().optional(),
      resources: z.boolean().optional()
    }).optional(),
    waste_booking: z.object({
      sub_project: z.boolean().optional(),
      waste: z.boolean().optional()
    }).optional()
  }).optional()
});

// Get all projects
router.get('/', async (c) => {
  try {
    const projects = await Project.find({ status: { $ne: 'deleted' } })
      .populate('organization');
    return c.json(projects);
  } catch (error) {
    return c.json({ error: 'Failed to fetch projects' }, 500);
  }
});

// Get project by ID
router.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const project = await Project.findById(id).populate('organization');
    
    if (!project) {
      return c.json({ error: 'Project not found' }, 404);
    }
    
    return c.json(project);
  } catch (error) {
    return c.json({ error: 'Failed to fetch project' }, 500);
  }
});

// Create project
router.post('/', zValidator('json', projectSchema), async (c) => {
  try {
    const data = await c.req.json();
    const project = new Project(data);
    await project.save();
    return c.json(project, 201);
  } catch (error) {
    return c.json({ error: 'Failed to create project' }, 500);
  }
});

// Update project
router.put('/:id', zValidator('json', projectSchema), async (c) => {
  try {
    const id = c.req.param('id');
    const data = await c.req.json();
    
    const project = await Project.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    ).populate('organization');
    
    if (!project) {
      return c.json({ error: 'Project not found' }, 404);
    }
    
    return c.json(project);
  } catch (error) {
    return c.json({ error: 'Failed to update project' }, 500);
  }
});

// Delete project (soft delete)
router.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const project = await Project.findByIdAndUpdate(
      id,
      { $set: { status: 'deleted' } },
      { new: true }
    );
    
    if (!project) {
      return c.json({ error: 'Project not found' }, 404);
    }
    
    return c.json({ message: 'Project deleted successfully' });
  } catch (error) {
    return c.json({ error: 'Failed to delete project' }, 500);
  }
});

export default router; 