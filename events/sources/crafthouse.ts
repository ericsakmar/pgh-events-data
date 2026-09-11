import * as cheerio from "cheerio";
import { parseDate } from "../../util/parseDate.ts";
import { fetchPage } from "../../util/fetchPage.ts";
import { type Event, filterInvalid } from "../event.ts";

export const url = "https://crafthousepgh.com/events-shows/";

export const getEvents = async (): Promise<Event[]> => {
  const data = await fetchPage(url);

  const $ = cheerio.load(data);

  const events = $(".pp-content-post")
    .toArray()
    .map((el) => {
      const n = $(el);

      const titleAndDate = n.find(".pp-post-title").text().trim();

      const [rawTitle, rawDate] = titleAndDate.split("∙");

      const title = rawTitle.trim();

      const date = parseDate(rawDate);

      const location = n
        .find(`[itemprop="publisher"] meta`)
        .attr("content")
        ?.trim();

      const link = n.find(".pp-post-link").attr("href")?.trim();

      const poster = n.find(".pp-post-img").attr("src")?.trim();

      return {
        title,
        date,
        location,
        link,
        source: url,
        hasTime: false,
        poster,
        city: "pgh",
      };
    });

  return filterInvalid(events);
};
