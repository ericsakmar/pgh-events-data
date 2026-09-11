import * as cheerio from "cheerio";
import { parseDate } from "../../util/parseDate.ts";
import { fetchPage } from "../../util/fetchPage.ts";
import { type Event, filterInvalid } from "../event.ts";

export const url = "https://gbx.simpletix.com/";

export const getEvents = async (): Promise<Event[]> => {
  const data = await fetchPage(url);

  const $ = cheerio.load(data);

  const events = $(".list-box")
    .toArray()
    .map((el) => {
      const n = $(el);

      const title = n
        .find(".st_event_list_display_body_event_title")
        .text()
        .trim();

      const rawDate = n.find(".event_date_time").text().trim();

      const date = rawDate ? parseDate(rawDate) : undefined;

      const location = "The Glitterbox Theater";

      const link = n.find(".links").attr("href")?.trim();

      // background-image:url(https://cdn.simpletix.com/061a0c3f-1f7b-4166-938e-d883d9b287b7/shows/560/letslaughatwhimsy9-12-26small.png)
      const poster = n
        .find(".event_image")
        .attr("style")
        ?.match(/url\((.*?)\)/)?.[1];

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
