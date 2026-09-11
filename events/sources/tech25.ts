import * as cheerio from "cheerio";
import { parseDate } from "../../util/parseDate.ts";
import { fetchPage } from "../../util/fetchPage.ts";
import { type Event, filterInvalid } from "../event.ts";

export const url = "https://www.tech25.org/calendar";

export const getEvents = async (): Promise<Event[]> => {
  const data = await fetchPage(url);

  const $ = cheerio.load(data);

  const events = $("#newsList table tr")
    .toArray()
    .map((el) => {
      const n = $(el);

      // skip rows that don't have 4 columns
      if (n.find("td").length < 4) {
        return null;
      }

      const titleEl = n.find("td:nth-child(2) a");
      const title = titleEl.text().trim();
      const rawDate = n.find("td:nth-child(3)").text().trim();
      const date = parseDate(rawDate);
      const link = titleEl.attr("href")?.trim();
      const poster = n.find(".newsEventListingPhotoIcon").attr("src")?.trim();

      return {
        title,
        date,
        location: "Tech25",
        link: `https://www.tech25.org${link}`,
        source: url,
        hasTime: true,
        poster: `https://www.tech25.org${poster}`,
        city: "pgh",
      };
    });

  return filterInvalid(events);
};
