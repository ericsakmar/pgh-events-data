import Parser from "rss-parser";
import { type Feed, filterInvalid } from "../feed.ts";

const parser = new Parser({
  customFields: {
    item: [["media:thumbnail", "thumbnail"]],
  },
});

export const name = "pittsburgh city paper";

export const getLinks = async (): Promise<Feed[]> => {
  const feed = await parser.parseURL(
    "https://www.pghcitypaper.com/category/arts-entertainment-2/music/feed/",
  );

  const links = feed.items.map((i) => {
    const htmlContent = i["content:encoded"] || i.content || "";
    const srcMatch = htmlContent.match(/<img[^>]+src="([^"]+)"/i);
    const firstSrc = srcMatch ? srcMatch[1] : null;

    return {
      title: i.title,
      subtitle: "Pittsburgh City Paper",
      url: i.link,
      timestamp: i.pubDate ? new Date(i.pubDate).toISOString() : undefined,
      tags: ["blog"],
      image: firstSrc || undefined,
    };
  });

  return filterInvalid(links);
};
