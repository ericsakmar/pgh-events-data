import * as cheerio from "cheerio";
import { parseDate } from "../../util/parseDate.ts";
import { fetchPage } from "../../util/fetchPage.ts";
import { type Event, filterInvalid } from "../event.ts";

export const url = "https://belvederesultradive.com/";

export const getEvents = async (): Promise<Event[]> => {
  const data = await fetchPage(url);

  const $ = cheerio.load(data);

  const events = $(".eventbox")
    .toArray()
    .map((el) => {
      const n = $(el);

      const title = n.find(".eventtextx").text().trim();

      const rawDate = n.find(".date").text().replace("More Info", "").trim();

      const date = parseDate(`${rawDate} at 9pm`);

      const location = "Belvederes Ultra Dive";

      const link = "https://belvederesultradive.com/";

      const relativePoster = n.find("img").attr("src")?.trim();

      const poster = `https://belvederesultradive.com/${relativePoster}`;

      return {
        poster,
        title,
        date,
        location,
        link,
        source: url,
        hasTime: true,
        city: "pgh",
      };
    });

  return filterInvalid(events);
};
