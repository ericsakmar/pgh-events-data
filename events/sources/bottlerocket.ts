import * as cheerio from "cheerio";
import { parseDate } from "../../util/parseDate.ts";
import { fetchPage } from "../../util/fetchPage.ts";
import { findTimes } from "../../util/findTime.ts";
import { type Event, filterInvalid } from "../event.ts";

export const url = "https://app.opendate.io/v/bottlerocket-social-hall-1260";

export const getEvents = async (): Promise<Event[]> => {
  const data = await fetchPage(url);

  const $ = cheerio.load(data);

  const events = $(".card")
    .toArray()
    .map((el) => {
      const n = $(el);

      const title = n.find(".card-body > p").first().text().trim();

      const rawDate = $(n.find(".card-body > p").get(1)).text().trim();
      const rawTime = $(n.find(".card-body > p").get(2)).text().trim();

      const times = findTimes(rawTime);

      const rawDateTime = times[1] ? `${rawDate} at ${times[1]} ` : rawDate;

      const date = parseDate(rawDateTime);

      const location = "Bottlerocket Social Hall";

      const link = n.find("a").attr("href")?.trim();

      const poster = n.find("img").attr("src")?.trim();

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
    });

  return filterInvalid(events);
};
