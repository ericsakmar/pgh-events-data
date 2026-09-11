import * as cheerio from "cheerio";
import { parseDate } from "../../util/parseDate.ts";
import { fetchPage } from "../../util/fetchPage.ts";
import { type Event, filterInvalid } from "../event.ts";

export const url = "https://mrsmalls.com/listing";

export const getEvents = async (): Promise<Event[]> => {
  const data = await fetchPage(url);

  const $ = cheerio.load(data);

  const events = $(".event")
    .toArray()
    .map((el) => {
      const n = $(el);

      const title = n.find(".show-title").text().trim();

      const rawDate = n.find(".date-show").attr("content")?.trim();

      const date = rawDate ? parseDate(rawDate) : undefined;

      const location = n.find(".venue-location-name").text().trim();

      const link = n.find(".more-info").attr("href")?.trim();

      const poster = n.find(".thumbnail").attr("src")?.trim();

      return {
        title,
        date,
        location: location === "" ? "Mr. Smalls Theatre" : location,
        link,
        source: url,
        hasTime: true,
        poster,
        city: "pgh",
      };
    });

  return filterInvalid(events);
};
