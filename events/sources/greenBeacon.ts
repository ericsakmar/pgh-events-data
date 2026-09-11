import * as cheerio from "cheerio";
import { parseDate } from "../../util/parseDate.ts";
import { fetchPage } from "../../util/fetchPage.ts";
import { type Event, filterInvalid } from "../event.ts";

export const url = "https://www.greenbeacongallery.com/events";

export const getEvents = async (): Promise<Event[]> => {
  const data = await fetchPage(url);

  const $ = cheerio.load(data);

  const events = $(".eventlist-event")
    .toArray()
    .map((el) => {
      const n = $(el);

      const title = n.find(".eventlist-title").text().trim();

      const rawDate = n.find(".eventlist-datetag").text().trim();

      const rawTime = n.find(".event-time-localized-start").text().trim();

      const date = parseDate(`${rawDate} ${rawTime}`);

      const location = "Green Beacon Gallery";

      const link = n.find(".eventlist-title-link").attr("href")?.trim();

      const poster = n.find(".eventlist-column-thumbnail img").attr("data-src");

      return {
        title,
        date,
        location,
        link: `https://www.greenbeacongallery.com${link}`,
        source: url,
        hasTime: true,
        poster,
        city: "pgh",
      };
    });

  return filterInvalid(events);
};
