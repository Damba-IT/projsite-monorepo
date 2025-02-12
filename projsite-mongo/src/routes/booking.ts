import { Hono } from 'hono';
import { BookingsService } from '../services/bookings-service';
import type { HonoEnv } from '../types';
import { GetBookingsParams } from '../types/booking';



const bookingsRouter = new Hono<HonoEnv>();

async function fetchBookings(c: any, bookingType?: string) {
  try {
    const db = c.get('db');

    const project_id = c.req.query('project_id');
    const startDate = c.req.query('startDate');
    const endDate = c.req.query('endDate');

    const parseArray = (val?: string): string[] | undefined =>
      val ? val.split(',').map(s => s.trim()).filter(Boolean) : undefined;

    const zones = parseArray(c.req.query('zones'));
    const subProjects = parseArray(c.req.query('subProjects'));
    const contractors = parseArray(c.req.query('contractors'));
    const resources = parseArray(c.req.query('resources'));
    const requestStatus = c.req.query('requestStatus');
    const isConfirmed = c.req.query('isConfirmed') === 'false' ? false : true;

    const params: GetBookingsParams = {
      project_id: project_id || "",
      startDate: startDate || "",
      endDate: endDate || "",
      zones,
      subProjects,
      contractors,
      resources,
      requestStatus,
      isConfirmed
    };

    const result = await BookingsService.getBookings(db, params, bookingType);
    return c.json(result, result.success ? 200 : 400);
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
}

bookingsRouter.get('/', (c) => fetchBookings(c));

bookingsRouter.get('/shipment', (c) => fetchBookings(c, 'shipment'));
bookingsRouter.get('/waste', (c) => fetchBookings(c, 'waste'));
bookingsRouter.get('/resource', (c) => fetchBookings(c, 'resource'));

bookingsRouter.get('/:bookingType/:id', async (c) => {
  try {
    const db = c.get('db');
    const { bookingType, id } = c.req.param();

    const result = await BookingsService.getBookingById(db, bookingType, id);
    return c.json(result, result.success ? 200 : 400);
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

export default bookingsRouter;