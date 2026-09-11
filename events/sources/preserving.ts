import * as cheerio from "cheerio";
import { parseDate } from "../../util/parseDate.ts";
import { fetchDynamicPage } from "../../util/fetchDynamicPage.ts";
import { type Event, filterInvalid } from "../event.ts";

export const url = "https://www.preservingunderground.com/shows";
const waitForSelector = `[data-hook="image"]`;

export const getEvents = async (): Promise<Event[]> => {
  const data = await fetchDynamicPage(url, waitForSelector);

  const $ = cheerio.load(data);

  const events = $(`[data-hook="events-card"]`)
    .toArray()
    .map((el) => {
      const n = $(el);

      const title = n.find(`[data-hook="title"]`).text().trim();

      const rawDate = n.find(`[data-hook="short-date"]`).first().text().trim();

      const date = parseDate(rawDate);

      const location = "Preserving Underground";

      const link = n.find(`[data-hook="title"]`).attr("href")?.trim();

      const poster = n.find("wow-image img").eq(1).attr("src")?.trim();

      return {
        title,
        date,
        location,
        link,
        source: url,
        hasTime: false,
        poster,
        city: "pgh",
      };
    });

  return filterInvalid(events);
};
