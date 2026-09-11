import * as cheerio from "cheerio";
import { parseDate } from "../../util/parseDate.ts";
import { fetchPage } from "../../util/fetchPage.ts";
import { type Event, filterInvalid } from "../event.ts";
import { findTimes } from "../../util/findTime.ts";

export const url = "https://www.clubcafelive.com/upcoming-shows";

export const getEvents = async (): Promise<Event[]> => {
  const data = await fetchPage(url);

  const $ = cheerio.load(data);

  const events = $(".list-item")
    .toArray()
    .map((el) => {
      const n = $(el);

      const title = n.find(".list-item-content__title").text().trim();

      const details = n.find(".list-item-content__description p");

      const rawDate = details.eq(0).text().trim();

      const desc = n.find(".list-item-content__description").text().trim();
      const rawTime = findTimes(desc);

      const hasTime = rawTime !== null;

      const date = hasTime
        ? parseDate(`${rawDate} at ${rawTime}`)
        : parseDate(rawDate);

      // some events don't have a date yet (as of Jul 14 2025)
      if (date === undefined) {
        return null;
      }

      const location = "Club Cafe";

      const link = n.find(".list-item-content__button").attr("href")?.trim();

      const poster = n.find(".list-image").attr("src")?.trim();

      return {
        title,
        date,
        location,
        link: link === "/" ? url : link,
        source: url,
        hasTime,
        poster,
        city: "pgh",
      };
    });

  return filterInvalid(events);
};
