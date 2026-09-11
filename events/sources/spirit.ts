import * as cheerio from "cheerio";
import { parseDate } from "../../util/parseDate.ts";
import { fetchPage } from "../../util/fetchPage.ts";
import { findTime } from "../../util/findTime.ts";
import { type Event, filterInvalid } from "../event.ts";

export const url = "https://www.spiritpgh.com/events";

export const getEvents = async (): Promise<Event[]> => {
  const data = await fetchPage(url);

  const $ = cheerio.load(data);

  const events = $(".summary-item")
    .toArray()
    .map((el) => {
      const n = $(el);

      const title = n.find(".summary-title").text().trim();

      const rawDate = n
        .find(".summary-metadata-item--date")
        .first()
        .text()
        .trim();

      const summaryNode = n
        .find(".summary-excerpt-only p")
        .contents()
        .toArray()
        .map((el) => $(el).text())
        .map((raw) => raw.replace(/-\d+/, ""))
        .map((raw) => findTime(raw))
        .filter((time) => time !== null);

      const rawTime = summaryNode[0];

      const date = parseDate(`${rawDate} ${rawTime}`);

      // const locationTag = n
      //   .find(".summary-metadata-item--tags")
      //   .first()
      //   .text()
      //   .trim()

      const location = `Spirit`;

      const rawLink = n
        .find(".summary-thumbnail-container")
        .attr("href")
        ?.trim();

      const link = `https://spiritpgh.com${rawLink}`;

      const poster = n.find(".summary-thumbnail-image").attr("data-src");

      return {
        title,
        date,
        location,
        link,
        source: url,
        hasTime: true,
        poster: poster?.trim(),
        city: "pgh",
      };
    });

  return filterInvalid(events);
};
