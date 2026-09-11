import * as cheerio from "cheerio";
import { parseDate } from "../../util/parseDate.ts";
import { fetchDynamicPage } from "../../util/fetchDynamicPage.ts";
import { type Event, filterInvalid } from "../event.ts";

export const url = "https://events.ticketleap.com/events/perry-house";

export const getEvents = async (): Promise<Event[]> => {
  const data = await fetchDynamicPage(url, ".listing-item");

  const $ = cheerio.load(data);

  const events = $(".listing-item")
    .toArray()
    .map((el) => {
      const n = $(el);

      const title = n.find(".listing-item__listing-title").text().trim();

      const rawDate = n.find(".listing-item__event-date").text().trim();

      const date = parseDate(rawDate);

      const link = n.find(".button--primary").attr("href")?.trim();

      const location = "Perry-House Productions";

      const poster = n.find(".listing-item__image").attr("src")?.trim();

      return {
        title,
        date,
        location,
        poster: poster ? `https:${poster}` : undefined,
        link: link ? `https://www.ticketleap.events${link}` : url,
        source: url,
        hasTime: true,
        city: "pgh",
      };
    });

  return filterInvalid(events);
};
