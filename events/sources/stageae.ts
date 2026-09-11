import * as cheerio from "cheerio";
import { parseDate } from "../../util/parseDate.ts";
import { fetchPage } from "../../util/fetchPage.ts";
import { type Event, filterInvalid } from "../event.ts";

export const url = "https://promowestlive.com/pittsburgh/stage-ae";

export const getEvents = async (): Promise<Event[]> => {
  const data = await fetchPage(url);

  const $ = cheerio.load(data);

  const events = $(".events-list .card")
    .toArray()
    .map((el) => {
      const n = $(el);

      const title = n.find(".info h2").text().trim();

      const rawDate = n.find(".date .doors-time").text().trim();

      const rawTime = n.find(".time .doors-time").text().trim();

      const date = parseDate(`${rawDate} ${rawTime}`);

      const location = n.find(".venue-name").text().trim();

      const link = n.find(".box-link").attr("href")?.trim();

      const poster = n
        .find(".background-image")
        .first()
        .attr("style")
        ?.match(/'.*?'/)?.[0]
        .replace(/'/g, "");

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
    })
    .filter((e) => e.location === "Stage AE");

  return filterInvalid(events);
};
