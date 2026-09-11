import { z } from "zod";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.iso.datetime(),
  location: z.string().min(1, "Location is required"),
  link: z.url().optional(),
  source: z.url(),
  hasTime: z.boolean(),
  poster: z.url().optional(),
  city: z.enum(["pgh", "mgw", "yng"]),
});

export type Event = z.infer<typeof eventSchema>;

export const filterInvalid = (events: any[]): Event[] => {
  return events.filter((event) => {
    const result = eventSchema.safeParse(event);

    if (!result.success) {
      console.warn("Invalid event:");
      console.warn(JSON.stringify(event, null, 2));
      console.warn(z.treeifyError(result.error));

      return false;
    }

    return true;
  });
};
