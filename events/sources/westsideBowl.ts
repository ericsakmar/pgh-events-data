import * as cheerio from "cheerio";
import { parseDate } from "../../util/parseDate.ts";
import { fetchPage } from "../../util/fetchPage.ts";
import { type Event, filterInvalid } from "../event.ts";

export const url = "https://westsidebowl.com/events/";

export const getEvents = async (): Promise<Event[]> => {
  const data = await fetchPage(url);

  const $ = cheerio.load(data);

  const events = $(`.tribe-events script[type="application/ld+json"]`)
    .toArray()
    .map((el) => {
      const ldJson = $(el).text().trim();
      return ldJson ? JSON.parse(ldJson) : null;
    })
    .flatMap((events) => events)
    .map((event) => {
      return {
        title: event.name,
        date: parseDate(event.startDate),
        location: "Westside Bowl",
        link: event.url,
        source: url,
        hasTime: true,
        poster: event.image,
        city: "yng",
      };
    });

  return filterInvalid(events);
};
