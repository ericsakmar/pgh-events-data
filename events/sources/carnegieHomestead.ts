import * as cheerio from "cheerio";
import { parseDate } from "../../util/parseDate.ts";
import { fetchPage } from "../../util/fetchPage.ts";
import { type Event, filterInvalid } from "../event.ts";

export const url = "https://librarymusichall.com/all-shows";

export const getEvents = async (): Promise<Event[]> => {
  // TODO this site uses an infinite scroll to keep loading events. maybe there's something
  // we can do with Puppeteer to get more data
  const data = await fetchPage(url);

  const $ = cheerio.load(data);

  const events = $(".eventColl-item")
    .toArray()
    .map((el) => {
      const n = $(el);

      const title = n.find(".eventColl-eventInfo").text().trim();

      const rawMonth = n.find(".eventColl-month").text().trim();

      const rawDay = n.find(".eventColl-date").text().trim();

      const rawTime = n.find(".eventColl-detail--doors").text().trim();

      const rawDate = `${rawMonth} ${rawDay} at ${rawTime}`;

      const date = parseDate(rawDate);

      const location = "Carnegie Library of Homestead Music Hall";

      const link = n.find(".eventColl-eventInfo a").attr("href")?.trim();

      const poster = n.find("img").attr("src");

      return {
        title,
        date,
        location,
        link: `https://librarymusichall.com${link}`,
        source: url,
        hasTime: true,
        poster,
        city: "pgh",
      };
    });

  return filterInvalid(events);
};
