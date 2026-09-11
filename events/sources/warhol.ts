import * as cheerio from "cheerio";
import { parseDate } from "../../util/parseDate.ts";
import { fetchPage } from "../../util/fetchPage.ts";
import { type Event, filterInvalid } from "../event.ts";

export const url =
  "https://www.warhol.org/calendar/list/?tribe_eventcategory%5B0%5D=1546";

export const getEvents = async (): Promise<Event[]> => {
  const data = await fetchPage(url);
  const $ = cheerio.load(data);

  const events = $(`body script[type="application/ld+json"]`)
    .toArray()
    .map((el) => {
      const ldJson = $(el).text().trim();
      return ldJson ? JSON.parse(ldJson) : null;
    })
    .flatMap((events) => events)
    .map((event) => {
      const hasTime = event.startDate.includes("T");

      return {
        title: event.name,
        date: parseDate(event.startDate),
        location: event.location.name ?? "The Warhol",
        link: event.url,
        source: url,
        hasTime,
        poster: event.image,
        city: "pgh",
      };
    });

  return filterInvalid(events);
};
