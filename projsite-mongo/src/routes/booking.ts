// src/routes/bookings.ts
import { Hono } from 'hono';
import { BookingsService } from '../services/BookingsService';

interface GetBookingsParams {
  project_id: string;
  startDate: string;
  endDate: string;
  zones?: string[];
  subProjects?: string[];
  contractors?: string[];
  resources?: string[];
  requestStatus?: string;
  isConfirmed?: boolean;
}

const bookingsRouter = new Hono();
const bookingsService = new BookingsService();

// GET /api/bookings?project_id=...&startDate=...&endDate=...&...
bookingsRouter.get('/', async (c) => {
  try {
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

    const result = await bookingsService.getBookings(params);
    return c.json(result, result.success ? 200 : 400);
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

export default bookingsRouter;
