import * as cheerio from "cheerio";
import { parseDate } from "../../util/parseDate.ts";
import { fetchPage } from "../../util/fetchPage.ts";
import { findTime } from "../../util/findTime.ts";
import { type Event, filterInvalid } from "../event.ts";

export const url = "http://www.thegoldmark.com/events";

export const getEvents = async (): Promise<Event[]> => {
  const data = await fetchPage(url);

  const $ = cheerio.load(data);

  const events = $(".eventlist-event")
    .toArray()
    .map((el) => {
      const n = $(el);

      const title = n.find(".eventlist-title").text().trim();

      const rawMonth = n
        .find(".eventlist-datetag-startdate--month")
        .text()
        .trim();

      const rawDay = n.find(".eventlist-datetag-startdate--day").text().trim();

      const description = n.find(".eventlist-description").text().trim();
      const rawTime = findTime(description);
      const hasTime = rawTime !== null;

      const date = hasTime
        ? parseDate(`${rawMonth} ${rawDay} at ${rawTime}`)
        : parseDate(`${rawMonth} ${rawDay}`);

      const location = "The Goldmark";

      const rawLink = n.find(".eventlist-title-link").attr("href")?.trim();

      const link = `https://www.thegoldmark.com${rawLink}`;

      const poster = n.find(".eventlist-thumbnail").attr("data-src");

      return {
        title,
        date,
        location,
        link,
        source: url,
        hasTime,
        poster: poster?.trim(),
        city: "pgh",
      };
    });

  return filterInvalid(events);
};
