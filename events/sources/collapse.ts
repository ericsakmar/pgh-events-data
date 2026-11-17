import * as cheerio from "cheerio";
import { parseDate } from "../../util/parseDate.ts";
import { fetchPage } from "../../util/fetchPage.ts";
import { type Event, filterInvalid } from "../event.ts";

export const url = "https://collapsepgh.com/";

export const getEvents = async (): Promise<Event[]> => {
  const data = await fetchPage(url);

  const $ = cheerio.load(data);

  const events = $(".event-card")
    .toArray()
    .map((el) => {
      const n = $(el);

      const title = n.find(".event-title").text().trim();

      // "Date: November 20, 2026"
      const rawDate = n
        .find(".event-date")
        .text()
        .trim()
        .replace("Date:", "")
        .trim();

      // "Time: 10:00 PM – 4:00 AM"
      const rawTime = n
        .find(".event-time")
        .text()
        .trim()
        .replace("Time:", "")
        .split("–")[0]
        .trim();

      const date = parseDate(`${rawDate} at ${rawTime}`);

      // "/img/XKQiCaWMTp-1080.jpeg"
      const poster = n.find("img").attr("src")?.trim();

      return {
        title,
        date,
        location: "Collapse",
        link: url,
        source: url,
        hasTime: true,
        poster: `https://collapsepgh.com${poster}`,
        city: "pgh",
      };
    });

  return filterInvalid(events);
};
