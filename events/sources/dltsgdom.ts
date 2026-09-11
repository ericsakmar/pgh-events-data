import * as cheerio from "cheerio";
import { parseDate } from "../../util/parseDate.ts";
import { fetchDynamicPage } from "../../util/fetchDynamicPage.ts";
import { type Event, filterInvalid } from "../event.ts";

export const url = "https://events.ticketleap.com/events/dltsgdom";

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

      const link = n.attr("href")?.trim();

      const location = n.find(".listing-item__venue-info").text().trim();

      const poster = n.find(".listing-item__image").attr("src")?.trim();

      return {
        title,
        date,
        location,
        poster: poster ? `https:${poster}` : undefined,
        // https://www.ticketleap.events/tickets/dltsgdom/good-sleepy-if-kansas-had-trees-bug-moment
        link: `https://www.ticketleap.events${link}`,
        source: url,
        hasTime: true,
        city: "pgh",
      };
    });

  return filterInvalid(events);
};
