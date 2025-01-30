import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { Organization } from '../models';

const router = new Hono();

// Schema for organization creation/update
const organizationSchema = z.object({
  name: z.string().min(1),
  active: z.boolean().optional(),
  is_deleted: z.boolean().optional(),
  logo: z.string().optional(),
  settings: z.object({
    warehouse_module: z.boolean()
  }).optional(),
});

// Get all organizations
router.get('/', async (c) => {
  try {
    const organizations = await Organization.find({ is_deleted: false });
    return c.json(organizations);
  } catch (error) {
    return c.json({ error: 'Failed to fetch organizations' }, 500);
  }
});

// Get organization by ID
router.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const organization = await Organization.findById(id);
    
    if (!organization) {
      return c.json({ error: 'Organization not found' }, 404);
    }
    
    return c.json(organization);
  } catch (error) {
    return c.json({ error: 'Failed to fetch organization' }, 500);
  }
});

// Create organization
router.post('/', zValidator('json', organizationSchema), async (c) => {
  try {
    const data = await c.req.json();
    const organization = new Organization(data);
    await organization.save();
    return c.json(organization, 201);
  } catch (error) {
    return c.json({ error: 'Failed to create organization' }, 500);
  }
});

// Update organization
router.put('/:id', zValidator('json', organizationSchema), async (c) => {
  try {
    const id = c.req.param('id');
    const data = await c.req.json();
    
    const organization = await Organization.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );
    
    if (!organization) {
      return c.json({ error: 'Organization not found' }, 404);
    }
    
    return c.json(organization);
  } catch (error) {
    return c.json({ error: 'Failed to update organization' }, 500);
  }
});

// Delete organization (soft delete)
router.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const organization = await Organization.findByIdAndUpdate(
      id,
      { $set: { is_deleted: true } },
      { new: true }
    );
    
    if (!organization) {
      return c.json({ error: 'Organization not found' }, 404);
    }
    
    return c.json({ message: 'Organization deleted successfully' });
  } catch (error) {
    return c.json({ error: 'Failed to delete organization' }, 500);
  }
});

export default router; 