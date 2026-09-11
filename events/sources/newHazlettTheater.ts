import * as cheerio from "cheerio";
import { parseDate } from "../../util/parseDate.ts";
import { fetchPage } from "../../util/fetchPage.ts";
import { type Event, filterInvalid } from "../event.ts";

export const url = "https://newhazletttheater.org/events/";

const parsePage = async (pageUrl: string) => {
  const data = await fetchPage(pageUrl);

  const $ = cheerio.load(data);

  const title = $(".pageLead_headline").text().trim();
  const location = "New Hazlett Theater";
  const link = pageUrl;
  const poster = $(".attachment-post-thumbnail").attr("src");

  const dates = $(".event_dateGroup")
    .toArray()
    .flatMap((el) => {
      const n = $(el);
      const rawDate = n.find(".event_day").text().trim();

      const dates = n
        .find(".btn--time")
        .toArray()
        .map((timeEl) => $(timeEl).text().trim())
        .map((rawTime) => `${rawDate} at ${rawTime}`)
        .map(parseDate);

      return dates;
    });

  return dates.map((date) => ({
    title,
    date,
    location,
    link,
    source: url,
    hasTime: true,
    poster: poster !== "" ? poster : undefined,
    city: "pgh",
  }));
};

export const getEvents = async (): Promise<Event[]> => {
  const data = await fetchPage(url);

  const $ = cheerio.load(data);

  const pageLinks = $(".eventCard")
    .toArray()
    .map((el) => {
      const n = $(el);
      const pageLink = n.find(".eventCard_link").attr("href")?.trim();
      return pageLink;
    })
    .map((page) => (page ? parsePage : []));

  const events = await Promise.all(pageLinks);
  return filterInvalid(events.flatMap((e) => e));
};
