import * as cheerio from "cheerio";
import { parseDate } from "../../util/parseDate.ts";
import { fetchDynamicPage } from "../../util/fetchDynamicPage.ts";
import { type Event, filterInvalid } from "../event.ts";

export const url = "https://theticketing.co/o/sidequestpgh";
const waitForSelector = "#app h1";

export const getEvents = async (): Promise<Event[]> => {
  const data = await fetchDynamicPage(url, waitForSelector);

  const $ = cheerio.load(data);

  const header = $("h1")
    .toArray()
    .filter((n) => {
      return $(n).text().trim() === "Upcoming Events";
    });

  const eventsContainer = $(header[0]).next();

  const events = eventsContainer
    .children()
    .toArray()
    .map((el) => {
      const n = $(el);

      const title = n.children("div").eq(0).find("p").first().text().trim();

      const rawDate = n.children("div").eq(0).find("p").eq(2).text().trim();

      const hasTime = true;

      const date = parseDate(rawDate.replace("/", "at"));

      const location = "SideQuest";

      // https://theticketing.co/e/craze?open=true
      const link = n.find('a:contains("Get Tickets")').attr("href");

      // const poster = n.find("img").attr("src")?.trim().replace("http", "https")
      const imageStyle = n
        .find('a div[alt="Event Promoter banner"]')
        .attr("style");
      let poster: string | undefined = undefined;
      if (imageStyle) {
        const match = imageStyle.match(/url\("([^"]+)"\)/);
        if (match && match[1]) {
          poster = match[1];
        }
      }

      return {
        title,
        date,
        location,
        link: link ? `https://theticketing.co${link}` : undefined,
        source: url,
        hasTime,
        poster,
        city: "pgh",
      };
    });

  return filterInvalid(events);
};
