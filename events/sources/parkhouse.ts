import * as cheerio from "cheerio";
import { parseDate } from "../../util/parseDate.ts";
import { fetchPage } from "../../util/fetchPage.ts";
import { type Event, filterInvalid } from "../event.ts";

export const url = "https://parkhouse412.com/calendar/list/";

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
        location: "Park House",
        link: event.url,
        source: url,
        hasTime,
        poster:
          "https://parkhouse412.com/wp-content/uploads/2025/11/Park-House-Logo.png",
        city: "pgh",
      };
    });

  return filterInvalid(events);
};
