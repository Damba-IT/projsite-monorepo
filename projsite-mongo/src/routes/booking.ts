import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { BookingsService } from '../services/bookings-service';
import type { HonoEnv } from '../types';
import { bookingParamsSchema } from '../types/bookingSchemas';

const bookingsRouter = new Hono<HonoEnv>();

// GET /projects/:projectId/bookings?bookingType=shipment
// GET /projects/:projectId/bookings/:bookingType
bookingsRouter.get('/:bookingType?', zValidator('param', bookingParamsSchema), async (c) => {
  try {
    const db = c.get('db');
    const { projectId, bookingType } = c.req.valid('param');
    
    const params = {
      project_id: projectId,
      startDate: c.req.query('startDate') || '',
      endDate: c.req.query('endDate') || '',
      zones: c.req.query('zones')?.split(','),
      subProjects: c.req.query('subProjects')?.split(','),
      contractors: c.req.query('contractors')?.split(','),
      resources: c.req.query('resources')?.split(','),
      requestStatus: c.req.query('requestStatus'),
      isConfirmed: c.req.query('isConfirmed') === 'false' ? false : true
    };

    const result = await BookingsService.getBookings(db, params, bookingType);
    return c.json(result);
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// GET /projects/:projectId/bookings/:bookingType/:id
bookingsRouter.get('/:bookingType/:id', zValidator('param', bookingParamsSchema), async (c) => {
  try {
    const db = c.get('db');
    const { projectId, bookingType, id } = c.req.valid('param');
    
    if (!bookingType || !id) {
      return c.json({ success: false, error: 'Missing booking type or ID' }, 400);
    }

    const result = await BookingsService.getBookingById(db, bookingType, id);
    return c.json(result);
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

export default bookingsRouter;