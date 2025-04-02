import { z } from "zod";

export const locationSchema = z
  .object({
    address: z.string(),
    formatted_address: z.string(),
    place_id: z.string(),
    lat: z.number(),
    lng: z.number(),
  })

  export const dateRangeSchema = z
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
    )
  })
  .refine(data => data.from || data.to, {
    message: "Please select a date range",
  })
  .refine(data => data.to > data.from, {
    message: "End date must be after the start date",
  });
