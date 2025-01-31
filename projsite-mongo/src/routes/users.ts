import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { ObjectId } from 'mongodb';
import { Collections } from '../utils/collections';
import type { HonoEnv } from '../types';
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserInput,
  type UpdateUserInput
} from '../schemas/users';

const router = new Hono<HonoEnv>();

// Get all users
router.get('/', async (c) => {
  try {
    const db = c.get('db');
    const users = await db.collection(Collections.USERS).find().toArray();

    // Get organization details for users with organization_id
    const orgIds = [...new Set(users.filter(u => u.organization_id).map(u => u.organization_id))];
    const organizations = await db.collection(Collections.ORGANIZATIONS)
      .find({ 
        _id: { $in: orgIds },
        is_deleted: false 
      })
      .toArray();

    const orgMap = new Map(organizations.map(org => [org._id.toString(), org]));
    
    const usersWithOrgs = users.map(user => ({
      ...user,
      organization: user.organization_id ? orgMap.get(user.organization_id.toString()) : undefined
    }));

    return c.json(usersWithOrgs);
  } catch (error) {
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

// Get user by ID
router.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const db = c.get('db');
    
    const user = await db.collection(Collections.USERS).findOne({ 
      _id: new ObjectId(id)
    });
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Get organization details if user has organization_id
    if (user.organization_id) {
      const organization = await db.collection(Collections.ORGANIZATIONS).findOne({ 
        _id: user.organization_id,
        is_deleted: false
      });
      
      return c.json({
        ...user,
        organization
      });
    }
    
    return c.json(user);
  } catch (error) {
    return c.json({ error: 'Failed to fetch user' }, 500);
  }
});

// Create user
router.post('/', zValidator('json', createUserSchema), async (c) => {
  try {
    const data = c.req.valid('json') as CreateUserInput;
    const db = c.get('db');
    
    // Validate organization exists if organization_id is provided
    if (data.organization_id) {
      const organization = await db.collection(Collections.ORGANIZATIONS).findOne({ 
        _id: data.organization_id,
        is_deleted: false
      });

      if (!organization) {
        return c.json({ error: 'Organization not found' }, 404);
      }
    }

    // Check if email already exists
    const existingUser = await db.collection(Collections.USERS).findOne({ 
      email: data.email 
    });

    if (existingUser) {
      return c.json({ error: 'Email already exists' }, 400);
    }

    const result = await db.collection(Collections.USERS).insertOne(data);
    const created = await db.collection(Collections.USERS).findOne({ 
      _id: result.insertedId 
    });
    
    return c.json(created, 201);
  } catch (error) {
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

// Update user
router.put('/:id', zValidator('json', updateUserSchema), async (c) => {
  try {
    const id = c.req.param('id');
    const data = c.req.valid('json') as UpdateUserInput;
    const db = c.get('db');
    
    // Validate organization exists if organization_id is being updated
    if (data.organization_id) {
      const organization = await db.collection(Collections.ORGANIZATIONS).findOne({ 
        _id: data.organization_id,
        is_deleted: false
      });

      if (!organization) {
        return c.json({ error: 'Organization not found' }, 404);
      }
    }

    // If email is being updated, check it doesn't exist for another user
    if (data.email) {
      const existingUser = await db.collection(Collections.USERS).findOne({ 
        email: data.email,
        _id: { $ne: new ObjectId(id) }
      });

      if (existingUser) {
        return c.json({ error: 'Email already exists' }, 400);
      }
    }

    const result = await db.collection(Collections.USERS).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: 'after' }
    );
    
    if (!result) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Get organization details if user has organization_id
    if (result.organization_id) {
      const organization = await db.collection(Collections.ORGANIZATIONS).findOne({ 
        _id: result.organization_id,
        is_deleted: false
      });
      
      return c.json({
        ...result,
        organization
      });
    }
    
    return c.json(result);
  } catch (error) {
    return c.json({ error: 'Failed to update user' }, 500);
  }
});

// Delete user
router.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const db = c.get('db');
    
    const result = await db.collection(Collections.USERS).deleteOne({ 
      _id: new ObjectId(id)
    });
    
    if (result.deletedCount === 0) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    return c.json({ message: 'User deleted successfully' });
  } catch (error) {
    return c.json({ error: 'Failed to delete user' }, 500);
  }
});

export default router; 