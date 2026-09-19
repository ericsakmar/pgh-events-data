import Parser from "rss-parser";
import { type Feed, filterInvalid } from "../feed.ts";

const parser = new Parser();

export const name = "i'll call you right back";

export const getLinks = async (): Promise<Feed[]> => {
  const feed = await parser.parseURL("http://feeds.libsyn.com/112724/rss");

  const links = feed.items.map((i) => ({
    title: i.title,
    subtitle: "I'll Call You Right Back",
    url: i.link,
    timestamp: i.isoDate,
    tags: ["podcast"],
    image:
      "https://images.libsyn.com/p/assets/3/2/1/b/321b86b3a3f669ce16c3140a3186d450/Untitled_Artwork_2_copy-20250605-x0j16ngg2t.png?h=300&w=300&auto=compress",
  }));

  return filterInvalid(links);
};
