import Parser from "rss-parser";
import { type Feed, filterInvalid } from "../feed.ts";

const parser = new Parser({
  customFields: {
    item: [["media:thumbnail", "thumbnail"]],
  },
});

export const name = "no skip";

export const getLinks = async (): Promise<Feed[]> => {
  const feed = await parser.parseURL(
    "https://www.thenoskipshow.com/blog-feed.xml",
  );

  const links = feed.items.map((i) => ({
    title: i.title,
    subtitle: "The No Skip Show",
    url: i.link,
    timestamp: i.pubDate ? new Date(i.pubDate).toISOString() : undefined,
    tags: ["blog"],
    image: i.enclosure?.url,
  }));

  return filterInvalid(links);
};
