import { z } from "zod";

const feedSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string(),
  url: z.url().optional(),
  timestamp: z.iso.datetime(),
  tags: z.array(z.enum(["blog", "podcast", "playlist", "youtube channel"])),
  image: z.url().optional(),
});

export type Feed = z.infer<typeof feedSchema>;

export const filterInvalid = (events: any[]): Feed[] => {
  return events.filter((event) => {
    const result = feedSchema.safeParse(event);

    if (!result.success) {
      console.warn("Invalid feed:");
      console.warn(JSON.stringify(event, null, 2));
      console.warn(JSON.stringify(result.error, null, 2));

      return false;
    }

    return true;
  });
};
