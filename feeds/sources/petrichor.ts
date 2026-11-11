import Parser from "rss-parser";
import { type Feed, filterInvalid } from "../feed.ts";

const parser = new Parser({
  customFields: {
    item: [["media:thumbnail", "thumbnail"]],
  },
});

export const name = "PETRICHOR";

export const getLinks = async (): Promise<Feed[]> => {
  const feed = await parser.parseURL("https://petrichorpittsburgh.com/feed");

  const links = feed.items.map((i) => ({
    title: i.title,
    subtitle: name,
    url: i.link,
    timestamp: i.isoDate,
    tags: ["blog"],
    image: i.thumbnail["$"].url,
  }));

  return filterInvalid(links);
};
