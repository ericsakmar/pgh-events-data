import * as cheerio from "cheerio";
import { fetchPage } from "../../util/fetchPage.ts";
import { type Event, filterInvalid } from "../event.ts";
import { parse } from "date-fns";

export const url = "https://cityofasylum.org/events/";

// 2022-06-26T15:00:00-04:00
const parseDate = (raw: string) =>
  parse(raw, "yyyy-MM-dd'T'HH:mm:ssxxx", new Date()).toISOString();

export const getEvents = async (): Promise<Event[]> => {
  const data = await fetchPage(url);

  const $ = cheerio.load(data);

  const events = $(`.site-inner script[type="application/ld+json"]`)
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
        location: "City of Asylum",
        link: event.url,
        source: url,
        hasTime: true,
        poster: event.image,
        city: "pgh",
      };
    });

  return filterInvalid(events);
};
