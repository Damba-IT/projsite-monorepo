import { z } from "zod";

export const bookingDateRangeSchema = z
  .object({
    from: z.preprocess(
      arg => {
        if (typeof arg === "string" || typeof arg === "number") {
          return new Date(arg);
        }
        return arg;
      },
      z.date({
        required_error: "Please select a start date",
      })
    ),
    to: z.preprocess(
      arg => {
        if (typeof arg === "string" || typeof arg === "number") {
          return new Date(arg);
        }
        return arg;
      },
      z.date({
        required_error: "Please select an end date",
      })
    ),
    isAllDay: z.boolean(),
  })
  .refine(data => data.from || data.to, {
    message: "Please select a date range",
  })
  .refine(data => data.to > data.from, {
    message: "End date must be after the start date",
  });