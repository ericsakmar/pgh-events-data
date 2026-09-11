import * as cheerio from "cheerio";
import { fetchPage } from "../../util/fetchPage.ts";
import { type Event, filterInvalid } from "../event.ts";

export const url = "https://www.poetrymillvale.com/events/month/";

const getPage = async (data: string) => {
  const $ = cheerio.load(data);

  const events = $("script[type='application/ld+json']")
    .toArray()
    .map((el) => {
      const ldJson = $(el).text().trim();
      return ldJson ? JSON.parse(ldJson) : null;
    })
    .filter((data) => Array.isArray(data))
    .flatMap((data) => data)
    .filter((data) => data["@type"] === "Event")
    .map((data) => ({
      title: data.name,
      date: new Date(data.startDate).toISOString(),
      location: "Poetry Lounge",
      link: data.url,
      source: url,
      hasTime: true,
      poster: data.image,
      city: "pgh",
    }));

  return events;
};

export const getEvents = async (): Promise<Event[]> => {
  const page1 = await fetchPage(url);
  const page1events = await getPage(page1);

  const $ = cheerio.load(page1);

  const page2url = $(".tribe-events-c-top-bar__nav-link--next")
    .attr("href")
    ?.trim();

  const page2 = page2url ? await fetchPage(page2url) : undefined;

  const page2events = page2 ? await getPage(page2) : [];

  return filterInvalid([...page1events, ...page2events]);
};
