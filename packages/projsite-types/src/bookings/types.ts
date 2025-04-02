import { z } from "zod";
import { bookingDateRangeSchema } from "./schema";

export type BookingDateRange = z.infer<typeof bookingDateRangeSchema>;
