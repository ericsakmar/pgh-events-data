import * as cheerio from "cheerio";
import { parseDate } from "../../util/parseDate.ts";
import { fetchPage } from "../../util/fetchPage.ts";
import { type Event, filterInvalid } from "../event.ts";

type RobotoEvent = {
  rawDate: string;
  title: string;
  link: string | undefined;
};

export const url = "https://www.therobotoproject.com/calendar.html";

export const getEvents = async (): Promise<Event[]> => {
  const data = await fetchPage(url);

  const $ = cheerio.load(data);

  const events = $(".wsite-section-elements .paragraph")
    .toArray()
    .map((el) => {
      const n = $(el);
      const children = n.children();

      const data: RobotoEvent[] = [];
      let i = 0;
      while (i < children.length) {
        const current = $(children[i]);

        // check for a `<strong>` tag with a date
        if (current.is("strong")) {
          const rawDate = current.text().trim();

          const link = current.next();
          const href = link.attr("href");
          const title = link.text().trim();

          data.push({
            rawDate,
            title,
            link: href,
          });
        }

        i++;
      }

      return data;
    })
    .flat()
    .map((event) => ({
      title: event.title,
      date: parseDate(event.rawDate),
      location: "The Mr. Roboto Project",
      link: url,
      source: url,
      hasTime: true,

      // only treat imgur links as posters
      // "https://i.imgur.com/eJW2AZZ.jpeg"
      poster: event.link?.includes("https://i.imgur.com/")
        ? event.link
        : undefined,

      city: "pgh",
    }));

  const valid = filterInvalid(events);
  return valid;
};
