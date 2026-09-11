import * as cheerio from "cheerio";
import { parseDate } from "../../util/parseDate.ts";
import { fetchPage } from "../../util/fetchPage.ts";
import { type Event, filterInvalid } from "../event.ts";

export const url = "https://mattress.org/calendar/";

export const getEvents = async (): Promise<Event[]> => {
  const data = await fetchPage(url);

  const $ = cheerio.load(data);

  const events = $("#cal-repeater > div")
    .toArray()
    .map((el) => {
      const n = $(el);

      const title = n.find("h4").text().trim();

      const rawDate = n.find(".ct-code-block").text().trim();

      const date = parseDate(rawDate);

      const location = "Mattress Factory";

      const link = n.find("a").attr("href")?.trim();

      const poster = n.find("img").attr("data-src")?.trim();

      return {
        title,
        date,
        location,
        link,
        source: url,
        hasTime: true,
        poster,
        city: "pgh",
      };
    });

  return filterInvalid(events);
};
