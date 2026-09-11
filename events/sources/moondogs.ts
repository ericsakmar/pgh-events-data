import * as cheerio from "cheerio";
import { parseDate } from "../../util/parseDate.ts";
import { fetchPage } from "../../util/fetchPage.ts";
import { type Event, filterInvalid } from "../event.ts";

export const url = "https://moondogs.us/shows/";

export const getEvents = async (): Promise<Event[]> => {
  const data = await fetchPage(url);

  const $ = cheerio.load(data);

  const events = $(".ecs-event")
    .toArray()
    .map((el) => {
      const n = $(el);

      const title = n.find(".title2").text().trim();

      const month = n.find(".callout_month").text().trim();
      const dayOfMonth = n.find(".callout_date").text().trim();
      const time = n.find(".callout_time").text().trim();
      const rawDate = `${month} ${dayOfMonth} at ${time}`;
      const date = parseDate(rawDate);

      const link = n.find(".entry-title a").attr("href")?.trim();
      const poster = n.find(".ecs_event_feed_image").attr("src")?.trim();

      return {
        title,
        date,
        location: "Moondogs",
        link,
        source: url,
        hasTime: true,
        poster,
        city: "pgh",
      };
    });

  return filterInvalid(events);
};
