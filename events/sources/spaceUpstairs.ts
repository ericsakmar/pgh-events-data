import * as cheerio from "cheerio";
import { parseDate } from "../../util/parseDate.ts";
import { fetchPage } from "../../util/fetchPage.ts";
import { type Event, filterInvalid } from "../event.ts";

export const url = "https://www.thespaceupstairs.org/events";

const getDates = (rawDate: string) => {
  // could be multiple...
  if (rawDate.includes("/")) {
    const rawDays = rawDate.split(" ")[1].replace(",", "");

    const dates = rawDays
      .split("/")
      .map((d) => rawDate.replace(rawDays, d))
      .map((raw) => parseDate(raw));

    return dates;
  }

  const singleDate = parseDate(rawDate);
  return [singleDate];
};

export const getEvents = async (): Promise<Event[]> => {
  const data = await fetchPage(url);

  const $ = cheerio.load(data);

  const events = $(`[role="listitem"] [data-testid="mesh-container-content"]`)
    .toArray()
    .flatMap((el) => {
      const n = $(el);

      const rawTitle = $(n.children().get(2)).text();

      // a lot can go wrong in this parsing...
      try {
        const title = rawTitle
          .replaceAll("\n", " ")
          .split(/\s*\|\s*/)[0]
          .trim();

        const rawDate = $(n.children().get(1)).text();

        const dates = getDates(rawDate);

        const location = "The Space Upstairs";

        const link = "https://www.thespaceupstairs.org/events";

        const poster = n.find("img").attr("src")?.trim().split("/v1")[0];

        return dates.map((date) => ({
          title,
          date,
          location,
          link,
          source: url,
          hasTime: false,
          poster,
          city: "pgh",
        }));
      } catch (e) {
        console.warn(`error while parsing ${rawTitle}`);
        console.warn(e);
        return [];
      }
    });

  return filterInvalid(events);
};
