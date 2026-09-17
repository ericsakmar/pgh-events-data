import * as cheerio from "cheerio";
import { parseDate } from "../../util/parseDate.ts";
import { fetchDynamicPage } from "../../util/fetchDynamicPage.ts";
import { type Event, filterInvalid } from "../event.ts";
import { findTime } from "../../util/findTime.ts";

export const url = "https://www.brilloboxpgh.com/events/";
const waitForSelector = ".eo-eb-event-box";

export const getEvents = async (): Promise<Event[]> => {
  const data = await fetchDynamicPage(url, waitForSelector);

  const $ = cheerio.load(data);

  const events = $(".eo-eb-event-box")
    .toArray()
    .map((el) => {
      const n = $(el);

      const title = n.find(".eo-eb-event-title").text().trim();
      const rawDate = n.find(".eo-eb-date-container").text().trim();
      const rawTime = findTime(title);
      const hasTime = rawTime !== null;
      const date = parseDate(hasTime ? `${rawDate} at ${rawTime}` : rawDate);
      const location = "Brillobox";
      const link = n.find(".eo-eb-event-title a").attr("href")?.trim();
      const poster = n.find("img").attr("src")?.trim().replace("http", "https");

      return {
        title,
        date,
        location,
        link,
        source: url,
        hasTime,
        poster,
        city: "pgh",
      };
    });

  return filterInvalid(events);
};
