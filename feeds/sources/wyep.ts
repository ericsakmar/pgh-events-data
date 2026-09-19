import Parser from "rss-parser";
import { type Feed, filterInvalid } from "../feed.ts";

const parser = new Parser();

export const name = "wyep";

export const getLinks = async (): Promise<Feed[]> => {
  const feed = await parser.parseURL(
    "https://www.wyep.org/tags/pittsburgh-artist-of-the-week.rss",
  );

  const links = feed.items.map((i) => ({
    title: i.title,
    subtitle: "WYEP",
    url: i.link,
    timestamp: i.isoDate,
    tags: ["blog"],
    image: "https://cdn-profiles.tunein.com/s24147/images/logog.png?t=160743",
  }));

  return filterInvalid(links);
};
